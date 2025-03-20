
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard, 
  Home, 
  Trash2, 
  RefreshCw,
  Save,
  Check,
  PaintBucket 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactForm } from './estimator/ContactForm';
import { RoomSelector } from './estimator/RoomSelector';
import { EstimateSummary } from './estimator/EstimateSummary';
import { ProgressSteps } from './estimator/ProgressSteps';
import { 
  EstimatorSummary, 
  RoomDetail, 
  ContactInfo, 
  PricingData 
} from '@/types/estimator';
import { fetchPricingData } from '@/lib/mockData';

const FreeEstimator = () => {
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
    // Validate current step
    if (currentStep === 1) {
      // Validate contact info
      if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone || !contactInfo.address) {
        toast.error('Please fill in all required fields');
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

  if (isLoading) {
    return (
      <div className="container-card my-8 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <h3 className="text-lg font-medium">Loading estimator...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 animate-fade-in">
      <div className="text-left mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Estimate</h1>
      </div>
      
      <div className="container-card overflow-hidden">
        <ProgressSteps currentStep={currentStep} />
        
        <div className="mt-10">
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Let's Get Started</h2>
                <p className="text-gray-600 mt-1">Please provide your contact information.</p>
              </div>
              
              <div className="flex gap-3 mb-8">
                <Button variant="outline" className="inline-flex items-center gap-2">
                  <LayoutDashboard size={18} /> Dashboard
                </Button>
                <Button variant="outline" className="inline-flex items-center gap-2">
                  <Home size={18} /> Return Home
                </Button>
              </div>
              
              <ContactForm 
                contactInfo={contactInfo} 
                setContactInfo={setContactInfo} 
              />
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Design Your Painting Project</h2>
                <p className="text-gray-600 mt-1">Add rooms and customize your painting needs.</p>
              </div>
              
              <div className="flex gap-3 mb-8">
                <Button 
                  variant="outline" 
                  className="inline-flex items-center gap-2"
                  onClick={handlePreviousStep}
                >
                  <ChevronLeft size={18} /> Back
                </Button>
                <Button 
                  variant="outline" 
                  className="inline-flex items-center gap-2"
                  onClick={handleReset}
                >
                  <RefreshCw size={18} /> Reset
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Paint Cost Calculator</h3>
                
                <Button 
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mb-6"
                  onClick={handleAddRoom}
                >
                  <PaintBucket size={18} /> Add Room
                </Button>
                
                {rooms.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No rooms added yet. Click "Add Room" to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {rooms.map((room) => (
                      <RoomSelector
                        key={room.id}
                        room={room}
                        pricingData={pricingData!}
                        onUpdateRoom={handleUpdateRoom}
                        onDeleteRoom={handleDeleteRoom}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Your Estimate Summary</h2>
                <p className="text-gray-600 mt-1">Review your estimate and create an account to save it.</p>
              </div>
              
              <EstimateSummary 
                summary={summary} 
                estimateSaved={estimateSaved}
                onSaveEstimate={handleSaveEstimate}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-10">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              className="inline-flex items-center gap-2"
              onClick={handlePreviousStep}
            >
              <ChevronLeft size={18} /> Back
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button 
              className="inline-flex items-center gap-2 ml-auto"
              onClick={handleNextStep}
            >
              Next <ChevronRight size={18} />
            </Button>
          ) : (
            <div className="ml-auto">
              {!estimateSaved ? (
                <Button 
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveEstimate}
                >
                  <Save size={18} /> Save Estimate
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="inline-flex items-center gap-2 text-green-600 border-green-600"
                  disabled
                >
                  <Check size={18} /> Estimate Saved
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeEstimator;
