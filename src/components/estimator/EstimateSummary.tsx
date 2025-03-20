
import React from 'react';
import { EstimatorSummary } from '@/types/estimator';
import { SavedEstimateMessage } from './summary-parts/SavedEstimateMessage';
import { ProjectDetails } from './summary-parts/ProjectDetails';
import { RoomsList } from './summary-parts/RoomsList';
import { EstimateTotals } from './summary-parts/EstimateTotals';

interface EstimateSummaryProps {
  summary: EstimatorSummary;
  estimateSaved: boolean;
  sendingEmail: boolean;
  emailSent: boolean;
  onSaveEstimate: () => void;
  onSendEstimateEmail: () => void;
}

export const EstimateSummary: React.FC<EstimateSummaryProps> = ({
  summary,
  estimateSaved,
  sendingEmail,
  emailSent,
  onSaveEstimate,
  onSendEstimateEmail,
}) => {
  const { rooms, subtotal, volumeDiscount, total, contactInfo } = summary;

  return (
    <div className="animate-fade-in">
      <SavedEstimateMessage 
        estimateSaved={estimateSaved} 
        emailSent={emailSent}
      />
      
      <ProjectDetails 
        contactInfo={contactInfo} 
        roomsCount={rooms.length} 
      />
      
      <RoomsList rooms={rooms} />
      
      <EstimateTotals 
        subtotal={subtotal}
        volumeDiscount={volumeDiscount}
        total={total}
        estimateSaved={estimateSaved}
        sendingEmail={sendingEmail}
        emailSent={emailSent}
        onSaveEstimate={onSaveEstimate}
        onSendEstimateEmail={onSendEstimateEmail}
      />
    </div>
  );
};
