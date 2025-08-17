import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavComponent } from "./layout/nav/nav.component";
import { LoginComponent } from "./login/login.component";
import { LoginService } from './core/services/login-service.service';
import { ManagementComponent } from './apps/admin/management/management.component';
import { AdminModule } from './apps/admin/admin.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, NavComponent, LoginComponent, AdminModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  private loginService = inject(LoginService);

  
  title = 'client';




  /**
   *
   */
  constructor() {
  
  }

  ngOnInit() {
   

    this.setCurrentUser();
  }

  setCurrentUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userObject = JSON.parse(user);
      this.loginService.currentUser.set(userObject);
      }
  
  }
}
