
import { useState, useEffect } from 'react';
import { 
  EstimatorSummary, 
  RoomDetail, 
  ContactInfo, 
  PricingData
} from '@/types/estimator';

export const useSummary = (rooms: RoomDetail[], contactInfo: ContactInfo, pricingData: PricingData | null) => {
  const [summary, setSummary] = useState<EstimatorSummary>({
    subtotal: 0,
    volumeDiscount: 0,
    total: 0,
    rooms: [],
    contactInfo,
  });

  // Calculate summary whenever rooms change
  useEffect(() => {
    if (rooms.length > 0 && pricingData) {
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
      
      setSummary({
        subtotal,
        volumeDiscount,
        total,
        rooms,
        contactInfo,
      });
    } else {
      setSummary({
        subtotal: 0,
        volumeDiscount: 0,
        total: 0,
        rooms: [],
        contactInfo,
      });
    }
  }, [rooms, contactInfo, pricingData]);

  return {
    summary,
  };
};
