// Placeholder - PreviewPanel
import React from "react";

export default function PreviewPanel({ envelope, registry }) {
  if (!envelope) {
    return (
      <div className="text-gray-500 text-center p-8">
        <p>Chưa có dữ liệu preview</p>
      </div>
    );
  }

  const PreviewComponent = registry?.Preview;

  if (!PreviewComponent) {
    return (
      <div className="text-gray-500 text-center p-8">
        <p>Chưa có component preview cho loại này</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <div className="border rounded-lg p-4 bg-white">
        <PreviewComponent
          prompt={envelope.prompt}
          detail={envelope.detail}
          showAnswer={true}
        />
      </div>
    </div>
  );
}
