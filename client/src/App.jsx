// App.jsx
import React, { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ResultDisplay from "./components/ResultDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import "./styles/App.css";

function App() {
  const [processingResult, setProcessingResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessingComplete = (result) => {
    setProcessingResult(result);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setProcessingResult(null);
    setIsProcessing(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Harmeet's App</h1>
          <p>
            Protect privacy by automatically detecting and masking Personally
            Identifiable Information in any image
          </p>
          <div className="header-features">
            <div className="feature">
              <span className="feature-icon"></span>
              <span>Detect PII</span>
            </div>
            <div className="feature">
              <span className="feature-icon"></span>
              <span>Mask Sensitive Data</span>
            </div>
            <div className="feature">
              <span className="feature-icon"></span>
              <span>Export Safely</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <ImageUploader
          onProcessingStart={handleProcessingStart}
          onProcessingComplete={handleProcessingComplete}
        />

        {isProcessing && <LoadingSpinner />}

        {processingResult && <ResultDisplay result={processingResult} />}

        {!processingResult && !isProcessing && (
          <div className="info-section">
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Upload Image</h3>
                <p>Select any image containing text with potential PII</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>AI Processing</h3>
                <p>Our system detects PII using advanced algorithms</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Download Safe Image</h3>
                <p>Get your image with all sensitive information masked</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          PII Masking Application &copy; 2023 | Built with React and Google
          Vision API
        </p>
      </footer>
    </div>
  );
}

export default App;
