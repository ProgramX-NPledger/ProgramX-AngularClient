import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../core/services/login-service.service';
import {CommitInformationComponent} from '../dashboard-panels/commit-information/commit-information.component';
import {UserTileComponent} from '../shell/components/dashboard/tiles/user-tile/user-tile.component';
import {SiteHealthComponent} from '../shell/components/dashboard/tiles/site-health/site-health.component';
import {
  ApplicationsHealthComponent
} from '../shell/components/dashboard/tiles/applications-health/applications-health.component';

@Component({
  selector: 'app-home',
  imports: [
    SiteHealthComponent,
    UserTileComponent,
    ApplicationsHealthComponent,
    CommitInformationComponent
  ],
  templateUrl: './home.component.html',
  standalone: true,
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
