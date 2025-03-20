
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  PricingData,
  SpecialCondition,
  Extra
} from '@/types/estimator';
import { fetchPricingData } from '@/lib/supabase';

export const usePricingData = () => {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [specialConditions, setSpecialConditions] = useState<SpecialCondition[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPricingData = async () => {
      try {
        const data = await fetchPricingData();
        setPricingData(data);
        
        // Set specialized data
        if (data.specialConditions) {
          setSpecialConditions(data.specialConditions);
        }
        
        if (data.extras) {
          setExtras(data.extras);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
        toast.error('Failed to load pricing data. Please try again.');
        setIsLoading(false);
      }
    };

    loadPricingData();
  }, []);

  return {
    pricingData,
    specialConditions,
    extras,
    isLoading,
  };
};
