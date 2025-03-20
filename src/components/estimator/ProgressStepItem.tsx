
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressStepItemProps {
  stepNumber: number;
  label: string;
  currentStep: number;
  isLast?: boolean;
}

export const ProgressStepItem: React.FC<ProgressStepItemProps> = ({ 
  stepNumber, 
  label, 
  currentStep,
  isLast = false
}) => {
  const isActive = currentStep >= stepNumber;
  const isComplete = currentStep > stepNumber;
  
  return (
    <>
      <div className={cn("step-item", isActive ? "active" : "", isComplete ? "complete" : "")}>
        <div className="step">
          {isComplete ? <Check size={16} /> : stepNumber}
        </div>
        <p className="step-label">{label}</p>
      </div>
      
      {!isLast && (
        <div className="progress-connector mx-4 md:mx-10 lg:mx-16 md:w-32 lg:w-48"></div>
      )}
    </>
  );
};
