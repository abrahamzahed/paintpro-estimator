
import React from "react";
import { NominatimResult } from "./useAddressAutocomplete";
import SuggestionItem from "./SuggestionItem";

interface SuggestionsListProps {
  suggestions: NominatimResult[];
  onSelect: (suggestion: NominatimResult) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  onSelect,
  dropdownRef
}) => {
  if (!suggestions.length) return null;
  
  return (
    <div 
      ref={dropdownRef}
      className="absolute z-10 mt-1 w-full bg-background rounded-md shadow-lg border border-input overflow-hidden"
    >
      <ul className="py-1 max-h-60 overflow-auto">
        {suggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion.place_id}
            suggestion={suggestion}
            onSelect={onSelect}
          />
        ))}
      </ul>
      <div className="px-4 py-2 text-xs text-muted-foreground border-t">
        Data provided by OpenStreetMap | US addresses only
      </div>
    </div>
  );
};

export default SuggestionsList;
