
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, CheckCircle, Save } from 'lucide-react';

interface EstimateTotalsProps {
  subtotal: number;
  volumeDiscount: number;
  total: number;
  estimateSaved: boolean;
  sendingEmail?: boolean;
  emailSent?: boolean;
  onSaveEstimate: () => void;
  onSendEstimateEmail?: () => void;
}

export const EstimateTotals: React.FC<EstimateTotalsProps> = ({
  subtotal,
  volumeDiscount,
  total,
  estimateSaved,
  sendingEmail = false,
  emailSent = false,
  onSaveEstimate,
  onSendEstimateEmail
}) => {
  // Format values as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex flex-col gap-2 items-end text-right mb-6">
        <div className="flex justify-between w-full md:w-1/2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between w-full md:w-1/2">
          <span className="text-gray-600">Volume Discount:</span>
          <span className="font-medium text-green-600">-{formatCurrency(volumeDiscount)}</span>
        </div>
        
        <div className="flex justify-between w-full md:w-1/2 text-lg font-bold mt-1">
          <span>Total Estimate:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-8 justify-end">
        {estimateSaved && emailSent ? (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-green-600 border-green-600"
            disabled
          >
            <CheckCircle size={18} /> Estimate Saved & Email Sent
          </Button>
        ) : (
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={onSaveEstimate}
            disabled={sendingEmail}
          >
            {sendingEmail ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {sendingEmail ? 'Saving...' : 'Save Estimate & Email a Copy'}
          </Button>
        )}
      </div>
    </div>
  );
};
