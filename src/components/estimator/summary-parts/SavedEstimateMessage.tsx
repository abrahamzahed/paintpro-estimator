
import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface SavedEstimateMessageProps {
  estimateSaved: boolean;
  emailSent?: boolean;
  emailNotification?: string | null;
}

export const SavedEstimateMessage: React.FC<SavedEstimateMessageProps> = ({ 
  estimateSaved, 
  emailSent = false,
  emailNotification = null 
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
        
        {emailNotification && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
            <Info size={16} className="text-blue-500 flex-shrink-0" />
            <p className="text-blue-700 text-xs">{emailNotification}</p>
          </div>
        )}
      </div>
    </div>
  );
};
