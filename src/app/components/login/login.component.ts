import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Credentials } from '../../interfaces/credentials.interface';
import { CONFIG } from '../../config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [trigger('fadeIn', [state('void', style({ opacity: 0 })), transition(':enter', [animate('350ms ease-in', style({ opacity: 1 }))])])],
})
export class LoginComponent {
  isLoading = false;
  loginError = '';

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.maxLength(CONFIG.PasswordMaxLength)]),
  });

  constructor(private authService: AuthService) {}

  login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const creds = this.loginForm.value as Credentials;

    this.authService.login(creds).subscribe({
      next: () => (this.isLoading = false),
      error: (error) => {
        this.isLoading = false;
        this.loginError = error;
        console.log(error);
      },
    });
  }

  isProduction = environment.production;
  letMeIn(): void {
    if (this.isProduction) return;

    const creds: Credentials = { email: 'a@a.aa', password: '123123', fullname: 'Admin' };

    this.authService.register(creds).subscribe({
      next: () => {
        this.authService.login(creds).subscribe();
      },
      error: () => {
        this.authService.login(creds).subscribe();
      },
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
}
