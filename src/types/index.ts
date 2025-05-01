// Common type definitions for the timetable system

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type SubjectType = 'theory' | 'lab' | 'tutorial' | 'elective' | 'fixed';
export type FixedSessionType = 'mentoring' | 'ethics' | 'project_review';

export type TimeSlot = {
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  breakType?: 'short' | 'lunch';
};

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: 'theory' | 'lab' | 'tutorial';
  lecturerId: string;
  labHours: number;
  tutorialHours: number;
  theoryHours: number;
  fixedSessions?: {
    day: WeekDay;
    startSlot: number;
    endSlot: number;
    type: 'theory' | 'lab' | 'tutorial';
    section: 'A' | 'B';
    roomId: string;
  }[];
  section?: 'A' | 'B';  // For section-specific subjects
  fixedSessionType?: FixedSessionType;
  fixedTimeSlot?: {
    day: WeekDay;
    startSlot: number;
    endSlot: number;
  };
  color?: string;
}

export interface Lecturer {
  id: string;
  name: string;
  subjects: string[]; // Subject IDs
  sections: ('A' | 'B')[]; // Sections they teach
}

export interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'lab';
  capacity: number;
}

export interface TimetableEntry {
  id: string;
  subjectId: string;
  lecturerId: string;
  roomId: string;
  section: 'A' | 'B';
  day: WeekDay;
  startSlot: number;
  endSlot: number;
  type: SubjectType;
}

export interface TimetableState {
  subjects: Subject[];
  lecturers: Lecturer[];
  rooms: Room[];
  entries: TimetableEntry[];
}

// Generate time slots from 8:30 AM to 4:30 PM with breaks
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  // Morning slots before short break
  slots.push({ startTime: '08:30', endTime: '09:30' });
  slots.push({ startTime: '09:30', endTime: '10:30' });
  
  // Short break
  slots.push({ 
    startTime: '10:30', 
    endTime: '10:45', 
    isBreak: true, 
    breakType: 'short' 
  });
  
  // Late morning slots
  slots.push({ startTime: '10:45', endTime: '11:45' });
  slots.push({ startTime: '11:45', endTime: '12:45' });
  
  // Lunch break
  slots.push({ 
    startTime: '12:45', 
    endTime: '13:30', 
    isBreak: true, 
    breakType: 'lunch' 
  });
  
  // Afternoon slots
  slots.push({ startTime: '13:30', endTime: '14:30' });
  slots.push({ startTime: '14:30', endTime: '15:30' });
  slots.push({ startTime: '15:30', endTime: '16:30' });
  
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();
export const WEEKDAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Constants for scheduling rules
export const SCHEDULING_RULES = {
  MAX_THEORY_PERIODS_PER_DAY: 5,
  MAX_LABS_TUTORIALS_PER_DAY: 2,
  LAB_DURATION_HOURS: 2,
  TUTORIAL_DURATION_HOURS: 1,
  THEORY_DURATION_HOURS: 1,
  MIN_HOURS_BETWEEN_SAME_SUBJECT: 24, // To avoid same subject on same day
};

// Fixed session configurations
export const FIXED_SESSIONS = {
  MENTORING: {
    day: 'Wednesday' as WeekDay,
    startSlot: 7, // 2:30 PM slot
    duration: 1
  },
  ETHICS: {
    day: 'Friday' as WeekDay,
    startSlot: 2, // 9:30 AM slot
    duration: 1
  },
  PROJECT_REVIEW: {
    day: 'Saturday' as WeekDay,
    startSlot: 1, // 8:30 AM slot
    duration: 2
  }
};