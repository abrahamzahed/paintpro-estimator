
import React from 'react';
import { EstimatorSummary } from '@/types/estimator';
import { SavedEstimateMessage } from './summary-parts/SavedEstimateMessage';
import { ProjectDetails } from './summary-parts/ProjectDetails';
import { RoomsList } from './summary-parts/RoomsList';
import { EstimateTotals } from './summary-parts/EstimateTotals';

interface EstimateSummaryProps {
  summary: EstimatorSummary;
  estimateSaved: boolean;
  onSaveEstimate: () => void;
}

export const EstimateSummary: React.FC<EstimateSummaryProps> = ({
  summary,
  estimateSaved,
  onSaveEstimate,
}) => {
  const { rooms, subtotal, volumeDiscount, total, contactInfo } = summary;

  return (
    <div className="animate-fade-in">
      <SavedEstimateMessage estimateSaved={estimateSaved} />
      
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
        onSaveEstimate={onSaveEstimate}
      />
    </div>
  );
};
