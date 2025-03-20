
import { RoomDetail, PricingData } from '@/types/estimator';
import { mockRepairOptions, mockFireplaceOptions } from '../constants/roomOptions';

export const calculateRoomPrice = (
  localRoom: RoomDetail,
  pricingData: PricingData
): RoomDetail => {
  if (!pricingData) return localRoom;
  
  const basePrice = localRoom.size.base_price;
  const priceDetails: Record<string, number> = { basePrice };
  
  // Calculate subtotal without paint upcharge first
  let roomSubtotal = basePrice;
  
  // Baseboard upcharge
  let baseboardUpchargePercentage = 0;
  if (localRoom.baseboardType === 'Brushed Baseboards') {
    baseboardUpchargePercentage = 25;
  } else if (localRoom.baseboardType === 'Sprayed Baseboards') {
    baseboardUpchargePercentage = 50;
  }
  const baseboardUpcharge = (basePrice * baseboardUpchargePercentage) / 100;
  priceDetails.baseboardUpcharge = baseboardUpcharge;
  roomSubtotal += baseboardUpcharge;
  
  // High ceiling
  if (localRoom.options.highCeiling) {
    priceDetails.highCeiling = 600;
    roomSubtotal += 600;
  }
  
  // Two colors
  if (localRoom.options.twoColors) {
    const twoColorsUpcharge = basePrice * 0.1;
    priceDetails.twoColors = twoColorsUpcharge;
    roomSubtotal += twoColorsUpcharge;
  }
  
  // Millwork priming
  if (localRoom.options.millworkPriming) {
    const millworkPrimingUpcharge = basePrice * 0.5;
    priceDetails.millworkPriming = millworkPrimingUpcharge;
    roomSubtotal += millworkPrimingUpcharge;
  }
  
  // Closets
  const regularClosetPrice = localRoom.closets.regularCount * 150;
  const walkInClosetPrice = localRoom.closets.walkInCount * 300;
  const closetsTotal = regularClosetPrice + walkInClosetPrice;
  if (closetsTotal > 0) {
    priceDetails.closets = closetsTotal;
    roomSubtotal += closetsTotal;
  }
  
  // Fireplace
  const fireplaceOption = mockFireplaceOptions.find(f => f.name === localRoom.fireplace);
  if (fireplaceOption && fireplaceOption.cost > 0) {
    priceDetails.fireplace = fireplaceOption.cost;
    roomSubtotal += fireplaceOption.cost;
  }
  
  // Stair railing
  if (localRoom.options.stairRailing) {
    priceDetails.stairRailing = 250;
    roomSubtotal += 250;
  }
  
  // Repairs
  const repairOption = mockRepairOptions.find(r => r.name === localRoom.repairs);
  if (repairOption && repairOption.cost > 0) {
    priceDetails.repairs = repairOption.cost;
    roomSubtotal += repairOption.cost;
  }
  
  // Baseboard installation
  if (localRoom.baseboardInstallationFeet > 0) {
    const baseboardInstallCost = localRoom.baseboardInstallationFeet * 2;
    priceDetails.baseboardInstall = baseboardInstallCost;
    roomSubtotal += baseboardInstallCost;
  }
  
  // Apply room-specific add-ons from Supabase
  pricingData.roomAddons.forEach(addon => {
    if (localRoom.options[addon.name as keyof typeof localRoom.options]) {
      const addonCost = addon.cost_percentage ? 
        basePrice * (addon.cost_percentage / 100) : addon.cost;
      priceDetails[addon.name] = addonCost;
      roomSubtotal += addonCost;
    }
  });
  
  // Now apply the paint type upcharge to the total room cost
  // Formula: total cost of the room + (total cost of room * percentage_upcharge) + fixed_upcharge
  const paintUpchargePercentage = localRoom.paintType.upcharge_percentage || 0;
  const paintUpchargeAmount = localRoom.paintType.upcharge_amount || 0;
  
  // Calculate the percentage-based upcharge
  const percentageUpcharge = (roomSubtotal * paintUpchargePercentage) / 100;
  
  // Add both the percentage and fixed upcharges
  const totalPaintUpcharge = percentageUpcharge + paintUpchargeAmount;
  
  if (totalPaintUpcharge > 0) {
    priceDetails.paintUpcharge = totalPaintUpcharge;
    roomSubtotal += totalPaintUpcharge;
  }
  
  // Apply discounts
  if (localRoom.options.emptyRoom) {
    const emptyRoomDiscount = roomSubtotal * 0.15;
    priceDetails.emptyRoomDiscount = -emptyRoomDiscount;
    roomSubtotal -= emptyRoomDiscount;
  }
  
  if (localRoom.options.noFloorCovering) {
    const noFloorDiscount = roomSubtotal * 0.05;
    priceDetails.noFloorCoveringDiscount = -noFloorDiscount;
    roomSubtotal -= noFloorDiscount;
  }
  
  return {
    ...localRoom,
    price: parseFloat(roomSubtotal.toFixed(2)),
    priceDetails,
  };
};
