
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SavedEstimateMessageProps {
  estimateSaved: boolean;
}

export const SavedEstimateMessage: React.FC<SavedEstimateMessageProps> = ({
  estimateSaved
}) => {
  if (!estimateSaved) return null;
  
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <CheckCircle size={64} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-bold">Estimate Saved!</h2>
      <p className="text-gray-600 mt-1">Your estimate has been saved successfully.</p>
    </div>
  );
};
