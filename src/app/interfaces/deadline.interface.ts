import { Timestamp } from '@angular/fire/firestore';

export interface Deadline {
  id: string;
  title: string;
  type: string;
  description: string;
  date: Timestamp;
  isCompleted: boolean;
}
