
import { NominatimResult } from './useAddressAutocomplete';

export interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

export interface SuggestionItemProps {
  suggestion: NominatimResult;
  onSelect: (suggestion: NominatimResult) => void;
}
