import { Timestamp } from '@angular/fire/firestore';
import { ExamType } from '../config';

export interface Deadline {
  id: string;
  date: Timestamp;
  type: keyof typeof ExamType;
  subject: string;
  comments: string;
  severity: number;
  creator: string;
  ownerId: string;
  ownerName: string;
  isCompleted: boolean;
  isPersonal: boolean;
}
