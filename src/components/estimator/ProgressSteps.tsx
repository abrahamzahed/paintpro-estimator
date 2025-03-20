
import React from 'react';
import { ProgressStepItem } from './ProgressStepItem';

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Your Info' },
    { number: 2, label: 'Estimate' },
    { number: 3, label: 'Summary' }
  ];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <ProgressStepItem
              stepNumber={step.number}
              label={step.label}
              currentStep={currentStep}
            />
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-4">
                <div className={`h-full ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
