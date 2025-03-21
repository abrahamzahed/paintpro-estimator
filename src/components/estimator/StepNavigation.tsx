import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  estimateSaved: boolean;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onSaveEstimate: () => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  estimateSaved,
  onPreviousStep,
  onNextStep,
  onSaveEstimate
}) => {
  return (
    <div className="flex justify-between mt-10">
      {currentStep > 1 && (
        <Button 
          variant="outline" 
          className="inline-flex items-center gap-2"
          onClick={onPreviousStep}
        >
          <ChevronLeft size={18} /> Back
        </Button>
      )}
      
      {currentStep < 3 ? (
        <Button 
          className="inline-flex items-center gap-2 ml-auto"
          onClick={onNextStep}
        >
          Next <ChevronRight size={18} />
        </Button>
      ) : (
        // Removed the Save Estimate button from here as it's now handled in the EstimateTotals component
        <div className="ml-auto"></div>
      )}
    </div>
  );
};
