
import { NominatimResult } from './useAddressAutocomplete';

/**
 * Format an address from a Nominatim result
 */
export const formatAddress = (suggestion: NominatimResult): string => {
  const address = suggestion.address;
  const parts = [];

  if (address.house_number) parts.push(address.house_number);
  if (address.road) parts.push(address.road);
  
  if (address.city) parts.push(address.city);
  
  if (address.state) parts.push(address.state);
  
  if (address.postcode) parts.push(address.postcode);
  
  return parts.join(", ");
};
