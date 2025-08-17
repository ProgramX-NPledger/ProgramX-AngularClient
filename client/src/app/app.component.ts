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
  private httpClient = inject(HttpClient);
  private loginService = inject(LoginService);

  protected apiHealthCheck = signal<boolean>(false);
  protected apiHealthCheckMessage: string = '';
  protected isReady = signal<boolean>(false);

  title = 'client';




  /**
   *
   */
  constructor() {
  
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:7276/api/v1/healthcheck').subscribe({
      next: response => {
        this.apiHealthCheck.set(true);
        this.apiHealthCheckMessage = 'API is healthy';
        this.isReady.set(true);
      },
      error: error => {
        this.apiHealthCheck.set(false);
        this.apiHealthCheckMessage = error ? error.message : 'API is not healthy';
        this.isReady.set(true);
      }
    });

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
