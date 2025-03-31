
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { formatAddress } from "./formatUtils";

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

export function useAddressAutocomplete(
  initialValue: string,
  onChange: (value: string) => void
) {
  const { toast } = useToast();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 3) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  const fetchSuggestions = async (input: string) => {
    if (input.trim().length < 3) return;
    
    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: input,
          format: "json",
          addressdetails: 1,
          limit: 5,
          countrycodes: "us", // Only include US addresses
          state: "washington" // Reintroducing the Washington state parameter
        },
        headers: {
          "User-Agent": "PaintPro Web Application",
          "Accept-Language": "en-US,en;q=0.9"
        },
        signal: abortControllerRef.current.signal
      });
      
      // Also filter results to ensure they're Washington addresses
      const waResults = response.data.filter((result: NominatimResult) => {
        return result.address?.state?.toLowerCase() === "washington";
      });
      
      setSuggestions(waResults);
    } catch (error) {
      // Don't show error for aborted requests
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        return;
      }
      
      console.error("Error fetching address suggestions:", error);
      toast({
        title: "Error fetching addresses",
        description: "Could not load address suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onChange(value);
  };

  const handleSelect = (suggestion: NominatimResult) => {
    const selectedAddress = formatAddress(suggestion);
    setQuery(selectedAddress);
    onChange(selectedAddress);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleRetry = () => {
    if (query.length >= 3) {
      fetchSuggestions(query);
    }
  };

  return {
    query,
    suggestions,
    isLoading,
    isFocused,
    setIsFocused,
    handleInputChange,
    handleSelect,
    handleRetry
  };
}
