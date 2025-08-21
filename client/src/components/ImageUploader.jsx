// src/components/ImageUploader.jsx
import React, { useState } from "react";
import { processImage } from "../services/api";
import "../styles/ImageUploader.css";

const ImageUploader = ({ onProcessingStart, onProcessingComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // check if valid image
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // notify parent
      onProcessingStart && onProcessingStart();

      // send file to backend
      const result = await processImage(file);

      // send result to parent
      onProcessingComplete && onProcessingComplete(result);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err?.response?.data?.error || "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="uploader-container">
      <div className="upload-box">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isProcessing}
        />
        <label
          htmlFor="image-upload"
          className={isProcessing ? "disabled" : ""}
        >
          {isProcessing ? "Processing..." : "Choose an Image"}
        </label>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageUploader;
