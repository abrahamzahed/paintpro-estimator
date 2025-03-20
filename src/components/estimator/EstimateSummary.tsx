
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw, CheckCircle } from 'lucide-react';
import { EstimatorSummary } from '@/types/estimator';

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
      {estimateSaved ? (
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Estimate Saved!</h2>
          <p className="text-gray-600 mt-1">Your estimate has been saved successfully.</p>
        </div>
      ) : null}
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Project Details</h3>
        <dl className="grid grid-cols-[1fr_2fr] gap-y-3">
          <dt className="font-medium text-gray-600">Project Name:</dt>
          <dd>{contactInfo.projectName || "New Project"}</dd>
          
          <dt className="font-medium text-gray-600">Contact:</dt>
          <dd>{contactInfo.fullName}</dd>
          
          <dt className="font-medium text-gray-600">Address:</dt>
          <dd>{contactInfo.address}</dd>
          
          <dt className="font-medium text-gray-600">Rooms:</dt>
          <dd>{rooms.length}</dd>
        </dl>
      </div>
      
      <div className="mb-8">
        <h3 className="flex justify-between items-center text-xl font-semibold mb-4">
          <span>Current Estimate:</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </h3>
        
        <div className="space-y-6">
          <h4 className="text-lg font-medium mb-2">Rooms breakdown:</h4>
          
          {rooms.map((room, index) => (
            <div key={room.id} className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-lg font-medium">{room.name} (Room {index + 1})</h5>
                <span className="text-lg font-semibold">${room.price.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Size:</p>
                  <p>{room.size.size}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Paint Type:</p>
                  <p>{room.paintType.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Ceiling:</p>
                  <p>{room.options.highCeiling ? 'High ceiling' : 'Standard'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Wall Colors:</p>
                  <p>{room.options.twoColors ? 'Two colors' : 'Single color'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Closets:</p>
                  <p>{room.closets.walkInCount} walk-in, {room.closets.regularCount} regular</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Doors:</p>
                  <p>{room.doors.count} doors</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Windows:</p>
                  <p>{room.windows.count} windows</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Fireplace:</p>
                  <p>{room.fireplace}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Repairs:</p>
                  <p>{room.repairs}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Stair Railing:</p>
                  <p>{room.options.stairRailing ? 'Included' : 'Not included'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Baseboards:</p>
                  <p>{room.baseboardType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Baseboard Installation:</p>
                  <p>{room.baseboardInstallationFeet > 0 ? `${room.baseboardInstallationFeet} linear feet` : 'None'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Millwork Priming:</p>
                  <p>{room.options.millworkPriming ? 'Included' : 'Not needed'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Empty Room:</p>
                  <p>{room.options.emptyRoom ? 'Yes (Discounted)' : 'No'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">No Floor Covering:</p>
                  <p>{room.options.noFloorCovering ? 'Yes (Discounted)' : 'No'}</p>
                </div>
              </div>
              
              {/* Price breakdown */}
              <div className="mt-5 pt-4 border-t border-gray-200">
                <h6 className="font-medium mb-2">Price Breakdown:</h6>
                <div className="space-y-1 text-sm">
                  {Object.entries(room.priceDetails).map(([key, value]) => {
                    // Skip displaying items with zero value
                    if (value === 0) return null;
                    
                    // Format key for display
                    const formatKey = (key: string) => {
                      if (key === 'basePrice') return 'Base Price';
                      if (key === 'paintUpcharge') return 'Paint Upcharge';
                      if (key === 'baseboardUpcharge') return 'Baseboards';
                      if (key === 'highCeiling') return 'High Ceiling';
                      if (key === 'twoColors') return 'Two-Color';
                      if (key === 'millworkPriming') return 'Millwork Priming';
                      if (key === 'closets') return 'Closets';
                      if (key === 'fireplace') return 'Fireplace';
                      if (key === 'stairRailing') return 'Stair Railing';
                      if (key === 'repairs') return 'Repairs';
                      if (key === 'baseboardInstall') return 'Baseboard Install';
                      if (key === 'emptyRoomDiscount') return 'Empty House Discount';
                      if (key === 'noFloorCoveringDiscount') return 'No Floor Covering Discount';
                      
                      return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                    };
                    
                    // Format negative values as discounts in green
                    const isDiscount = value < 0;
                    const formattedValue = `${isDiscount ? '-' : '+'}$${Math.abs(value).toFixed(2)}`;
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span>{formatKey(key)}:</span>
                        <span className={isDiscount ? 'text-green-600 font-medium' : undefined}>
                          {formattedValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
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
      </div>
      
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
