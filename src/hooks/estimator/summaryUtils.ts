
import { RoomDetail, ContactInfo, EstimatorSummary, PricingData } from '@/types/estimator';

/**
 * Calculates the complete estimator summary
 */
export const calculateEstimatorSummary = (
  rooms: RoomDetail[],
  contactInfo: ContactInfo,
  pricingData: PricingData | null
): EstimatorSummary => {
  if (rooms.length === 0 || !pricingData) {
    return {
      subtotal: 0,
      volumeDiscount: 0,
      total: 0,
      rooms: [],
      contactInfo
    };
  }

  const subtotal = rooms.reduce((total, room) => total + room.price, 0);
  
  // Calculate volume discount
  let volumeDiscountPercentage = 0;
  for (let i = pricingData.volumeDiscounts.length - 1; i >= 0; i--) {
    if (subtotal >= pricingData.volumeDiscounts[i].threshold) {
      volumeDiscountPercentage = pricingData.volumeDiscounts[i].discount_percentage;
      break;
    }
  }
  
  const volumeDiscount = (subtotal * volumeDiscountPercentage) / 100;
  const total = subtotal - volumeDiscount;
  
  return {
    subtotal,
    volumeDiscount,
    total,
    rooms,
    contactInfo,
  };
};
