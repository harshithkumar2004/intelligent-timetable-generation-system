import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  Subject, 
  Lecturer,
  Room,
  TimetableEntry, 
  TimetableState, 
  TIME_SLOTS,
  WEEKDAYS,
  SCHEDULING_RULES,
  FIXED_SESSIONS,
  SubjectType,
  WeekDay
} from '../types';
import { generateUniqueId } from '../utils/helpers';
import { v4 as uuidv4 } from 'uuid';

// Define action types
type ActionType = 
  | { type: 'ADD_SUBJECT'; payload: Omit<Subject, 'id'> }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'ADD_LECTURER'; payload: Omit<Lecturer, 'id'> }
  | { type: 'UPDATE_LECTURER'; payload: Lecturer }
  | { type: 'DELETE_LECTURER'; payload: string }
  | { type: 'ADD_ROOM'; payload: Omit<Room, 'id'> }
  | { type: 'UPDATE_ROOM'; payload: Room }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'ADD_ENTRY'; payload: Omit<TimetableEntry, 'id'> }
  | { type: 'UPDATE_ENTRY'; payload: TimetableEntry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'GENERATE_TIMETABLE' }
  | { type: 'CLEAR_TIMETABLE' }
  | { type: 'LOAD_STATE'; payload: TimetableState };

// Initial state
const initialState: TimetableState = {
  subjects: [],
  lecturers: [],
  rooms: [],
  entries: []
};

// Create context
interface TimetableContextType {
  state: TimetableState;
  dispatch: React.Dispatch<ActionType>;
  hasConflicts: () => boolean;
  getSubjectById: (id: string) => Subject | undefined;
  getLecturerById: (id: string) => Lecturer | undefined;
  getRoomById: (id: string) => Room | undefined;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

// Helper function to check for conflicts
const checkConflicts = (entries: TimetableEntry[]): boolean => {
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const entry1 = entries[i];
      const entry2 = entries[j];
      
      // Check if entries are on the same day
      if (entry1.day !== entry2.day) continue;
      
      // Check for time slot overlap
      const isTimeOverlap = 
        (entry1.startSlot <= entry2.startSlot && entry1.endSlot > entry2.startSlot) ||
        (entry2.startSlot <= entry1.startSlot && entry2.endSlot > entry1.startSlot);
      
      if (isTimeOverlap) {
        // Check for lecturer conflict
        if (entry1.lecturerId === entry2.lecturerId) return true;
        
        // Check for section conflict
        if (entry1.section === entry2.section) return true;
        
        // Check for room conflict
        if (entry1.roomId === entry2.roomId) return true;
        
        // Check for same subject on same day
        if (entry1.subjectId === entry2.subjectId) return true;
      }
    }
  }
  return false;
};

// Helper function to find available slots
const findAvailableSlots = (
  state: TimetableState,
  entries: TimetableEntry[],
  lecturerId: string,
  section: 'A' | 'B',
  duration: number,
  subjectId?: string
): { day: WeekDay; startSlot: number }[] => {
  const availableSlots: { day: WeekDay; startSlot: number }[] = [];
  
  // Check each day
  for (const day of WEEKDAYS) {
    // Check each possible start time
    for (let startSlot = 0; startSlot <= SCHEDULING_RULES.MAX_SLOTS_PER_DAY - duration; startSlot++) {
      const endSlot = startSlot + duration;
      
      // Skip if during break
      if (startSlot <= 3 && endSlot > 3) continue; // Skip if overlaps with break time
      
      // Check if slot is available
      const isAvailable = !entries.some(entry => 
        entry.day === day &&
        ((entry.startSlot <= startSlot && entry.endSlot > startSlot) ||
         (startSlot <= entry.startSlot && endSlot > entry.startSlot))
      );
      
      if (isAvailable) {
        availableSlots.push({ day, startSlot });
      }
    }
  }
  
  return availableSlots;
};

// Helper function to generate the timetable
const generateTimetable = (state: TimetableState): TimetableState => {
  // Clear existing entries
  const newState = { ...state, entries: [] };
  const entries: TimetableEntry[] = [];

  // Schedule fixed sessions first
  for (const subject of state.subjects) {
    if (subject.fixedSessions) {
      for (const session of subject.fixedSessions) {
        entries.push({
          id: uuidv4(),
          subjectId: subject.id,
          lecturerId: subject.lecturerId,
          roomId: session.roomId,
          day: session.day,
          startSlot: session.startSlot,
          endSlot: session.endSlot,
          type: session.type,
          section: session.section
        });
      }
    }
  }

  // Schedule labs (2-hour blocks)
  for (const subject of state.subjects) {
    if (subject.labHours > 0) {
      const labCount = Math.ceil(subject.labHours / 2);
      for (let i = 0; i < labCount; i++) {
        const availableSlots = findAvailableSlots(
          newState,
          entries,
          subject.lecturerId,
          'A',
          2,
          subject.id
        );

        if (availableSlots.length > 0) {
          const slot = availableSlots[0];
          entries.push({
            id: uuidv4(),
            subjectId: subject.id,
            lecturerId: subject.lecturerId,
            roomId: state.rooms.find(r => r.type === 'lab')?.id || '',
            day: slot.day,
            startSlot: slot.startSlot,
            endSlot: slot.startSlot + 2,
            type: 'lab',
            section: 'A'
          });
        }
      }
    }
  }

  // Schedule tutorials
  for (const subject of state.subjects) {
    if (subject.tutorialHours > 0) {
      const tutorialCount = Math.ceil(subject.tutorialHours);
      for (let i = 0; i < tutorialCount; i++) {
        const availableSlots = findAvailableSlots(
          newState,
          entries,
          subject.lecturerId,
          'A',
          1,
          subject.id
        );

        if (availableSlots.length > 0) {
          const slot = availableSlots[0];
          entries.push({
            id: uuidv4(),
            subjectId: subject.id,
            lecturerId: subject.lecturerId,
            roomId: state.rooms.find(r => r.type === 'classroom')?.id || '',
            day: slot.day,
            startSlot: slot.startSlot,
            endSlot: slot.startSlot + 1,
            type: 'tutorial',
            section: 'A'
          });
        }
      }
    }
  }

  // Schedule theory classes
  for (const subject of state.subjects) {
    if (subject.theoryHours > 0) {
      const theoryCount = Math.ceil(subject.theoryHours);
      for (let i = 0; i < theoryCount; i++) {
        const availableSlots = findAvailableSlots(
          newState,
          entries,
          subject.lecturerId,
          'A',
          1,
          subject.id
        );

        if (availableSlots.length > 0) {
          const slot = availableSlots[0];
          entries.push({
            id: uuidv4(),
            subjectId: subject.id,
            lecturerId: subject.lecturerId,
            roomId: state.rooms.find(r => r.type === 'classroom')?.id || '',
            day: slot.day,
            startSlot: slot.startSlot,
            endSlot: slot.startSlot + 1,
            type: 'theory',
            section: 'A'
          });
        }
      }
    }
  }

  return { ...newState, entries };
};

// Reducer function
const timetableReducer = (state: TimetableState, action: ActionType): TimetableState => {
  switch (action.type) {
    case 'ADD_SUBJECT':
      return {
        ...state,
        subjects: [...state.subjects, { ...action.payload, id: generateUniqueId() }]
      };
      
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(subject => 
          subject.id === action.payload.id ? action.payload : subject
        )
      };
      
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter(subject => subject.id !== action.payload),
        entries: state.entries.filter(entry => entry.subjectId !== action.payload)
      };
      
    case 'ADD_LECTURER':
      return {
        ...state,
        lecturers: [...state.lecturers, { ...action.payload, id: generateUniqueId() }]
      };
      
    case 'UPDATE_LECTURER':
      return {
        ...state,
        lecturers: state.lecturers.map(lecturer => 
          lecturer.id === action.payload.id ? action.payload : lecturer
        )
      };
      
    case 'DELETE_LECTURER':
      return {
        ...state,
        lecturers: state.lecturers.filter(lecturer => lecturer.id !== action.payload),
        entries: state.entries.filter(entry => entry.lecturerId !== action.payload)
      };
      
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [...state.rooms, { ...action.payload, id: generateUniqueId() }]
      };
      
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(room => 
          room.id === action.payload.id ? action.payload : room
        )
      };
      
    case 'DELETE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
        entries: state.entries.filter(entry => entry.roomId !== action.payload)
      };
      
    case 'ADD_ENTRY':
      return {
        ...state,
        entries: [...state.entries, { ...action.payload, id: generateUniqueId() }]
      };
      
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry => 
          entry.id === action.payload.id ? action.payload : entry
        )
      };
      
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload)
      };
      
    case 'GENERATE_TIMETABLE':
      return generateTimetable(state);
      
    case 'CLEAR_TIMETABLE':
      return {
        ...state,
        entries: []
      };
      
    case 'LOAD_STATE':
      return action.payload;
      
    default:
      return state;
  }
};

// Provider component
interface TimetableProviderProps {
  children: ReactNode;
}

const TimetableProvider = ({ children }: TimetableProviderProps) => {
  const [state, dispatch] = useReducer(timetableReducer, initialState);
  
  const hasConflicts = () => checkConflicts(state.entries);
  
  const getSubjectById = (id: string) => state.subjects.find(subject => subject.id === id);
  const getLecturerById = (id: string) => state.lecturers.find(lecturer => lecturer.id === id);
  const getRoomById = (id: string) => state.rooms.find(room => room.id === id);
  
  const value = {
    state,
    dispatch,
    hasConflicts,
    getSubjectById,
    getLecturerById,
    getRoomById
  };
  
  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
};

// Custom hook
const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};

export { TimetableProvider, useTimetable };
export type { TimetableContextType };