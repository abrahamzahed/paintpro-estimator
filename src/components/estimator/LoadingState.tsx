
import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="container-card my-8 flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
        <h3 className="text-lg font-medium">Loading estimator...</h3>
      </div>
    </div>
  );
};
