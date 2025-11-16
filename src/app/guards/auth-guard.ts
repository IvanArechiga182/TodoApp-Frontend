import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth-service';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
  const token = localStorage.getItem('authToken');

  if (!token && !auth.authUser()) {
    router.navigate(['']);
    return false;
  }

  return true;
};
