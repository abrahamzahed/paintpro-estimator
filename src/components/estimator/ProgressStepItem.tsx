
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
  const isActive = currentStep === stepNumber;
  const isComplete = currentStep > stepNumber;
  
  return (
    <div className="text-center">
      <div 
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full border-2 mx-auto mb-2",
          isActive ? "bg-blue-600 border-blue-600 text-white" : "",
          isComplete ? "bg-blue-600 border-blue-600 text-white" : "",
          !isActive && !isComplete ? "border-blue-600 text-blue-600" : ""
        )}
      >
        {isComplete ? <Check size={20} /> : stepNumber}
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};
