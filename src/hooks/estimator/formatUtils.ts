
/**
 * Utility functions for consistent formatting across the estimator
 */

/**
 * Formats a price detail key into a user-friendly display name
 */
export const formatKeyName = (key: string): string => {
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
  if (key === 'emptyRoomDiscount') return 'Empty Room Discount';
  if (key === 'noFloorCoveringDiscount') return 'No Floor Covering Discount';
  
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

/**
 * Formats a price value as a string with appropriate sign and decimal places
 */
export const formatPriceValue = (value: number): string => {
  const isDiscount = value < 0;
  return `${isDiscount ? '-' : '+'}$${Math.abs(value).toFixed(2)}`;
};

/**
 * Formats a price for display (without + sign)
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
