import { inject, Injectable } from '@angular/core';
import { Credentials } from '../interfaces/credentials.interface';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, Unsubscribe, updateProfile, user } from '@angular/fire/auth';
import { collection, doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);
  router = inject(Router);

  users = collection(this.firestore, 'users');

  user = user(this.auth);
  private unsubscribe: Unsubscribe = () => {};
  private userDataSubject = new BehaviorSubject<User | null>(null);
  public userData = this.userDataSubject.asObservable();
  public isLoading = true;

  constructor() {
    this.checkAuthState();
  }

  private checkAuthState() {
    const sub = this.user.subscribe(async (user) => {
      if (user) {
        const userData = await this.subscribeToUserDoc(user.uid);
        if (userData) {
          this.isLoading = false;
          this.userDataSubject.next(userData);
        }
      } else {
        this.isLoading = false;
        this.userDataSubject.next(null);
      }
      this.isLoading = false;
      sub.unsubscribe();
    });
  }

  register(credentials: Credentials): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password).then((res) =>
      updateProfile(res.user, { displayName: credentials.fullname }).then(async () => {
        await setDoc(doc(this.users, res.user.uid), {
          id: res.user.uid,
          email: credentials.email,
          fullname: credentials.fullname,
          editor: false,
        });
        const userData = this.subscribeToUserDoc(res.user.uid);
        this.userDataSubject.next(await userData);
        await this.router.navigate(['/']);
      }),
    );
    return from(promise);
  }

  login(credentials: Credentials): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, credentials.email, credentials.password).then((res) => {
      const userData = this.subscribeToUserDoc(res.user.uid);
      return userData.then((res) => {
        this.userDataSubject.next(res);
        this.router.navigate(['/']);
      });
    });
    return from(promise);
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.unsubscribe();
        this.userDataSubject.next(null);
        this.router.navigate(['/login']);
      }),
    );
  }

  private subscribeToUserDoc(uid: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const userDoc = doc(this.firestore, `users/${uid}`);
      this.unsubscribe();
      this.unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          this.userDataSubject.next(docSnapshot.data() as User);
          resolve(docSnapshot.data() as User);
        } else {
          console.error('User data not found');
          resolve(null);
        }
      });
    });
  }

  get currentUser(): User | null {
    return this.userDataSubject.value;
  }
}
