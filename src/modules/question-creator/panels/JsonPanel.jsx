// Placeholder - JsonPanel
import React, { useState } from "react";

export default function JsonPanel({ currentKind, onImportValid, envelope }) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onImportValid(parsed);
      setError("");
      setJsonText("");
    } catch (err) {
      setError("JSON không hợp lệ: " + err.message);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">JSON Editor</h3>

      {/* Current envelope display */}
      {envelope && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Current Envelope:</div>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(envelope, null, 2)}
          </pre>
        </div>
      )}

      {/* Import section */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Import JSON:</div>
        <textarea
          className="w-full p-2 border rounded font-mono text-xs"
          rows={6}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder='{"kind": "mcq_single", "prompt": "...", ...}'
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          onClick={handleImport}
        >
          Import JSON
        </button>
      </div>
    </div>
  );
}
