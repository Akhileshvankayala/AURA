export interface Student {
  id: string;
  name: string;
  attendance: number;
  classesAttended: number;
  totalClasses: number;
  status: 'hero' | 'normal' | 'edge';
}

export interface Message {
  id: string;
  text: string;
  sender: 'student' | 'faculty';
  timestamp: Date;
}

export interface AttendanceStats {
  currentPercentage: number;
  classesAttended: number;
  totalClasses: number;
  classesNeeded: number;
}

export type GestureType = 'thumbs-up' | 'peace' | 'wave' | 'rock' | 'fist';
export type ViewMode = 'landing' | 'student' | 'teacher' | 'chat';