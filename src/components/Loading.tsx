import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-6 w-6 border-t-5 border-b-4 border-green-500"></div>
    </div>
  );
};

export default LoadingSpinner;
