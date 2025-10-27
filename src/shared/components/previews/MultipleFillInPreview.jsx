/**
 * MultipleFillInPreview - Preview component for MULTIPLE_FILL_IN questions
 * Displays question with multiple fill-in-the-blank fields
 */

import React from "react";

export default function MultipleFillInPreview({ prompt, detail, showAnswer }) {
  const blocks = detail?.blocks || [];
  const answers = detail?.answers || [];

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "text":
        return (
          <div
            key={index}
            className={`text-gray-800 ${block.down_line ? "mb-3" : "mb-2"}`}
          >
            {block.content}
          </div>
        );

      case "image":
        return (
          <div key={index} className="mb-4 flex justify-center">
            <img
              src={block.src}
              alt={block.alt || "Hình minh họa"}
              className="max-w-full h-auto rounded-lg border"
              style={{
                width: block.width || "auto",
                maxWidth: "400px",
              }}
            />
          </div>
        );

      case "fill-in-group":
        return (
          <div key={index} className="space-y-3 mb-4">
            {(block.items || []).map((item, itemIndex) => {
              const answer = answers.find((a) => a.id === item.input?.id);
              return (
                <div
                  key={itemIndex}
                  className={`flex items-center gap-2 flex-wrap ${
                    item.newLine ? "mt-3" : ""
                  }`}
                >
                  {item.before && (
                    <span className="text-gray-800">{item.before}</span>
                  )}
                  <input
                    type={item.input?.type || "text"}
                    placeholder={item.input?.placeholder || "..."}
                    value={showAnswer ? answer?.expression || "" : ""}
                    className="p-2 border border-blue-400 rounded text-center focus:outline-none focus:border-blue-600"
                    style={{ width: item.input?.width || "80px" }}
                    readOnly
                  />
                  {item.after && (
                    <span className="text-gray-800">{item.after}</span>
                  )}
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Render all blocks */}
      {blocks.map((block, index) => renderBlock(block, index))}

      {/* Show answers - always display */}
      {answers.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800 font-semibold mb-2">
            Đáp án:
          </div>
          <div className="space-y-1">
            {answers.map((answer, index) => (
              <div key={index} className="text-sm text-gray-700">
                <span className="font-mono text-xs bg-white px-2 py-1 rounded border mr-2">
                  {answer.id}
                </span>
                <span className="font-medium">{answer.expression}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
