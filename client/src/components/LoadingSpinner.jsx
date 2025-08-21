// frontend/src/components/LoadingSpinner.jsx
import React from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Processing image and detecting PII...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
