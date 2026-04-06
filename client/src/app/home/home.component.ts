import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../core/services/login-service.service';
import {SiteHealthComponent} from '../site-health/site-health.component';
import {UserTileComponent} from '../user-tile/user-tile.component';
import {ApplicationsHealthComponent} from '../components/applications-health/applications-health.component';

@Component({
  selector: 'app-home',
  imports: [
    SiteHealthComponent,
    UserTileComponent,
    ApplicationsHealthComponent
  ],
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


}
