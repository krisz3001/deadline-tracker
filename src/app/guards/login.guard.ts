import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // If logged in, redirect to the user dashboard
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoading) {
      return new Promise((resolve) => {
        const subscription = this.authService.userData.subscribe((user) => {
          if (!this.authService.isLoading) {
            subscription.unsubscribe();
            resolve(this.isAllowed(user));
          }
        });
      });
    }

    return this.isAllowed(this.authService.currentUser);
  }

  private isAllowed(user: User | null): boolean | Promise<boolean> {
    if (user) {
      console.log(user);

      return this.router.navigate(['/']);
    }
    console.log('User is not logged in');

    return true;
  }
}
