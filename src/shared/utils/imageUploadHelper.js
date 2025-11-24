/**
 * imageUploadHelper.js - Utility functions for handling image uploads
 *
 * This module provides helper functions to:
 * 1. Extract images from envelope
 * 2. Upload images to backend
 * 3. Replace blob URLs with real URLs
 */

import { hierarchyService } from "../services/hierarchyService";

/**
 * Check if a URL is a blob URL (local preview URL)
 * @param {string} url - URL to check
 * @returns {boolean} True if blob URL
 */
export function isBlobUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("blob:") || url.startsWith("data:");
}

/**
 * Extract all images from envelope that need to be uploaded
 * Returns array of image objects with their location in envelope
 *
 * @param {Object} envelope - Question envelope
 * @returns {Array} Array of { path, url, file, alt } objects
 */
export function extractImagesFromEnvelope(envelope) {
  const imagesToUpload = [];

  if (!envelope) return imagesToUpload;

  // 1. Extract images from media array (used by MCQ, FIB, Multiple Fill In)
  if (envelope.media && Array.isArray(envelope.media)) {
    envelope.media.forEach((mediaItem, index) => {
      if (mediaItem.type === "image" && isBlobUrl(mediaItem.url)) {
        imagesToUpload.push({
          path: `media[${index}]`,
          url: mediaItem.url,
          alt: mediaItem.alt || "",
          file: mediaItem.file || null, // File object if available
        });
      }
    });
  }

  // 2. Extract images from detail.options (used by Image Choice)
  if (
    envelope.kind === "image_choice" &&
    envelope.detail?.options &&
    Array.isArray(envelope.detail.options)
  ) {
    envelope.detail.options.forEach((option, index) => {
      if (option.image && isBlobUrl(option.image.url)) {
        imagesToUpload.push({
          path: `detail.options[${index}].image`,
          url: option.image.url,
          alt: option.image.alt || "",
          file: option.image.file || null,
        });
      }
    });
  }

  // 3. Extract images from detail.blocks (used by Multiple Fill In)
  if (
    envelope.kind === "multiple_fill_in" &&
    envelope.detail?.blocks &&
    Array.isArray(envelope.detail.blocks)
  ) {
    envelope.detail.blocks.forEach((block, index) => {
      if (block.type === "image" && isBlobUrl(block.src)) {
        imagesToUpload.push({
          path: `detail.blocks[${index}]`,
          url: block.src,
          alt: block.alt || "",
          file: block.file || null,
        });
      }
    });
  }

  return imagesToUpload;
}

/**
 * Generate unique filename with timestamp and random string
 * @param {File|Blob} file - File or blob object
 * @returns {string} Unique filename
 */
function generateUniqueFilename(file) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = file.type.split("/")[1] || "jpg";
  return `question-${timestamp}-${random}.${extension}`;
}

/**
 * Upload a single image to backend
 * @param {Object} imageData - Image data { url, file, alt }
 * @returns {Promise<string>} Uploaded image URL from server
 */
export async function uploadSingleImage(imageData) {
  try {
    let fileToUpload = null;

    // If file object is available, use it directly
    if (imageData.file instanceof File) {
      fileToUpload = imageData.file;
    }
    // If only blob URL is available, fetch and convert to file
    else if (isBlobUrl(imageData.url)) {
      const response = await fetch(imageData.url);
      const blob = await response.blob();

      // Create unique filename
      const uniqueFilename = generateUniqueFilename(blob);
      fileToUpload = new File([blob], uniqueFilename, { type: blob.type });
    }
    // If already a real URL (http/https), return as is
    else {
      return imageData.url;
    }

    // Upload file to backend
    const uploadedUrl = await hierarchyService.uploadImage(fileToUpload);
    return uploadedUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

/**
 * Upload all images in parallel and return URL mapping
 * @param {Array} images - Array of image objects from extractImagesFromEnvelope
 * @param {Function} onProgress - Optional progress callback (current, total)
 * @returns {Promise<Map>} Map of old URL -> new URL
 */
export async function uploadAllImages(images, onProgress = null) {
  const urlMap = new Map();

  if (!images || images.length === 0) {
    return urlMap;
  }

  console.log(`📤 Uploading ${images.length} image(s)...`);

  // Upload all images in parallel
  const uploadPromises = images.map(async (imageData, index) => {
    try {
      const uploadedUrl = await uploadSingleImage(imageData);
      urlMap.set(imageData.url, uploadedUrl);

      if (onProgress) {
        onProgress(index + 1, images.length);
      }

      console.log(`✅ Uploaded image ${index + 1}/${images.length}:`, {
        old: imageData.url.substring(0, 50) + "...",
        new: uploadedUrl,
      });

      return { success: true, oldUrl: imageData.url, newUrl: uploadedUrl };
    } catch (error) {
      console.error(`❌ Failed to upload image ${index + 1}:`, error);
      return { success: false, oldUrl: imageData.url, error: error.message };
    }
  });

  const results = await Promise.all(uploadPromises);

  // Check if any uploads failed
  const failedUploads = results.filter((r) => !r.success);
  if (failedUploads.length > 0) {
    throw new Error(
      `Failed to upload ${failedUploads.length} image(s): ${failedUploads
        .map((f) => f.error)
        .join(", ")}`
    );
  }

  console.log(`✅ All ${images.length} image(s) uploaded successfully`);
  return urlMap;
}

/**
 * Replace blob URLs in envelope with real uploaded URLs
 * @param {Object} envelope - Original envelope with blob URLs
 * @param {Map} urlMap - Map of old URL -> new URL from uploadAllImages
 * @returns {Object} New envelope with replaced URLs
 */
export function replaceImageUrls(envelope, urlMap) {
  // Deep clone envelope to avoid mutating original
  const updatedEnvelope = JSON.parse(JSON.stringify(envelope));

  if (urlMap.size === 0) {
    return updatedEnvelope;
  }

  console.log(`🔄 Replacing ${urlMap.size} image URL(s)...`);

  // 1. Replace URLs in media array
  if (updatedEnvelope.media && Array.isArray(updatedEnvelope.media)) {
    updatedEnvelope.media.forEach((mediaItem) => {
      if (mediaItem.type === "image" && urlMap.has(mediaItem.url)) {
        const oldUrl = mediaItem.url;
        mediaItem.url = urlMap.get(mediaItem.url);
        console.log(`  ✓ Replaced media image: ${oldUrl.substring(0, 30)}...`);
      }
    });
  }

  // 2. Replace URLs in detail.options (Image Choice)
  if (
    updatedEnvelope.kind === "image_choice" &&
    updatedEnvelope.detail?.options &&
    Array.isArray(updatedEnvelope.detail.options)
  ) {
    updatedEnvelope.detail.options.forEach((option) => {
      if (option.image && urlMap.has(option.image.url)) {
        const oldUrl = option.image.url;
        option.image.url = urlMap.get(option.image.url);
        console.log(`  ✓ Replaced option image: ${oldUrl.substring(0, 30)}...`);
      }
    });
  }

  // 3. Replace URLs in detail.blocks (Multiple Fill In)
  if (
    updatedEnvelope.kind === "multiple_fill_in" &&
    updatedEnvelope.detail?.blocks &&
    Array.isArray(updatedEnvelope.detail.blocks)
  ) {
    updatedEnvelope.detail.blocks.forEach((block) => {
      if (block.type === "image" && urlMap.has(block.src)) {
        const oldUrl = block.src;
        block.src = urlMap.get(block.src);
        console.log(`  ✓ Replaced block image: ${oldUrl.substring(0, 30)}...`);
      }
    });
  }

  console.log(`✅ All URLs replaced successfully`);
  return updatedEnvelope;
}

/**
 * Main function: Process envelope and upload all images
 * This is the main entry point that combines all steps
 *
 * @param {Object} envelope - Original envelope with blob URLs
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Updated envelope with real URLs
 */
export async function processEnvelopeImages(envelope, onProgress = null) {
  try {
    console.log("🔍 Step 1: Extracting images from envelope...");
    const images = extractImagesFromEnvelope(envelope);

    if (images.length === 0) {
      console.log("ℹ️ No images to upload");
      return envelope;
    }

    console.log(`📋 Found ${images.length} image(s) to upload`);

    console.log("🔍 Step 2: Uploading images to backend...");
    const urlMap = await uploadAllImages(images, onProgress);

    console.log("🔍 Step 3: Replacing URLs in envelope...");
    const updatedEnvelope = replaceImageUrls(envelope, urlMap);

    console.log("✅ Image processing complete!");
    return updatedEnvelope;
  } catch (error) {
    console.error("❌ Image processing failed:", error);
    throw error;
  }
}

/**
 * Utility: Check if envelope has any images that need uploading
 * @param {Object} envelope - Question envelope
 * @returns {boolean} True if has blob URLs
 */
export function hasImagesToUpload(envelope) {
  const images = extractImagesFromEnvelope(envelope);
  return images.length > 0;
}

/**
 * Utility: Count total images in envelope (both blob and real URLs)
 * @param {Object} envelope - Question envelope
 * @returns {number} Total image count
 */
export function countTotalImages(envelope) {
  let count = 0;

  if (!envelope) return count;

  // Count media images
  if (envelope.media && Array.isArray(envelope.media)) {
    count += envelope.media.filter((m) => m.type === "image").length;
  }

  // Count option images (Image Choice)
  if (
    envelope.kind === "image_choice" &&
    envelope.detail?.options &&
    Array.isArray(envelope.detail.options)
  ) {
    count += envelope.detail.options.filter((o) => o.image).length;
  }

  // Count block images (Multiple Fill In)
  if (
    envelope.kind === "multiple_fill_in" &&
    envelope.detail?.blocks &&
    Array.isArray(envelope.detail.blocks)
  ) {
    count += envelope.detail.blocks.filter((b) => b.type === "image").length;
  }

  return count;
}
