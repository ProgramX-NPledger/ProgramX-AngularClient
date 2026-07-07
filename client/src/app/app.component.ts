import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './core/services/login-service.service';
import { AdminModule } from './apps/admin/admin.module';
import {NavComponent} from './shell/components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, AdminModule ],
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
