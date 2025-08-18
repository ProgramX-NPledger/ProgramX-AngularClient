import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../core/services/login-service.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  router = inject(Router)
  loginService = inject(LoginService);

  ngOnInit() {
    // Any initialization logic can go here
    console.log(this.loginService.currentUser());
  }

  login() {
    this.router.navigate(['/login']); 
  }
}
