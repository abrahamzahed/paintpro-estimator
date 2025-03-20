
import { RoomDetail, PricingData } from '@/types/estimator';

// Mock repair and fireplace options (these should eventually come from Supabase too)
const mockRepairOptions = [
  { id: 1, name: 'No Repairs', cost: 0 },
  { id: 2, name: 'Minor Repairs', cost: 250 },
  { id: 3, name: 'Major Repairs', cost: 750 }
];

const mockFireplaceOptions = [
  { id: 1, name: 'None', cost: 0 },
  { id: 2, name: 'Standard Mantel', cost: 200 },
  { id: 3, name: 'Custom Mantel', cost: 450 }
];

/**
 * Calculates the price for a given room based on its details and pricing data
 */
export const calculateRoomPrice = (room: RoomDetail, pricingData: PricingData | null): RoomDetail => {
  if (!pricingData) return room;
  
  const basePrice = room.size.base_price;
  const priceDetails: Record<string, number> = { basePrice };
  
  // Paint type upcharge
  const paintUpchargeAmount = room.paintType.upcharge_amount;
  const paintUpchargePercentage = (basePrice * room.paintType.upcharge_percentage) / 100;
  const paintUpcharge = Math.max(paintUpchargeAmount, paintUpchargePercentage);
  priceDetails.paintUpcharge = paintUpcharge;
  
  // Baseboard upcharge
  let baseboardUpchargePercentage = 0;
  if (room.baseboardType === 'Brushed Baseboards') {
    baseboardUpchargePercentage = 25;
  } else if (room.baseboardType === 'Sprayed Baseboards') {
    baseboardUpchargePercentage = 50;
  }
  const baseboardUpcharge = (basePrice * baseboardUpchargePercentage) / 100;
  priceDetails.baseboardUpcharge = baseboardUpcharge;
  
  // High ceiling
  if (room.options.highCeiling) {
    priceDetails.highCeiling = 600;
  }
  
  // Two colors
  if (room.options.twoColors) {
    priceDetails.twoColors = (basePrice * 0.1);
  }
  
  // Millwork priming
  if (room.options.millworkPriming) {
    priceDetails.millworkPriming = (basePrice * 0.5);
  }
  
  // Closets
  const regularClosetPrice = room.closets.regularCount * 150;
  const walkInClosetPrice = room.closets.walkInCount * 300;
  priceDetails.closets = regularClosetPrice + walkInClosetPrice;
  
  // Fireplace
  const fireplaceOption = mockFireplaceOptions.find(f => f.name === room.fireplace);
  if (fireplaceOption && fireplaceOption.cost > 0) {
    priceDetails.fireplace = fireplaceOption.cost;
  }
  
  // Stair railing
  if (room.options.stairRailing) {
    priceDetails.stairRailing = 250;
  }
  
  // Repairs
  const repairOption = mockRepairOptions.find(r => r.name === room.repairs);
  if (repairOption && repairOption.cost > 0) {
    priceDetails.repairs = repairOption.cost;
  }
  
  // Baseboard installation
  if (room.baseboardInstallationFeet > 0) {
    priceDetails.baseboardInstall = room.baseboardInstallationFeet * 2;
  }
  
  // Calculate subtotal before discounts
  let subtotal = Object.values(priceDetails).reduce((sum, value) => sum + value, 0);
  
  // Apply discounts
  if (room.options.emptyRoom) {
    const emptyRoomDiscount = subtotal * 0.15;
    priceDetails.emptyRoomDiscount = -emptyRoomDiscount;
  }
  
  if (room.options.noFloorCovering) {
    const noFloorDiscount = subtotal * 0.05;
    priceDetails.noFloorCoveringDiscount = -noFloorDiscount;
  }
  
  // Apply room-specific add-ons from Supabase
  pricingData.roomAddons.forEach(addon => {
    if (room.options[addon.name as keyof typeof room.options]) {
      const addonCost = addon.cost_percentage ? 
        basePrice * (addon.cost_percentage / 100) : addon.cost;
      priceDetails[addon.name] = addonCost;
    }
  });
  
  // Calculate final price
  const totalPrice = Object.values(priceDetails).reduce((sum, value) => sum + value, 0);
  
  return {
    ...room,
    price: parseFloat(totalPrice.toFixed(2)),
    priceDetails,
  };
};

export const getMockRepairOptions = () => mockRepairOptions;
export const getMockFireplaceOptions = () => mockFireplaceOptions;
