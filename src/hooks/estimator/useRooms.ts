
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  RoomDetail, 
  PricingData
} from '@/types/estimator';

export const useRooms = (pricingData: PricingData | null) => {
  const [rooms, setRooms] = useState<RoomDetail[]>([]);

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
    
    // Select first available size or fallback to first size if none available
    const defaultSize = sizesForRoomType.length > 0 
      ? sizesForRoomType[0] 
      : pricingData.roomSizes[0];
    
    const defaultPaintType = pricingData.paintTypes[0];
    
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
      fireplace: 'None',
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

  return {
    rooms,
    setRooms,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
  };
};
