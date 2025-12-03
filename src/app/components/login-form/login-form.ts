import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { LoginRequest } from '../../interfaces/auth/Login/login-request';
import { AuthServiceResponse } from '../../interfaces/auth/auth-service-response';
import { getErrorClass as UtilsGetErrorClass } from '../../utils/form-utils';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  constructor(private auth: AuthService, private router: Router) {}
  errorMessage = signal<string>('');
  loading = signal<boolean>(false);
  successMessage = signal<string>('');
  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  getErrorClass(controlName: string): string {
    return UtilsGetErrorClass(this.loginForm, controlName);
  }

  showErrorMessage(msg: string) {
    this.errorMessage.set(msg);
    setTimeout(() => {
      this.errorMessage.set('');
    }, 2000);
  }

  LogIn() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    const request: LoginRequest = {
      username: username!.trim(),
      password: password!.trim(),
    };

    this.auth.LogIn(request).subscribe({
      next: (response: AuthServiceResponse) => {
        const token: string = response.token != null ? response.token : '';
        this.loading.set(true);
        this.successMessage.set(response.message);
        setTimeout(() => {
          this.auth.setUserData(token);
          this.loading.set(false);
          this.router.navigate(['/']);
        }, 5000);
        return;
      },
      error: (error) => {
        this.showErrorMessage(error.error.message);
      },
    });
  }
}
