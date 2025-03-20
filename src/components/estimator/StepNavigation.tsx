
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Check } from 'lucide-react';

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
        <div className="ml-auto">
          {!estimateSaved ? (
            <Button 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={onSaveEstimate}
            >
              <Save size={18} /> Save Estimate
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="inline-flex items-center gap-2 text-green-600 border-green-600"
              disabled
            >
              <Check size={18} /> Estimate Saved
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
