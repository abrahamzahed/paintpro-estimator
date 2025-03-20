
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { calculateRoomPrice, getMockRepairOptions, getMockFireplaceOptions } from '@/utils/estimator/priceCalculator';

// Get mock options from the utility file
const mockRepairOptions = getMockRepairOptions();
const mockFireplaceOptions = getMockFireplaceOptions();

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
    const updatedRoom = calculateRoomPrice(localRoom, pricingData);
    setLocalRoom(updatedRoom);
  }, [
    localRoom.roomType,
    localRoom.size,
    localRoom.paintType,
    localRoom.baseboardType,
    localRoom.options,
    localRoom.doors,
    localRoom.windows,
    localRoom.closets,
    localRoom.fireplace,
    localRoom.repairs,
    localRoom.baseboardInstallationFeet,
    // Don't include localRoom.price or localRoom.priceDetails to avoid infinite loops
  ]);

  // Send updated room back to parent component
  useEffect(() => {
    onUpdateRoom(localRoom);
  }, [localRoom.price]);

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
          <SelectField
            label="Size"
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
