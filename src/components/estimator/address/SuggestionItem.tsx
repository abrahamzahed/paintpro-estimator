
import React from "react";
import { SuggestionItemProps } from "./types";
import { formatAddress } from "./formatUtils";

const SuggestionItem: React.FC<SuggestionItemProps> = ({ 
  suggestion, 
  onSelect 
}) => {
  return (
    <li
      onClick={() => onSelect(suggestion)}
      className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
    >
      {formatAddress(suggestion)}
    </li>
  );
};

export default SuggestionItem;
