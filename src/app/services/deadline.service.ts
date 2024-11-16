import { inject, Injectable } from '@angular/core';
import { Unsubscribe } from '@angular/fire/auth';
import { addDoc, collection, Firestore, onSnapshot } from '@angular/fire/firestore';
import { Deadline } from '../interfaces/deadline.interface';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeadlineService {
  firestore = inject(Firestore);

  deadlines = collection(this.firestore, 'deadlines');

  constructor() {}

  getDeadlinesRealtime(handler: (deadlines: Deadline[]) => void): Unsubscribe {
    return onSnapshot(this.deadlines, (snapshot) => handler(snapshot.docs.map((doc) => doc.data() as Deadline)));
  }

  addDeadline(deadline: Deadline): Observable<void> {
    const promise = addDoc(this.deadlines, deadline).then(() => {});
    return from(promise);
  }
}
