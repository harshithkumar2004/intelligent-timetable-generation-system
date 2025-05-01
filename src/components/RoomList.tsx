import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import RoomForm from './RoomForm';
import { Edit2, Trash2 } from 'lucide-react';

const RoomList: React.FC = () => {
  const { state, dispatch } = useTimetable();
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  
  const handleEdit = (roomId: string) => {
    setEditingRoom(roomId);
  };
  
  const handleDelete = (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room? This will also remove it from all timetable entries.')) {
      dispatch({ type: 'DELETE_ROOM', payload: roomId });
    }
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Manage Rooms</h2>
      
      <div className="space-y-4">
        {state.rooms.length === 0 ? (
          <div className="text-sm text-gray-500 italic">
            No rooms added yet. Add some rooms to get started.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {state.rooms.map(room => (
              <div
                key={room.id}
                className="bg-white rounded-lg shadow-sm border p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{room.name}</h3>
                    <p className="text-sm text-gray-500">
                      {room.type === 'classroom' ? 'Classroom' : 'Laboratory'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(room.id)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Capacity: {room.capacity} students
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {editingRoom && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <RoomForm
            onClose={() => setEditingRoom(null)}
            editRoom={state.rooms.find(room => room.id === editingRoom)}
          />
        </div>
      )}
    </div>
  );
};

export default RoomList; 