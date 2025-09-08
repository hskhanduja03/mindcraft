import React, { useEffect, useState } from "react";
import { FileText, Image, Shield, Sparkles } from "lucide-react";
import "../styles/LoadingSpinner.css";

const loadingMessages = [
  {
    message: "Scanning your image...",
    icon: Image,
  },
  {
    message: "Extracting text content...",
    icon: FileText,
  },
  {
    message: "Detecting sensitive information...",
    icon: Shield,
  },
  {
    message: "Applying privacy protection...",
    icon: Sparkles,
  },
];

const MinimalLoadingSpinner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial reveal animation
    const revealTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Message cycling
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => {
      clearTimeout(revealTimer);
      clearInterval(interval);
    };
  }, []);

  const CurrentIcon = loadingMessages[currentIndex].icon;

  return (
    <div className="minimal-loading-overlay">
      <div className={`minimal-loading-content ${isVisible ? "visible" : ""}`}>
        {/* Spinning Icon */}
        <div className="minimal-icon-container">
          <div className="minimal-spinner-ring"></div>
          <CurrentIcon className="minimal-current-icon" size={24} />
        </div>

        {/* Message with Drumroll Effect */}
        <div className="minimal-message-container">
          <p key={currentIndex} className="minimal-message">
            {loadingMessages[currentIndex].message}
          </p>
        </div>

        {/* Subtle Dots Indicator */}
        <div className="minimal-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default MinimalLoadingSpinner;
