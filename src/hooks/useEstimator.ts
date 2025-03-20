
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  EstimatorSummary, 
  RoomDetail, 
  ContactInfo, 
  PricingData,
  SpecialCondition,
  Extra,
  BaseboardType,
  PaintType
} from '@/types/estimator';
import { fetchPricingData, saveEstimate } from '@/lib/supabase';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Add this to the global Window interface
declare global {
  interface Window {
    handleNextStep?: () => void;
  }
}

export const useEstimator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    projectName: '',
  });
  const [rooms, setRooms] = useState<RoomDetail[]>([]);
  const [summary, setSummary] = useState<EstimatorSummary>({
    subtotal: 0,
    volumeDiscount: 0,
    total: 0,
    rooms: [],
    contactInfo: contactInfo,
  });
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [estimateSaved, setEstimateSaved] = useState(false);
  const [specialConditions, setSpecialConditions] = useState<SpecialCondition[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);

  // Fetch pricing data on component mount
  useEffect(() => {
    const loadPricingData = async () => {
      try {
        const data = await fetchPricingData();
        
        // Add "Own Paint/ No Paint" option to paint types
        const ownPaintOption: PaintType = {
          id: 'own-paint',
          name: 'Own Paint/ No Paint',
          upcharge_percentage: 0,
          upcharge_amount: 0,
          description: 'Customer will provide their own paint'
        };
        
        // Make sure we don't add it if it already exists
        if (!data.paintTypes.some(p => p.name === 'Own Paint/ No Paint')) {
          data.paintTypes = [ownPaintOption, ...data.paintTypes];
        }
        
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

  // Calculate summary whenever rooms change
  useEffect(() => {
    if (rooms.length > 0 && pricingData) {
      const subtotal = rooms.reduce((total, room) => total + room.price, 0);
      
      // Calculate volume discount
      let volumeDiscountPercentage = 0;
      for (let i = pricingData.volumeDiscounts.length - 1; i >= 0; i--) {
        if (subtotal >= pricingData.volumeDiscounts[i].threshold) {
          volumeDiscountPercentage = pricingData.volumeDiscounts[i].discount_percentage;
          break;
        }
      }
      
      const volumeDiscount = (subtotal * volumeDiscountPercentage) / 100;
      const total = subtotal - volumeDiscount;
      
      setSummary({
        subtotal,
        volumeDiscount,
        total,
        rooms,
        contactInfo,
      });
    } else {
      setSummary({
        subtotal: 0,
        volumeDiscount: 0,
        total: 0,
        rooms: [],
        contactInfo,
      });
    }
  }, [rooms, contactInfo, pricingData]);

  const handleAddRoom = () => {
    if (!pricingData || pricingData.roomTypes.length === 0 || pricingData.roomSizes.length === 0 || pricingData.paintTypes.length === 0) {
      return;
    }
    
    // Get the first room type from pricing data
    const defaultRoomType = pricingData.roomTypes[0];
    
    // Get sizes for this room type
    const sizesForRoomType = pricingData.roomSizes.filter(
      size => size.room_type_id === defaultRoomType.id
    );
    
    // Select the average size (middle element) for better default experience
    const middleIndex = Math.floor(sizesForRoomType.length / 2);
    const defaultSize = sizesForRoomType.length > 0 
      ? sizesForRoomType[middleIndex] 
      : pricingData.roomSizes[0];
    
    // Find "Own Paint/ No Paint" or use the first paint type
    const ownPaintType = pricingData.paintTypes.find(p => p.name === 'Own Paint/ No Paint');
    const defaultPaintType = ownPaintType || pricingData.paintTypes[0];
    
    const newRoom: RoomDetail = {
      id: uuidv4(),
      name: `${defaultRoomType.name}`,
      roomType: defaultRoomType,
      size: defaultSize,
      paintType: defaultPaintType,
      baseboardType: 'No Baseboards', // Default to "No Baseboards" 
      options: {
        emptyRoom: false,
        noFloorCovering: false,
        twoColors: false,
        millworkPriming: false, // This will be disabled by default
        highCeiling: false,
        paintCeiling: false,
        stairRailing: false,
      },
      doors: {
        count: 0,
        paintMethod: 'Spray',
      },
      windows: {
        count: 0,
        paintMethod: 'Spray',
      },
      closets: {
        walkInCount: 0,
        regularCount: 0,
      },
      fireplace: 'None', // Default to "None"
      repairs: 'No Repairs',
      baseboardInstallationFeet: 0,
      price: defaultSize.base_price,
      priceDetails: {
        basePrice: defaultSize.base_price,
      },
    };
    
    setRooms([...rooms, newRoom]);
  };

  const handleUpdateRoom = (updatedRoom: RoomDetail) => {
    setRooms(rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)));
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
    toast.success('Room removed successfully');
  };

  const handleNextStep = () => {
    // This function can be overridden by the ContactForm component
    if (window.handleNextStep) {
      window.handleNextStep();
      return;
    }
    
    // Default validation for step 1 (fallback)
    if (currentStep === 1) {
      // Validate contact info
      if (!contactInfo.projectName || !contactInfo.fullName || !contactInfo.email || !contactInfo.phone || !contactInfo.address) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Validate email format
      if (!EMAIL_REGEX.test(contactInfo.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
    } else if (currentStep === 2) {
      // Validate that there's at least one room
      if (rooms.length === 0) {
        toast.error('Please add at least one room');
        return;
      }
    }
    
    // Store the current rooms and selections in localStorage for persistence
    localStorage.setItem('estimator-rooms', JSON.stringify(rooms));
    localStorage.setItem('estimator-contact', JSON.stringify(contactInfo));
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
    // When going back from step 3 to step 2, make sure to load all rooms from storage
    if (currentStep === 3) {
      const storedRooms = localStorage.getItem('estimator-rooms');
      if (storedRooms) {
        setRooms(JSON.parse(storedRooms));
      }
    }
    
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your estimate? All data will be lost.')) {
      setRooms([]);
      setCurrentStep(1);
      setContactInfo({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        projectName: '',
      });
      setEstimateSaved(false);
      localStorage.removeItem('estimator-rooms');
      localStorage.removeItem('estimator-contact');
      toast.info('Estimate reset successfully');
    }
  };

  const handleSaveEstimate = async () => {
    try {
      setIsLoading(true);
      await saveEstimate(contactInfo, summary);
      setEstimateSaved(true);
      setIsLoading(false);
      toast.success('Estimate saved successfully!');
    } catch (error) {
      console.error('Error saving estimate:', error);
      setIsLoading(false);
      toast.error('Failed to save estimate. Please try again.');
    }
  };

  return {
    currentStep,
    contactInfo,
    rooms,
    summary,
    pricingData,
    isLoading,
    estimateSaved,
    specialConditions,
    extras,
    setContactInfo,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    handleSaveEstimate
  };
};
