import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import {LoginResponse} from '../../../../../core/models/login-response';

@Component({
  selector: 'app-user-tile',
  imports: [],
  templateUrl: './user-tile.component.html',
  standalone: true,
  styleUrl: './user-tile.component.css'
})
export class UserTileComponent {
  @Input() loggedInUser: LoginResponse | null = null;

  router: Router = inject(Router)

  login() {
    this.router.navigate(['/login']);
  }

}

