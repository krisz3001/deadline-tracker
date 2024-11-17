import { inject, Injectable } from '@angular/core';
import { Unsubscribe } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  Query,
  runTransaction,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Deadline } from '../interfaces/deadline.interface';
import { from, Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class DeadlineService {
  firestore = inject(Firestore);

  deadlines = collection(this.firestore, 'deadlines');

  getCommonDeadlinesRealtime(handler: (deadlines: Deadline[]) => void): Unsubscribe {
    return onSnapshot(this.getFilteredQuery(this.deadlines), (snapshot) =>
      handler(
        snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Deadline;
        }),
      ),
    );
  }

  getPersonalDeadlinesRealtime(user: User, handler: (deadlines: Deadline[]) => void): Unsubscribe {
    const userDeadlines = collection(this.firestore, `users/${user.id}/deadlines`);
    return onSnapshot(this.getFilteredQuery(userDeadlines), (snapshot) =>
      handler(
        snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Deadline;
        }),
      ),
    );
  }

  addCommonDeadline(deadline: Deadline): Observable<void> {
    const promise = addDoc(this.deadlines, deadline).then((doc) => updateDoc(doc, { id: doc.id }));
    return from(promise);
  }

  addPersonalDeadline(user: User, deadline: Deadline): Observable<void> {
    const userDeadlines = collection(this.firestore, `users/${user.id}/deadlines`);
    const promise = addDoc(userDeadlines, deadline).then((doc) => updateDoc(doc, { id: doc.id }));
    return from(promise);
  }

  editCommonDeadline(deadline: Deadline): Observable<void> {
    const promise = setDoc(doc(this.deadlines, deadline.id), deadline);
    return from(promise);
  }

  editPersonalDeadline(user: User, deadline: Deadline): Observable<void> {
    const userDeadlines = collection(this.firestore, `users/${user.id}/deadlines`);
    const promise = setDoc(doc(userDeadlines, deadline.id), deadline);
    return from(promise);
  }

  deleteCommonDeadline(deadline: Deadline): Observable<void> {
    const promise = deleteDoc(doc(this.deadlines, deadline.id));
    return from(promise);
  }

  deletePersonalDeadline(user: User, deadline: Deadline): Observable<void> {
    const userDeadlines = collection(this.firestore, `users/${user.id}/deadlines`);
    const promise = deleteDoc(doc(userDeadlines, deadline.id));
    return from(promise);
  }

  saveAndTransferToUser(deadline: Deadline, user: User): Observable<void> {
    deadline.ownerId = user.id;
    deadline.ownerName = user.fullname;
    deadline.isPersonal = true;

    const promise = runTransaction(this.firestore, async (transaction) => {
      const userDeadlines = collection(this.firestore, `users/${user.id}/deadlines`);
      transaction.set(doc(userDeadlines, deadline.id), deadline);
      transaction.delete(doc(this.deadlines, deadline.id));
    });

    return from(promise);
  }

  saveAndTransferToCommon(deadline: Deadline): Observable<void> {
    deadline.isPersonal = false;

    const promise = runTransaction(this.firestore, async (transaction) => {
      const userDeadlines = collection(this.firestore, `users/${deadline.ownerId}/deadlines`);
      transaction.set(doc(this.deadlines, deadline.id), deadline);
      transaction.delete(doc(userDeadlines, deadline.id));
    });

    return from(promise);
  }

  private getFilteredQuery(collection: CollectionReference): Query {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return query(collection, where('date', '>=', Timestamp.fromDate(today)));
  }
}
