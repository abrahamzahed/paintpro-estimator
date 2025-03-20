
import React from 'react';
import { EstimateSummary } from './EstimateSummary';
import { EstimatorSummary } from '@/types/estimator';

interface SummaryStepProps {
  summary: EstimatorSummary;
  estimateSaved: boolean;
  onSaveEstimate: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  summary,
  estimateSaved,
  onSaveEstimate
}) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Estimate Summary</h2>
        <p className="text-gray-600 mt-1">Review your estimate and save it.</p>
      </div>
      
      <EstimateSummary 
        summary={summary} 
        estimateSaved={estimateSaved}
        onSaveEstimate={onSaveEstimate}
      />
    </div>
  );
};
