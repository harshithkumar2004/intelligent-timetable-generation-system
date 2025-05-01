import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { WeekDay, WEEKDAYS, TIME_SLOTS, TimetableEntry } from '../types';
import { formatTime, getLightColor } from '../utils/helpers';

const TimetableGrid: React.FC = () => {
  const { state, getSubjectById, getLecturerById, getRoomById } = useTimetable();
  
  // Group entries by day and time slot
  const getEntryForCell = (day: WeekDay, slotIndex: number, section: 'A' | 'B'): TimetableEntry | undefined => {
    return state.entries.find(entry => 
      entry.day === day && 
      entry.section === section &&
      slotIndex >= entry.startSlot && 
      slotIndex < entry.endSlot
    );
  };
  
  // Check if an entry spans multiple time slots and is the start
  const isMultiSlotStart = (entry: TimetableEntry, slotIndex: number): boolean => {
    return entry.startSlot === slotIndex && (entry.endSlot - entry.startSlot) > 1;
  };
  
  // Check if an entry should be rendered in this cell
  const shouldRenderEntry = (entry: TimetableEntry, slotIndex: number): boolean => {
    return entry.startSlot === slotIndex;
  };
  
  // Get row span for an entry that spans multiple time slots
  const getRowSpan = (entry: TimetableEntry): number => {
    return entry.endSlot - entry.startSlot;
  };
  
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-8">
        {/* Section A */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 px-4">Section A</h3>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="py-3 px-4 font-semibold text-gray-700 border-b border-r">
              Time / Day
            </th>
            {WEEKDAYS.map(day => (
              <th key={day} className="py-3 px-4 font-semibold text-gray-700 border-b">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((slot, slotIndex) => (
            <tr 
              key={slotIndex} 
              className={slot.isBreak ? 'bg-gray-100' : ''}
            >
              <td className="py-2 px-4 text-sm text-gray-700 border-r">
                <div className="flex flex-col">
                  <span>{formatTime(slot.startTime)}</span>
                  <span className="text-xs text-gray-500">to</span>
                  <span>{formatTime(slot.endTime)}</span>
                  
                  {slot.isBreak && (
                    <span className="text-xs font-medium mt-1 text-indigo-600">
                      {slot.breakType === 'short' ? 'Small Break' : 'Lunch Break'}
                    </span>
                  )}
                </div>
              </td>
              
              {WEEKDAYS.map(day => {
                    const entry = getEntryForCell(day, slotIndex, 'A');
                
                if (slot.isBreak) {
                  return (
                    <td 
                      key={day} 
                      className="py-2 px-2 text-center text-xs text-gray-500 border"
                    >
                      {slot.breakType === 'short' ? 'Break' : 'Lunch'}
                    </td>
                  );
                }
                
                if (entry && shouldRenderEntry(entry, slotIndex)) {
                  const subject = getSubjectById(entry.subjectId);
                  const lecturer = getLecturerById(entry.lecturerId);
                      const room = getRoomById(entry.roomId);
                  
                      if (!subject || !lecturer || !room) return <td key={day} className="border"></td>;
                  
                  const bgColor = subject.color ? getLightColor(subject.color) : '#f3f4f6';
                  const borderColor = subject.color || '#d1d5db';
                  
                  return (
                    <td 
                      key={day}
                      rowSpan={isMultiSlotStart(entry, slotIndex) ? getRowSpan(entry) : undefined}
                      className="border p-1"
                      style={{ 
                        backgroundColor: bgColor,
                        borderLeft: `3px solid ${borderColor}`
                      }}
                    >
                      <div className="h-full p-2 overflow-hidden">
                        <div className="text-sm font-medium">{subject.code}</div>
                        <div className="text-xs truncate">{subject.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {lecturer.name}
                        </div>
                            <div className="text-xs text-gray-500">
                              Room: {room.name}
                            </div>
                            <div className="text-xs font-medium mt-1">
                              {entry.type === 'lab' && (
                                <span className="text-purple-700">Lab: Yes</span>
                              )}
                              {entry.type === 'tutorial' && (
                                <span className="text-blue-700">Tutorial</span>
                              )}
                              {entry.type === 'fixed' && (
                                <span className="text-green-700">
                                  {subject.fixedSessionType?.replace('_', ' ').toUpperCase()}
                                </span>
                        )}
                            </div>
                      </div>
                    </td>
                  );
                } else if (entry && !shouldRenderEntry(entry, slotIndex)) {
                  // This cell is part of a multi-slot entry but not the start
                  // We don't render anything here because the rowSpan will cover it
                  return null;
                } else {
                  return <td key={day} className="border"></td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
        </div>
        
        {/* Section B */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 px-4">Section B</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-3 px-4 font-semibold text-gray-700 border-b border-r">
                  Time / Day
                </th>
                {WEEKDAYS.map(day => (
                  <th key={day} className="py-3 px-4 font-semibold text-gray-700 border-b">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, slotIndex) => (
                <tr 
                  key={slotIndex} 
                  className={slot.isBreak ? 'bg-gray-100' : ''}
                >
                  <td className="py-2 px-4 text-sm text-gray-700 border-r">
                    <div className="flex flex-col">
                      <span>{formatTime(slot.startTime)}</span>
                      <span className="text-xs text-gray-500">to</span>
                      <span>{formatTime(slot.endTime)}</span>
                      
                      {slot.isBreak && (
                        <span className="text-xs font-medium mt-1 text-indigo-600">
                          {slot.breakType === 'short' ? 'Small Break' : 'Lunch Break'}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {WEEKDAYS.map(day => {
                    const entry = getEntryForCell(day, slotIndex, 'B');
                    
                    if (slot.isBreak) {
                      return (
                        <td 
                          key={day} 
                          className="py-2 px-2 text-center text-xs text-gray-500 border"
                        >
                          {slot.breakType === 'short' ? 'Break' : 'Lunch'}
                        </td>
                      );
                    }
                    
                    if (entry && shouldRenderEntry(entry, slotIndex)) {
                      const subject = getSubjectById(entry.subjectId);
                      const lecturer = getLecturerById(entry.lecturerId);
                      const room = getRoomById(entry.roomId);
                      
                      if (!subject || !lecturer || !room) return <td key={day} className="border"></td>;
                      
                      const bgColor = subject.color ? getLightColor(subject.color) : '#f3f4f6';
                      const borderColor = subject.color || '#d1d5db';
                      
                      return (
                        <td 
                          key={day}
                          rowSpan={isMultiSlotStart(entry, slotIndex) ? getRowSpan(entry) : undefined}
                          className="border p-1"
                          style={{ 
                            backgroundColor: bgColor,
                            borderLeft: `3px solid ${borderColor}`
                          }}
                        >
                          <div className="h-full p-2 overflow-hidden">
                            <div className="text-sm font-medium">{subject.code}</div>
                            <div className="text-xs truncate">{subject.name}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {lecturer.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Room: {room.name}
                            </div>
                            <div className="text-xs font-medium mt-1">
                              {entry.type === 'lab' && (
                                <span className="text-purple-700">Lab: Yes</span>
                              )}
                              {entry.type === 'tutorial' && (
                                <span className="text-blue-700">Tutorial</span>
                              )}
                              {entry.type === 'fixed' && (
                                <span className="text-green-700">
                                  {subject.fixedSessionType?.replace('_', ' ').toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    } else if (entry && !shouldRenderEntry(entry, slotIndex)) {
                      // This cell is part of a multi-slot entry but not the start
                      // We don't render anything here because the rowSpan will cover it
                      return null;
                    } else {
                      return <td key={day} className="border"></td>;
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;