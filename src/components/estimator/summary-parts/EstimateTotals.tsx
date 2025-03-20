
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';

interface EstimateTotalsProps {
  subtotal: number;
  volumeDiscount: number;
  total: number;
  estimateSaved: boolean;
  onSaveEstimate: () => void;
}

export const EstimateTotals: React.FC<EstimateTotalsProps> = ({
  subtotal,
  volumeDiscount,
  total,
  estimateSaved,
  onSaveEstimate
}) => {
  return (
    <div className="summary-card">
      <div className="space-y-2 mb-4">
        <div className="summary-row">
          <span className="font-medium">Subtotal (before volume discount)</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        
        {volumeDiscount > 0 && (
          <div className="summary-row">
            <span className="font-medium text-green-600">Volume Discount</span>
            <span className="font-semibold text-green-600">-${volumeDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="summary-divider"></div>
      
      <div className="summary-row mt-4">
        <span className="text-lg font-bold">Total Estimate</span>
        <span className="text-xl font-bold text-blue-600">${total.toFixed(2)}</span>
      </div>
      
      {!estimateSaved && (
        <div className="mt-6 flex justify-center">
          <Button 
            className="inline-flex items-center gap-2 px-8 py-6 bg-blue-600 hover:bg-blue-700"
            onClick={onSaveEstimate}
          >
            <Save size={18} /> Save Estimate
          </Button>
        </div>
      )}
      
      {estimateSaved && (
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            className="inline-flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={18} /> Create New Estimate
          </Button>
        </div>
      )}
    </div>
  );
};
