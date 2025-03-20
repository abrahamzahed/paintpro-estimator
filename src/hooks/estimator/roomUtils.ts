
import { v4 as uuidv4 } from 'uuid';
import { RoomDetail, PricingData, BaseboardType } from '@/types/estimator';

/**
 * Creates a new room with default values
 */
export const createDefaultRoom = (pricingData: PricingData): RoomDetail | null => {
  if (!pricingData || pricingData.roomTypes.length === 0 || pricingData.roomSizes.length === 0 || pricingData.paintTypes.length === 0) {
    return null;
  }
  
  // Get the first room type from pricing data
  const defaultRoomType = pricingData.roomTypes[0];
  
  // Get sizes for this room type
  const sizesForRoomType = pricingData.roomSizes.filter(
    size => size.room_type_id === defaultRoomType.id
  );
  
  // Select the average size (middle element) for better default experience
  const middleIndex = Math.floor(sizesForRoomType.length / 2);
  const defaultSize = sizesForRoomType.length > 0 
    ? sizesForRoomType[middleIndex] 
    : pricingData.roomSizes[0];
  
  // Find "Own Paint/ No Paint" or use the first paint type
  const ownPaintType = pricingData.paintTypes.find(p => p.name === 'Own Paint/ No Paint');
  const defaultPaintType = ownPaintType || pricingData.paintTypes[0];
  
  return {
    id: uuidv4(),
    name: `${defaultRoomType.name}`,
    roomType: defaultRoomType,
    size: defaultSize,
    paintType: defaultPaintType,
    baseboardType: 'No Baseboards', // Default to "No Baseboards" 
    options: {
      emptyRoom: false,
      noFloorCovering: false,
      twoColors: false,
      millworkPriming: false, // This will be disabled by default
      highCeiling: false,
      paintCeiling: false,
      stairRailing: false,
    },
    doors: {
      count: 0,
      paintMethod: 'Spray',
    },
    windows: {
      count: 0,
      paintMethod: 'Spray',
    },
    closets: {
      walkInCount: 0,
      regularCount: 0,
    },
    fireplace: 'None', // Default to "None"
    repairs: 'No Repairs',
    baseboardInstallationFeet: 0,
    price: defaultSize.base_price,
    priceDetails: {
      basePrice: defaultSize.base_price,
    },
  };
};
