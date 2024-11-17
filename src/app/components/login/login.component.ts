import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CONFIG } from '../../config';
import { Credentials } from '../../interfaces/credentials.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: '../../styles/auth.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  passwordMinLength = CONFIG.PasswordMinLength;
  loginError: string = '';

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.maxLength(CONFIG.PasswordMaxLength)]),
  });

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials: Credentials = {
      email: this.loginForm.get('email')?.value!,
      password: this.loginForm.get('password')?.value!,
      fullname: '',
    };

    this.authService.login(credentials).subscribe({
      error: (err) => (this.loginError = err.message),
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  resetError(): void {
    this.loginError = '';
  }
}
