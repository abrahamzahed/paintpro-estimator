
import React from 'react';
import { RoomDetail } from '@/types/estimator';
import { RoomDetailCard } from './RoomDetailCard';

interface RoomsListProps {
  rooms: RoomDetail[];
}

export const RoomsList: React.FC<RoomsListProps> = ({ rooms }) => {
  return (
    <div className="mb-8">
      <h3 className="flex justify-between items-center text-xl font-semibold mb-4">
        <span>Current Estimate:</span>
        <span className="text-blue-600">
          ${rooms.reduce((total, room) => total + room.price, 0).toFixed(2)}
        </span>
      </h3>
      
      <div className="space-y-6">
        <h4 className="text-lg font-medium mb-2">Rooms breakdown:</h4>
        
        {rooms.map((room, index) => (
          <RoomDetailCard key={room.id} room={room} index={index} />
        ))}
      </div>
    </div>
  );
};
