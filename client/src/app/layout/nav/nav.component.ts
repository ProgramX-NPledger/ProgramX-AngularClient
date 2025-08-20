import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../core/services/login-service.service';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent  {
  loginService = inject(LoginService);
  router = inject(Router);
  
  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  login() {
    this.router.navigate(['/login']); 
  }

}
