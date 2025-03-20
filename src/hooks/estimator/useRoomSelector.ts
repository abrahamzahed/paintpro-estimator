
import { useState, useEffect } from 'react';
import { RoomDetail, PricingData, BaseboardType } from '@/types/estimator';
import { calculateRoomPrice } from '@/utils/estimator/priceCalculator';

export const useRoomSelector = (
  room: RoomDetail,
  pricingData: PricingData,
  onUpdateRoom: (room: RoomDetail) => void
) => {
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

  return {
    localRoom,
    availableSizes,
    shouldDisableMillworkPriming: shouldDisableMillworkPriming(),
    handleRoomTypeChange,
    handleSizeChange,
    handlePaintChange,
    handleBaseboardChange,
    handleOptionChange,
    handleDoorCountChange,
    handleDoorPaintMethodChange,
    handleWindowCountChange,
    handleWindowPaintMethodChange,
    handleClosetCountChange,
    handleFireplaceChange,
    handleRepairsChange,
    handleBaseboardInstallationChange
  };
};
