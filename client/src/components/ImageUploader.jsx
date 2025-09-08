// ImageUploader.jsx
import React, { useState, useRef, useCallback } from "react";
import { Upload, Image, X, Loader2 } from "lucide-react";
import { processImage } from "../services/api";
import "../styles/ImageUploader.css";

const ImageUploader = ({ onProcessingStart, onProcessingComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Please upload a valid image file (JPEG, PNG, GIF, WebP)"
      );
    }

    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB");
    }

    return true;
  };

  const createPreview = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const processFile = useCallback(
    async (file) => {
      try {
        validateFile(file);
        createPreview(file);

        setIsProcessing(true);
        setError("");

        onProcessingStart?.();

        const result = await processImage(file);
        onProcessingComplete?.(result);
      } catch (err) {
        console.error("Upload error:", err);
        setError(
          err.message || err?.response?.data?.error || "Failed to process image"
        );
        setPreview(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [onProcessingStart, onProcessingComplete]
  );

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      processFile(files[0]);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="uploader-wrapper">
      <div
        className={`uploader-container ${isDragging ? "dragging" : ""} ${
          isProcessing ? "processing" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        style={{
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isProcessing}
          className="file-input"
          aria-label="Upload image"
        />

        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />

            {!isProcessing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearPreview();
                }}
                className="remove-button"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            )}

            {isProcessing && (
              <div className="processing-overlay">
                <div className="processing-content">
                  <Loader2 size={32} className="processing-spinner" />
                  <p>Processing image...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">
              {isProcessing ? (
                <Loader2 size={32} className="processing-spinner" />
              ) : (
                <Upload size={32} />
              )}
            </div>

            <h2>{isProcessing ? "Processing..." : "Upload your image"}</h2>

            <p>
              {isDragging
                ? "Drop your image here"
                : "Drag & drop your image here, or click to browse"}
            </p>

            <div className="upload-box">
              <label
                className={`upload-label ${isProcessing ? "disabled" : ""}`}
              >
                {isProcessing ? "Processing..." : "Choose Image"}
              </label>
            </div>

            <div className="instructions">
              <Image
                size={16}
                style={{
                  display: "inline-block",
                  marginRight: "0.5rem",
                  verticalAlign: "middle",
                }}
              />
              Supports JPEG, PNG, GIF, WebP (max 10MB)
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-container">
          <div className="error-icon">
            <X size={12} />
          </div>
          <div className="error-content">
            <h4>Upload Error</h4>
            <p className="error-message">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
