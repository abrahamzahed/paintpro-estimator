
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  EstimatorSummary, 
  RoomDetail, 
  ContactInfo, 
  PricingData 
} from '@/types/estimator';
import { fetchPricingData } from '@/lib/mockData';

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

  // Fetch pricing data on component mount
  useEffect(() => {
    const loadPricingData = async () => {
      try {
        const data = await fetchPricingData();
        setPricingData(data);
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
    if (!pricingData) return;
    
    const newRoom: RoomDetail = {
      id: uuidv4(),
      name: `Room ${rooms.length + 1}`,
      roomType: pricingData.roomTypes[0],
      size: pricingData.roomSizes[0],
      paintType: pricingData.paintTypes[0],
      baseboardType: 'Regular Baseboards',
      options: {
        emptyRoom: false,
        noFloorCovering: false,
        twoColors: false,
        millworkPriming: false,
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
      fireplace: 'None',
      repairs: 'No Repairs',
      baseboardInstallationFeet: 0,
      price: pricingData.roomSizes[0].base_price,
      priceDetails: {
        basePrice: pricingData.roomSizes[0].base_price,
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
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
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
      toast.info('Estimate reset successfully');
    }
  };

  const handleSaveEstimate = () => {
    // In a real app, this would save to the database
    // For this demo, we'll just simulate saving
    console.log('Saving estimate:', summary);
    
    // Store in localStorage for persistence
    localStorage.setItem('paintProEstimate', JSON.stringify(summary));
    
    setEstimateSaved(true);
    toast.success('Estimate saved successfully!');
  };

  return {
    currentStep,
    contactInfo,
    rooms,
    summary,
    pricingData,
    isLoading,
    estimateSaved,
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
