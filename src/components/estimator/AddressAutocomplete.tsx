
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useAddressAutocomplete } from "./address/useAddressAutocomplete";
import SuggestionsList from "./address/SuggestionsList";
import { AddressAutocompleteProps } from "./address/types";

const AddressAutocomplete = ({
  value,
  onChange,
  label = "Address",
  placeholder = "Enter your address",
  required = false,
  error,
  className,
  id = "address"
}: AddressAutocompleteProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    query,
    suggestions,
    isLoading,
    isFocused,
    setIsFocused,
    handleInputChange,
    handleSelect
  } = useAddressAutocomplete(value, onChange);

  return (
    <div className={cn("space-y-2 relative", className)}>
      <Label 
        htmlFor={id} 
        className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
      >
        {label}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={cn(error ? "border-red-500" : "")}
          autoComplete="off"
          autoSelectOnFocus={true}
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      
      {suggestions.length > 0 && isFocused && (
        <SuggestionsList 
          suggestions={suggestions} 
          onSelect={handleSelect} 
          dropdownRef={dropdownRef} 
        />
      )}
    </div>
  );
};

export default AddressAutocomplete;
