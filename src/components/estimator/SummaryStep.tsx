
import React from 'react';
import { EstimateSummary } from './EstimateSummary';
import { EstimatorSummary } from '@/types/estimator';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface SummaryStepProps {
  summary: EstimatorSummary;
  estimateSaved: boolean;
  sendingEmail: boolean;
  emailSent: boolean;
  onSaveEstimate: () => void;
  onSendEstimateEmail: () => void;
  onReset: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  summary,
  estimateSaved,
  sendingEmail,
  emailSent,
  onSaveEstimate,
  onSendEstimateEmail,
  onReset
}) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Estimate Summary</h2>
        <p className="text-gray-600 mt-1">Review your estimate, save it, and receive it via email.</p>
      </div>
      
      <EstimateSummary 
        summary={summary} 
        estimateSaved={estimateSaved}
        sendingEmail={sendingEmail}
        emailSent={emailSent}
        onSaveEstimate={onSaveEstimate}
        onSendEstimateEmail={onSendEstimateEmail}
      />

      <div className="mt-8 border-t border-gray-200 pt-6">
        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={() => {
            if (window.confirm('Are you sure you want to reset your estimate? All data will be lost.')) {
              onReset();
            }
          }}
        >
          <AlertTriangle size={16} />
          Reset Estimate
        </Button>
      </div>
    </div>
  );
};
