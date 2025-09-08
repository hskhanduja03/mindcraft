// ResultDisplay.jsx
import React from "react";
import {
  Eye,
  EyeOff,
  Shield,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import "../styles/ResultDisplay.css";

const ResultDisplay = ({ result }) => {
  if (!result) return null;
  return (
    <div className="result-container">
      <div className="result">
        <div className="result-header">
          <h2>Analysis Results</h2>
          <p className="result-subtitle">
            Your image has been processed and analyzed for sensitive information
          </p>
        </div>

        {/* Images Section */}
        <div className="section">
          <div className="section-header">
            <div className="section-icon">
              <ImageIcon size={20} />
            </div>
            <h3>Image Comparison</h3>
          </div>
          <div className="images">
            <div className="image-card">
              <div className="image-header">
                <Eye
                  size={18}
                  style={{ marginRight: "0.5rem", display: "inline" }}
                />
                Original Image
              </div>
              <div className="image-content">
                <div className="image-wrapper">
                  {result.originalFilename ? (
                    <img
                      src={`http://localhost:4200/uploads/${result.originalFilename}`}
                      alt="Original"
                      loading="lazy"
                    />
                  ) : (
                    <div className="no-image">
                      <ImageIcon
                        size={48}
                        style={{ marginBottom: "1rem", opacity: 0.5 }}
                      />
                      <p>No original image available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="image-card">
              <div className="image-header">
                <EyeOff
                  size={18}
                  style={{ marginRight: "0.5rem", display: "inline" }}
                />
                Masked Image
              </div>
              <div className="image-content">
                <div className="image-wrapper">
                  {result.maskedImage ? (
                    <img
                      src={`http://localhost:4200/${result.maskedImage}`}
                      alt="Masked"
                      loading="lazy"
                    />
                  ) : (
                    <div className="no-image">
                      <EyeOff
                        size={48}
                        style={{ marginBottom: "1rem", opacity: 0.5 }}
                      />
                      <p>No masked image available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Extracted Text Section */}
        <div className="section">
          <div className="section-header">
            <div className="section-icon">
              <FileText size={20} />
            </div>
            <h3>Extracted Text</h3>
          </div>
          <div className="text-content">
            <div className="text-header">OCR Results</div>
            <div className="text-body">
              {result.originalText && result.originalText.trim() ? (
                <pre className="text-pre">{result.originalText}</pre>
              ) : (
                <div className="no-text">
                  <FileText
                    size={32}
                    style={{ marginBottom: "0.5rem", opacity: 0.5 }}
                  />
                  <p>No text was extracted from the image</p>
                </div>
              )}
            </div>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default ResultDisplay;
