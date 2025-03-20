
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className={cn("step-item", currentStep >= 1 ? "active" : "", currentStep > 1 ? "complete" : "")}>
        <div className="step">
          {currentStep > 1 ? <Check size={16} /> : 1}
        </div>
        <p className="step-label">Your Info</p>
      </div>
      
      <div className="progress-connector mx-4 md:mx-10 lg:mx-16 md:w-32 lg:w-48"></div>
      
      <div className={cn("step-item", currentStep >= 2 ? "active" : "", currentStep > 2 ? "complete" : "")}>
        <div className="step">
          {currentStep > 2 ? <Check size={16} /> : 2}
        </div>
        <p className="step-label">Estimate</p>
      </div>
      
      <div className="progress-connector mx-4 md:mx-10 lg:mx-16 md:w-32 lg:w-48"></div>
      
      <div className={cn("step-item", currentStep >= 3 ? "active" : "")}>
        <div className="step">3</div>
        <p className="step-label">Summary</p>
      </div>
    </div>
  );
};
