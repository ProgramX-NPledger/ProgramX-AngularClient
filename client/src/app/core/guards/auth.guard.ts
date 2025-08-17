import { inject } from '@angular/core/primitives/di';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from '../services/login-service.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  loginService = inject(LoginService);
  router = inject(Router);
  
  canActivate(): boolean | UrlTree {
    const isAuthenticated = this.loginService.currentUser() !== null;  
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return this.router.parseUrl('/login');
    }
    return true;
  }
  

}
