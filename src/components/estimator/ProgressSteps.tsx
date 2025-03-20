
import React from 'react';
import { ProgressStepItem } from './ProgressStepItem';
import { Progress } from '@/components/ui/progress';

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const totalSteps = 3;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  const steps = [
    { number: 1, label: 'Your Info' },
    { number: 2, label: 'Estimate' },
    { number: 3, label: 'Summary' }
  ];
  
  return (
    <div className="mb-8">
      <Progress 
        value={progressPercentage} 
        className="h-2 mb-8 bg-gray-200" 
        aria-label="Progress through estimator steps"
      />
      
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <ProgressStepItem
              stepNumber={step.number}
              label={step.label}
              currentStep={currentStep}
              isLast={index === steps.length - 1}
            />
            
            {index < steps.length - 1 && (
              <div className={`h-[2px] w-24 md:w-48 mx-2 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
