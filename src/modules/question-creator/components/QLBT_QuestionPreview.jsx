/**
 * QLBT_QuestionPreview - Preview component for QuanLyBaiTap questions
 *
 * NEW COMPONENT - Written from scratch for QuanLyBaiTap
 * Renders questions in preview mode with all block types
 */

import React from "react";

const QLBT_QuestionPreview = ({
  blocks = [],
  answers = [],
  variables = {},
  title = "Xem trước câu hỏi",
}) => {
  const renderBlock = (block, index) => {
    switch (block.type) {
      case "text":
        return (
          <div key={index} className="qlbt-preview-text">
            <p className={`text-gray-800 ${block.down_line ? "mb-3" : "mb-2"}`}>
              {block.content}
            </p>
          </div>
        );

      case "image":
        return (
          <div key={index} className="qlbt-preview-image mb-4">
            <img
              src={block.src}
              alt={block.alt || "Hình ảnh"}
              className="max-w-full h-auto rounded-lg border"
              style={{
                width: block.width || "auto",
                maxWidth: "400px",
                margin: block.align === "center" ? "0 auto" : "0",
              }}
            />
          </div>
        );

      case "input":
        return (
          <div key={index} className="qlbt-preview-input mb-4">
            <input
              type={block.input_type || "text"}
              placeholder={block.placeholder || "Đáp án..."}
              className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              style={{ width: block.width || "100px" }}
              disabled
            />
          </div>
        );

      case "multiple-choice":
        return (
          <div key={index} className="qlbt-preview-multiple-choice mb-4">
            <div className="space-y-2">
              {(block.choices || []).map((choice, choiceIndex) => (
                <label
                  key={choiceIndex}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name={`preview_choice_${index}`}
                    className="text-blue-500"
                    disabled
                  />
                  <span className="text-gray-700">{choice}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "fill-in-group":
        return (
          <div key={index} className="qlbt-preview-fill-in-group mb-4">
            <div className="space-y-3">
              {(block.items || []).map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`flex items-center flex-wrap gap-2 ${
                    item.newLine ? "mt-2" : ""
                  }`}
                >
                  {item.before && (
                    <span className="text-gray-800">{item.before}</span>
                  )}
                  <input
                    type={item.input?.type || "text"}
                    placeholder={item.input?.placeholder || "..."}
                    className="p-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500"
                    style={{ width: item.input?.width || "60px" }}
                    disabled
                  />
                  {item.after && (
                    <span className="text-gray-800">{item.after}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "image-choice":
        return (
          <div key={index} className="qlbt-preview-image-choice mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(block.choiceImages || []).map((image, imageIndex) => (
                <label
                  key={imageIndex}
                  className="flex flex-col items-center space-y-2 cursor-pointer border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300"
                >
                  <input
                    type="radio"
                    name={`preview_image_choice_${index}`}
                    className="text-blue-500"
                    disabled
                  />
                  <img
                    src={image.url || image}
                    alt={`Lựa chọn ${imageIndex + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className="qlbt-preview-unknown mb-2">
            <div className="text-gray-500 italic">
              [Loại block không hỗ trợ: {block.type}]
            </div>
          </div>
        );
    }
  };

  if (!blocks || blocks.length === 0) {
    return (
      <div className="qlbt-preview-empty">
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📝</div>
          <p>Chưa có nội dung để xem trước</p>
          <p className="text-sm">Nhập câu hỏi để xem kết quả</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qlbt-question-preview">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">👁️</span>
          {title}
        </h3>

        <div className="qlbt-preview-content">
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>

        {/* Show answers in preview (for debugging) */}
        {answers && answers.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Đáp án (chỉ thấy khi xem trước):
            </h4>
            <div className="space-y-1">
              {answers.map((answer, index) => (
                <div key={index} className="text-xs text-gray-500">
                  <span className="font-mono">{answer.id}</span>:{" "}
                  {answer.expression}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QLBT_QuestionPreview;
