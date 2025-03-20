
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { RoomDetail, PricingData, BaseboardType } from '@/types/estimator';
import { calculateRoomPrice } from './utils/priceCalculation';
import { RoomBasicInfo } from './room-parts/RoomBasicInfo';
import { RoomBaseboardOptions } from './room-parts/RoomBaseboardOptions';
import { RoomDiscountsOptions } from './room-parts/RoomDiscountsOptions';
import { RoomCeilingOptions } from './room-parts/RoomCeilingOptions';
import { RoomDoorsWindows } from './room-parts/RoomDoorsWindows';
import { RoomClosets } from './room-parts/RoomClosets';
import { RoomFireplaceStair } from './room-parts/RoomFireplaceStair';
import { RoomRepairs } from './room-parts/RoomRepairs';
import { RoomCostSummary } from './room-parts/RoomCostSummary';

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
      
      // If current size is not available for this room type, reset to average size
      if (filteredSizes.length > 0) {
        const currentSizeExists = filteredSizes.some(size => size.id === localRoom.size.id);
        if (!currentSizeExists) {
          // Find the average size (middle index) instead of the first size
          const middleIndex = Math.floor(filteredSizes.length / 2);
          handleSizeChange(filteredSizes[middleIndex].id);
        }
      }
    }
  }, [localRoom.roomType, pricingData]);

  // Check if millwork priming should be disabled 
  const shouldDisableMillworkPriming = () => {
    // Only disable if ALL millwork elements are missing 
    return (
      localRoom.baseboardType === 'No Baseboards' && 
      localRoom.doors.count === 0 && 
      localRoom.closets.walkInCount === 0 && 
      localRoom.closets.regularCount === 0 && 
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
    localRoom.baseboardInstallationFeet
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
        <RoomBasicInfo 
          room={localRoom}
          pricingData={pricingData}
          availableSizes={availableSizes}
          onRoomTypeChange={handleRoomTypeChange}
          onSizeChange={handleSizeChange}
          onPaintChange={handlePaintChange}
        />

        <RoomBaseboardOptions 
          roomId={localRoom.id}
          baseboardType={localRoom.baseboardType}
          baseboardInstallationFeet={localRoom.baseboardInstallationFeet}
          onBaseboardChange={handleBaseboardChange}
          onBaseboardInstallationChange={handleBaseboardInstallationChange}
        />

        <RoomDiscountsOptions 
          roomId={localRoom.id}
          options={localRoom.options}
          shouldDisableMillworkPriming={shouldDisableMillworkPriming()}
          onOptionChange={handleOptionChange}
        />

        <RoomCeilingOptions 
          options={localRoom.options}
          onOptionChange={handleOptionChange}
        />

        <RoomDoorsWindows 
          roomId={localRoom.id}
          doors={localRoom.doors}
          windows={localRoom.windows}
          onDoorCountChange={handleDoorCountChange}
          onDoorPaintMethodChange={handleDoorPaintMethodChange}
          onWindowCountChange={handleWindowCountChange}
          onWindowPaintMethodChange={handleWindowPaintMethodChange}
        />

        <RoomClosets 
          roomId={localRoom.id}
          closets={localRoom.closets}
          onClosetCountChange={handleClosetCountChange}
        />

        <RoomFireplaceStair 
          roomId={localRoom.id}
          fireplace={localRoom.fireplace}
          options={localRoom.options}
          onFireplaceChange={handleFireplaceChange}
          onOptionChange={handleOptionChange}
        />

        <RoomRepairs 
          repairs={localRoom.repairs}
          onRepairsChange={handleRepairsChange}
        />
      </div>

      <RoomCostSummary room={localRoom} />
    </div>
  );
};
