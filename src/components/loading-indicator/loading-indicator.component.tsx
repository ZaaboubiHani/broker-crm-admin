import React from 'react';
import '../loading-indicator/loading-indicator.style.css';

interface LoadingIndicatorProps{
    isLoading:boolean,
}


const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  return (
    <div className="loading-indicator">
      {isLoading && <div className="spinner"></div>}
    </div>
  );
};

export default LoadingIndicator;