import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CONFIG } from '../../config';
import { Credentials } from '../../interfaces/credentials.interface';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: '../../styles/auth.component.css',
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  passwordMinLength = CONFIG.PasswordMinLength;
  registerError: string = '';

  readonly registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(CONFIG.PasswordMinLength), Validators.maxLength(CONFIG.PasswordMaxLength)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.maxLength(CONFIG.PasswordMaxLength)]),
    },
    { validators: CustomValidators.MatchingPasswords, updateOn: 'change' },
  );

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const credentials: Credentials = {
      email: this.registerForm.get('email')?.value!,
      password: this.registerForm.get('password')?.value!,
      fullname: this.registerForm.get('fullname')?.value!,
    };

    this.authService.register(credentials).subscribe({
      error: (err) => (this.registerError = err.message),
    });
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get fullname() {
    return this.registerForm.get('fullname')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get passwordConfirm() {
    return this.registerForm.get('passwordConfirm')!;
  }

  resetError(): void {
    this.registerError = '';
  }
}
