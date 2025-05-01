import React, { useState } from 'react';
import { Room } from '../types';
import { useTimetable } from '../context/TimetableContext';
import { X } from 'lucide-react';

interface RoomFormProps {
  onClose?: () => void;
  editRoom?: Room;
}

const RoomForm: React.FC<RoomFormProps> = ({ onClose, editRoom }) => {
  const { dispatch } = useTimetable();
  const [name, setName] = useState(editRoom?.name || '');
  const [type, setType] = useState<'classroom' | 'lab'>(editRoom?.type || 'classroom');
  const [capacity, setCapacity] = useState(editRoom?.capacity || 60);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Room name is required');
      return;
    }
    
    if (capacity < 1) {
      setError('Capacity must be at least 1');
      return;
    }
    
    const roomData = {
      name,
      type,
      capacity
    };
    
    if (editRoom) {
      dispatch({
        type: 'UPDATE_ROOM',
        payload: { ...roomData, id: editRoom.id }
      });
    } else {
      dispatch({
        type: 'ADD_ROOM',
        payload: roomData
      });
    }
    
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editRoom ? 'Edit Room' : 'Add New Room'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name/Number
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Room 101, Lab 2A"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'classroom' | 'lab')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="classroom">Classroom</option>
              <option value="lab">Laboratory</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {editRoom ? 'Update Room' : 'Add Room'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm; 