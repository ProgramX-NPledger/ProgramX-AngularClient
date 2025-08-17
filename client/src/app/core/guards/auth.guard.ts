import { inject } from '@angular/core/primitives/di';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);

  return loginService.currentUser() !== null;

};
