
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SavedEstimateMessageProps {
  estimateSaved: boolean;
  emailSent?: boolean;
}

export const SavedEstimateMessage: React.FC<SavedEstimateMessageProps> = ({ 
  estimateSaved, 
  emailSent = false 
}) => {
  if (!estimateSaved) return null;
  
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 flex items-start gap-3">
      <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
      <div>
        <h3 className="font-medium text-green-800">Estimate successfully saved!</h3>
        <p className="text-green-700 text-sm mt-1">
          Your estimate has been saved to our database.
          {emailSent && " It has also been sent to the client via email."}
        </p>
      </div>
    </div>
  );
};
