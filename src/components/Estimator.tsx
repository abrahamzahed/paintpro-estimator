
import React, { useEffect, useRef } from 'react';
import { PaintBucket } from 'lucide-react';
import { useEstimator } from '@/hooks/useEstimator';
import { ProgressSteps } from './estimator/ProgressSteps';
import { ContactStep } from './estimator/ContactStep';
import { DesignStep } from './estimator/DesignStep';
import { SummaryStep } from './estimator/SummaryStep';
import { StepNavigation } from './estimator/StepNavigation';
import { LoadingState } from './estimator/LoadingState';
import { 
  notifyParentAboutHeight, 
  notifyParentAboutStep, 
  notifyParentAboutSave,
  listenToParentMessages,
  isRunningInIframe
} from '@/utils/iframeHandler';

const Estimator = () => {
  const {
    currentStep,
    contactInfo,
    rooms,
    summary,
    pricingData,
    isLoading,
    estimateSaved,
    sendingEmail,
    emailSent,
    savedEstimateId,
    setContactInfo,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    handleSaveEstimate,
    handleSendEstimateEmail
  } = useEstimator();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inIframe = isRunningInIframe();
  
  // Handle height changes and notify parent frame
  useEffect(() => {
    if (!inIframe) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        notifyParentAboutHeight(height);
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [inIframe]);
  
  // Notify parent about step changes
  useEffect(() => {
    if (inIframe) {
      notifyParentAboutStep(currentStep);
    }
  }, [currentStep, inIframe]);
  
  // Notify parent about estimate saves
  useEffect(() => {
    if (inIframe && estimateSaved && savedEstimateId) {
      notifyParentAboutSave(savedEstimateId, summary);
    }
  }, [estimateSaved, savedEstimateId, summary, inIframe]);
  
  // Listen to messages from parent frame
  useEffect(() => {
    if (!inIframe) return;
    
    const cleanup = listenToParentMessages((message) => {
      // Handle various commands from parent
      if (message.type === 'paintpro-reset') {
        handleReset();
      } else if (message.type === 'paintpro-next-step' && currentStep < 3) {
        handleNextStep();
      } else if (message.type === 'paintpro-prev-step' && currentStep > 1) {
        handlePreviousStep();
      } else if (message.type === 'paintpro-prefill-contact' && message.data) {
        setContactInfo(prev => ({ ...prev, ...message.data }));
      }
    });
    
    return cleanup;
  }, [
    inIframe, 
    handleReset, 
    handleNextStep, 
    handlePreviousStep, 
    setContactInfo, 
    currentStep
  ]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto my-8 px-4 animate-fade-in">
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
              sendingEmail={sendingEmail}
              emailSent={emailSent}
              onSaveEstimate={handleSaveEstimate}
              onSendEstimateEmail={handleSendEstimateEmail}
              onReset={handleReset}
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
