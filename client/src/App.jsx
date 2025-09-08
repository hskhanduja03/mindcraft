// App.jsx
import React, { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ResultDisplay from "./components/ResultDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import { Shield, Scan, Download } from "lucide-react";
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

  const features = [
    { icon: Scan, text: "Detect PII" },
    { icon: Shield, text: "Mask Sensitive Data" },
    { icon: Download, text: "Export Safely" },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>
            Privacy <span className="highlight">Guard</span>
          </h1>
          <p>
            AI-powered protection that automatically detects and masks sensitive
            information in your documents & images.
          </p>

          <div className="modern-features">
            {features.map((feature, index) => (
              <div key={index} className="modern-feature">
                <feature.icon size={22} />
                <span>{feature.text}</span>
              </div>
            ))}
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
                <p>Drop or select an image containing potential PII.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>AI Detection</h3>
                <p>Our model detects and extracts sensitive data instantly.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Download Secure File</h3>
                <p>Export a safe, masked version ready to share.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
