import React from "react";

const ResultDisplay = ({ result }) => {
  if (!result) return null;
  console.log(result);

  // Extract detected PII into a flat array
  const detectedPII = result.piiDetected
    ? Object.entries(result.piiDetected).flatMap(([type, values]) =>
        values.map((val) => `${type}: ${val}`)
      )
    : [];

  return (
    <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Processing Results</h2>

      {/* Original Image */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Original Image</h3>
        {result.originalFilename ? (
          <img
            src={`http://localhost:4200/uploads/${result.originalFilename}`}
            alt="Original upload"
            className="max-w-full h-auto border rounded-lg shadow"
          />
        ) : (
          <p className="text-gray-500">Original image not available</p>
        )}
      </div>

      {/* Masked Image */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Masked Image</h3>
        {result.maskedImage ? (
          <img
            src={`http://localhost:4200/${result.maskedImage}`}
            alt="Masked document"
            className="max-w-full h-auto border rounded-lg shadow"
          />
        ) : (
          <p className="text-gray-500">Masked document not available</p>
        )}
      </div>

      {/* Detected PII */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Detected PII</h3>
        {detectedPII.length > 0 ? (
          <ul className="list-disc pl-5">
            {detectedPII.map((pii, idx) => (
              <li key={idx} className="text-gray-700">
                {pii}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No PII detected</p>
        )}
      </div>

      {/* Extracted Text */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Extracted Text</h3>
        <pre className="whitespace-pre-wrap text-gray-700 bg-gray-100 p-3 rounded-lg">
          {result.originalText || "No text extracted"}
        </pre>
      </div>
    </div>
  );
};

export default ResultDisplay;
