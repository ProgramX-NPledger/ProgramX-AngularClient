import { HttpInterceptorFn } from '@angular/common/http';
import { LoginService } from '../services/login-service.service';
import { inject } from '@angular/core/primitives/di';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const currentUser = loginService.currentUser();
  if (currentUser && currentUser.token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};
