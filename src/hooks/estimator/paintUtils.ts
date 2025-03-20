
import { PaintType, PricingData } from '@/types/estimator';

/**
 * Ensures "Own Paint/ No Paint" option is available in paint types
 */
export const ensureOwnPaintOption = (paintTypes: PaintType[]): PaintType[] => {
  // Add "Own Paint/ No Paint" option to paint types if not already there
  const ownPaintOption: PaintType = {
    id: 'own-paint',
    name: 'Own Paint/ No Paint',
    upcharge_percentage: 0,
    upcharge_amount: 0,
    description: 'Customer will provide their own paint'
  };
  
  // Make sure we don't add it if it already exists
  if (!paintTypes.some(p => p.name === 'Own Paint/ No Paint')) {
    return [ownPaintOption, ...paintTypes];
  }
  
  return paintTypes;
};

/**
 * Processes pricing data to ensure all required options are present
 */
export const processPricingData = (data: PricingData): PricingData => {
  // Add "Own Paint/ No Paint" option to paint types
  const updatedPaintTypes = ensureOwnPaintOption(data.paintTypes);
  
  return {
    ...data,
    paintTypes: updatedPaintTypes
  };
};
