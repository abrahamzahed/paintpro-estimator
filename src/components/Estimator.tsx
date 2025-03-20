
import React from 'react';
import { PaintBucket } from 'lucide-react';
import { useEstimator } from '@/hooks/useEstimator';
import { ProgressSteps } from './estimator/ProgressSteps';
import { ContactStep } from './estimator/ContactStep';
import { DesignStep } from './estimator/DesignStep';
import { SummaryStep } from './estimator/SummaryStep';
import { StepNavigation } from './estimator/StepNavigation';
import { LoadingState } from './estimator/LoadingState';

const Estimator = () => {
  const {
    currentStep,
    contactInfo,
    rooms,
    summary,
    pricingData,
    isLoading,
    estimateSaved,
    setContactInfo,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    handleSaveEstimate
  } = useEstimator();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 animate-fade-in">
      <div className="text-left mb-6 flex items-center">
        <PaintBucket size={28} className="text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Paint Pro Estimator</h1>
      </div>
      
      <div className="container-card overflow-hidden">
        <ProgressSteps currentStep={currentStep} />
        
        <div className="mt-10">
          {currentStep === 1 && (
            <ContactStep 
              contactInfo={contactInfo} 
              setContactInfo={setContactInfo} 
            />
          )}
          
          {currentStep === 2 && pricingData && (
            <DesignStep 
              rooms={rooms}
              pricingData={pricingData}
              onUpdateRoom={handleUpdateRoom}
              onDeleteRoom={handleDeleteRoom}
              onAddRoom={handleAddRoom}
              onReset={handleReset}
              onPreviousStep={handlePreviousStep}
            />
          )}
          
          {currentStep === 3 && (
            <SummaryStep 
              summary={summary}
              estimateSaved={estimateSaved}
              onSaveEstimate={handleSaveEstimate}
            />
          )}
        </div>
        
        <StepNavigation 
          currentStep={currentStep}
          estimateSaved={estimateSaved}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          onSaveEstimate={handleSaveEstimate}
        />
      </div>
      
      <div className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} Paint Pro. All rights reserved.
      </div>
    </div>
  );
};

export default Estimator;
