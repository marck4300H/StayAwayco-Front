import React from "react";
import "../styles/componentscss/progressbar.css";

export default function ProgressBar({ porcentaje = 0, label = "Progreso", showPercentage = true, animated = true }) {
  // Asegurarnos de que el porcentaje esté entre 0 y 100
  const progressPercentage = Math.min(100, Math.max(0, porcentaje));
  
  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        {showPercentage && (
          <span className="progress-percentage">{progressPercentage}%</span>
        )}
      </div>
      <div className="progress-bar-background">
        <div 
          className={`progress-bar-fill ${animated ? 'animated' : ''}`}
          style={{ width: `${progressPercentage}%` }}
        >
          {showPercentage && progressPercentage >= 30 && (
            <span className="progress-text">{progressPercentage}%</span>
          )}
        </div>
      </div>
    </div>
  );
}