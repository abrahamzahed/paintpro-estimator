
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressStepItemProps {
  stepNumber: number;
  label: string;
  currentStep: number;
}

export const ProgressStepItem: React.FC<ProgressStepItemProps> = ({ 
  stepNumber, 
  label, 
  currentStep
}) => {
  const isActive = currentStep === stepNumber;
  const isComplete = currentStep > stepNumber;
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "w-12 h-12 flex items-center justify-center rounded-full text-lg font-semibold",
          isActive ? "bg-blue-600 text-white" : "",
          isComplete ? "bg-blue-600 text-white" : "",
          !isActive && !isComplete ? "bg-white border-2 border-blue-600 text-blue-600" : ""
        )}
      >
        {stepNumber}
      </div>
      <span className={cn(
        "mt-2 text-sm font-medium",
        isActive || isComplete ? "text-blue-600" : "text-gray-500"
      )}>
        {label}
      </span>
    </div>
  );
};
