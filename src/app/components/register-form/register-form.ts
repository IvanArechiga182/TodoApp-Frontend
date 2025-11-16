import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getErrorClass as UtilsGetErrorClass } from '../../utils/form-utils';
import { AuthService } from '../../services/auth/auth-service';
import { RegisterRequest } from '../../interfaces/auth/Register/register-request';
import { AuthServiceResponse } from '../../interfaces/auth/auth-service-response';
@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  constructor(private auth: AuthService, private router: Router) {}
  errorMessage = signal<string>('');
  loading = signal<boolean>(false);
  successMessage = signal<string>('');
  registerForm = new FormGroup(
    {
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }),
      userEmail: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: this.checkPasswords }
  );

  showErrorMessage(msg: string) {
    this.errorMessage.set(msg);
    setTimeout(() => {
      this.errorMessage.set('');
    }, 2000);
  }

  showPassword() {
    let paswordField = document.getElementById('password') as HTMLInputElement;
    let confirmPasswordField = document.getElementById('confirmPassword') as HTMLInputElement;

    if (paswordField.type === 'password' && confirmPasswordField.type === 'password') {
      paswordField.type = 'text';
      confirmPasswordField.type = 'text';
    } else {
      paswordField.type = 'password';
      confirmPasswordField.type = 'password';
    }
  }

  getErrorClass(controlName: string): string {
    return UtilsGetErrorClass(this.registerForm, controlName);
  }

  checkPasswords(group: AbstractControl): ValidationErrors | null {
    const { password, confirmPassword } = group.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, userEmail, password, confirmPassword } = this.registerForm.value;
    const request: RegisterRequest = {
      username: username!.trim(),
      email: userEmail!.trim(),
      password: password!.trim(),
    };

    this.auth.RegisterUser(request).subscribe({
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
