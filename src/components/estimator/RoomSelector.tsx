
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { RoomDetail, PricingData, BaseboardType } from '@/types/estimator';
import { RoomTypeSelector } from './room-selector/RoomTypeSelector';
import { SelectField } from './room-selector/SelectField';
import { RoomDiscounts } from './room-selector/RoomDiscounts';
import { CeilingOptions } from './room-selector/CeilingOptions';
import { DoorSection } from './room-selector/DoorSection';
import { ClosetSection } from './room-selector/ClosetSection';
import { WindowSection } from './room-selector/WindowSection';
import { StairRailingOption } from './room-selector/StairRailingOption';
import { NumberInputField } from './room-selector/NumberInputField';

// Mock repair and fireplace options (these should eventually come from Supabase too)
const mockRepairOptions = [
  { id: 1, name: 'No Repairs', cost: 0 },
  { id: 2, name: 'Minor Repairs', cost: 250 },
  { id: 3, name: 'Major Repairs', cost: 750 }
];

const mockFireplaceOptions = [
  { id: 1, name: 'None', cost: 0 },
  { id: 2, name: 'Standard Mantel', cost: 200 },
  { id: 3, name: 'Custom Mantel', cost: 450 }
];

interface RoomSelectorProps {
  room: RoomDetail;
  pricingData: PricingData;
  onUpdateRoom: (room: RoomDetail) => void;
  onDeleteRoom: (roomId: string) => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  room,
  pricingData,
  onUpdateRoom,
  onDeleteRoom,
}) => {
  const [localRoom, setLocalRoom] = useState<RoomDetail>(room);
  const [availableSizes, setAvailableSizes] = useState<Array<any>>([]);
  
  // Set available room sizes when room type changes
  useEffect(() => {
    if (pricingData && localRoom.roomType) {
      const filteredSizes = pricingData.roomSizes.filter(
        size => size.room_type_id === localRoom.roomType.id
      );
      setAvailableSizes(filteredSizes);
      
      // If current size is not available for this room type, reset to first available size
      if (filteredSizes.length > 0) {
        const currentSizeExists = filteredSizes.some(size => size.id === localRoom.size.id);
        if (!currentSizeExists) {
          handleSizeChange(filteredSizes[0].id);
        }
      }
    }
  }, [localRoom.roomType, pricingData]);

  // Check if millwork priming should be disabled based on all conditions
  const shouldDisableMillworkPriming = () => {
    // Disable if any of these conditions are true
    return (
      localRoom.baseboardType === 'No Baseboards' ||
      localRoom.doors.count === 0 ||
      (localRoom.closets.walkInCount === 0 && localRoom.closets.regularCount === 0) ||
      localRoom.windows.count === 0
    );
  };

  // Update millwork priming when conditions change
  useEffect(() => {
    if (shouldDisableMillworkPriming() && localRoom.options.millworkPriming) {
      // If conditions now require disabling and it was checked, uncheck it
      setLocalRoom(prev => ({
        ...prev,
        options: {
          ...prev.options,
          millworkPriming: false
        }
      }));
    }
  }, [
    localRoom.baseboardType, 
    localRoom.doors.count, 
    localRoom.closets.walkInCount,
    localRoom.closets.regularCount,
    localRoom.windows.count
  ]);

  // Update calculations whenever the local room changes
  useEffect(() => {
    calculateRoomPrice();
  }, [localRoom]);

  // Send updated room back to parent component
  useEffect(() => {
    onUpdateRoom(localRoom);
  }, [localRoom.price]);

  const calculateRoomPrice = () => {
    if (!pricingData) return;
    
    const basePrice = localRoom.size.base_price;
    const priceDetails: Record<string, number> = { basePrice };
    
    // Paint type upcharge
    const paintUpchargeAmount = localRoom.paintType.upcharge_amount;
    const paintUpchargePercentage = (basePrice * localRoom.paintType.upcharge_percentage) / 100;
    const paintUpcharge = Math.max(paintUpchargeAmount, paintUpchargePercentage);
    priceDetails.paintUpcharge = paintUpcharge;
    
    // Baseboard upcharge
    let baseboardUpchargePercentage = 0;
    if (localRoom.baseboardType === 'Brushed Baseboards') {
      baseboardUpchargePercentage = 25;
    } else if (localRoom.baseboardType === 'Sprayed Baseboards') {
      baseboardUpchargePercentage = 50;
    }
    const baseboardUpcharge = (basePrice * baseboardUpchargePercentage) / 100;
    priceDetails.baseboardUpcharge = baseboardUpcharge;
    
    // High ceiling
    if (localRoom.options.highCeiling) {
      priceDetails.highCeiling = 600;
    }
    
    // Two colors
    if (localRoom.options.twoColors) {
      priceDetails.twoColors = (basePrice * 0.1);
    }
    
    // Millwork priming
    if (localRoom.options.millworkPriming) {
      priceDetails.millworkPriming = (basePrice * 0.5);
    }
    
    // Closets
    const regularClosetPrice = localRoom.closets.regularCount * 150;
    const walkInClosetPrice = localRoom.closets.walkInCount * 300;
    priceDetails.closets = regularClosetPrice + walkInClosetPrice;
    
    // Fireplace
    const fireplaceOption = mockFireplaceOptions.find(f => f.name === localRoom.fireplace);
    if (fireplaceOption && fireplaceOption.cost > 0) {
      priceDetails.fireplace = fireplaceOption.cost;
    }
    
    // Stair railing
    if (localRoom.options.stairRailing) {
      priceDetails.stairRailing = 250;
    }
    
    // Repairs
    const repairOption = mockRepairOptions.find(r => r.name === localRoom.repairs);
    if (repairOption && repairOption.cost > 0) {
      priceDetails.repairs = repairOption.cost;
    }
    
    // Baseboard installation
    if (localRoom.baseboardInstallationFeet > 0) {
      priceDetails.baseboardInstall = localRoom.baseboardInstallationFeet * 2;
    }
    
    // Calculate subtotal before discounts
    let subtotal = Object.values(priceDetails).reduce((sum, value) => sum + value, 0);
    
    // Apply discounts
    if (localRoom.options.emptyRoom) {
      const emptyRoomDiscount = subtotal * 0.15;
      priceDetails.emptyRoomDiscount = -emptyRoomDiscount;
    }
    
    if (localRoom.options.noFloorCovering) {
      const noFloorDiscount = subtotal * 0.05;
      priceDetails.noFloorCoveringDiscount = -noFloorDiscount;
    }
    
    // Apply room-specific add-ons from Supabase
    pricingData.roomAddons.forEach(addon => {
      if (localRoom.options[addon.name as keyof typeof localRoom.options]) {
        const addonCost = addon.cost_percentage ? 
          basePrice * (addon.cost_percentage / 100) : addon.cost;
        priceDetails[addon.name] = addonCost;
      }
    });
    
    // Calculate final price
    const totalPrice = Object.values(priceDetails).reduce((sum, value) => sum + value, 0);
    
    setLocalRoom(prev => ({
      ...prev,
      price: parseFloat(totalPrice.toFixed(2)),
      priceDetails,
    }));
  };

  const handleRoomTypeChange = (value: string) => {
    const selectedRoomType = pricingData.roomTypes.find(rt => rt.name === value);
    if (selectedRoomType) {
      setLocalRoom(prev => ({ 
        ...prev, 
        roomType: selectedRoomType,
        name: value
      }));
    }
  };

  const handleSizeChange = (sizeId: string) => {
    const selectedSize = pricingData.roomSizes.find(s => s.id === sizeId);
    if (selectedSize) {
      setLocalRoom(prev => ({ 
        ...prev, 
        size: selectedSize 
      }));
    }
  };

  const handlePaintChange = (value: string) => {
    const selectedPaint = pricingData.paintTypes.find(p => p.name === value);
    if (selectedPaint) {
      setLocalRoom(prev => ({ ...prev, paintType: selectedPaint }));
    }
  };

  const handleBaseboardChange = (value: BaseboardType) => {
    setLocalRoom(prev => ({ ...prev, baseboardType: value }));
  };

  const handleOptionChange = (option: keyof RoomDetail['options'], checked: boolean) => {
    setLocalRoom(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: checked
      }
    }));
  };

  const handleDoorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setLocalRoom(prev => ({
      ...prev,
      doors: {
        ...prev.doors,
        count
      }
    }));
  };

  const handleDoorPaintMethodChange = (value: string) => {
    setLocalRoom(prev => ({
      ...prev,
      doors: {
        ...prev.doors,
        paintMethod: value as RoomDetail['doors']['paintMethod']
      }
    }));
  };

  const handleWindowCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setLocalRoom(prev => ({
      ...prev,
      windows: {
        ...prev.windows,
        count
      }
    }));
  };

  const handleWindowPaintMethodChange = (value: string) => {
    setLocalRoom(prev => ({
      ...prev,
      windows: {
        ...prev.windows,
        paintMethod: value as RoomDetail['windows']['paintMethod']
      }
    }));
  };

  const handleClosetCountChange = (type: 'walkInCount' | 'regularCount', e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setLocalRoom(prev => ({
      ...prev,
      closets: {
        ...prev.closets,
        [type]: count
      }
    }));
  };

  const handleFireplaceChange = (value: string) => {
    setLocalRoom(prev => ({ ...prev, fireplace: value }));
  };

  const handleRepairsChange = (value: string) => {
    setLocalRoom(prev => ({ ...prev, repairs: value }));
  };

  const handleBaseboardInstallationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const feet = parseInt(e.target.value) || 0;
    setLocalRoom(prev => ({ ...prev, baseboardInstallationFeet: feet }));
  };

  return (
    <div className="room-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{localRoom.name}</h3>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDeleteRoom(localRoom.id)}
        >
          <Trash2 size={18} />
        </Button>
      </div>

      <div className="grid gap-6">
        <RoomTypeSelector 
          roomType={localRoom.roomType}
          pricingData={pricingData}
          onRoomTypeChange={handleRoomTypeChange}
        />

        <div className="form-input-wrapper">
          <Label className="form-label">Size</Label>
          <SelectField
            label=""
            value={localRoom.size.id}
            onValueChange={handleSizeChange}
            options={availableSizes.map(size => ({ 
              ...size, 
              name: size.size 
            }))}
            placeholder="Select size"
            disabled={availableSizes.length === 0}
          />
        </div>

        <SelectField
          label="Paint Selection"
          value={localRoom.paintType.name}
          onValueChange={handlePaintChange}
          options={pricingData.paintTypes}
          placeholder="Select paint type"
        />

        <SelectField
          label="Baseboard Selection"
          value={localRoom.baseboardType}
          onValueChange={(value) => handleBaseboardChange(value as BaseboardType)}
          options={[
            { id: 1, name: 'No Baseboards' },
            { id: 2, name: 'Brushed Baseboards', upcharge_percentage: 25 },
            { id: 3, name: 'Sprayed Baseboards', upcharge_percentage: 50 }
          ]}
          placeholder="Select baseboard type"
        />

        <RoomDiscounts 
          options={localRoom.options}
          handleOptionChange={handleOptionChange}
          shouldDisableMillworkPriming={shouldDisableMillworkPriming()}
        />

        <CeilingOptions 
          options={localRoom.options}
          handleOptionChange={handleOptionChange}
        />

        <DoorSection
          doors={localRoom.doors}
          handleDoorCountChange={handleDoorCountChange}
          handleDoorPaintMethodChange={handleDoorPaintMethodChange}
        />

        <ClosetSection
          closets={localRoom.closets}
          handleClosetCountChange={handleClosetCountChange}
        />

        <WindowSection
          windows={localRoom.windows}
          handleWindowCountChange={handleWindowCountChange}
          handleWindowPaintMethodChange={handleWindowPaintMethodChange}
        />

        <SelectField
          label="Fireplace Mantel"
          value={localRoom.fireplace}
          onValueChange={handleFireplaceChange}
          options={mockFireplaceOptions}
          placeholder="Select option"
        />

        <StairRailingOption
          options={localRoom.options}
          handleOptionChange={handleOptionChange}
        />

        <SelectField
          label="Repairs"
          value={localRoom.repairs}
          onValueChange={handleRepairsChange}
          options={mockRepairOptions}
          placeholder="Select repair option"
        />

        <NumberInputField
          id="baseboardInstallation"
          label="Baseboard Installation (LF)"
          value={localRoom.baseboardInstallationFeet}
          onChange={handleBaseboardInstallationChange}
        />
      </div>
    </div>
  );
};
