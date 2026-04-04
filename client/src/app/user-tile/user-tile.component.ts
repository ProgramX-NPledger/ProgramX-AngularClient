import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import {User} from '../model/user';

@Component({
  selector: 'app-user-tile',
  imports: [],
  templateUrl: './user-tile.component.html',
  styleUrl: './user-tile.component.css'
})
export class UserTileComponent {
  @Input() loggedInUser: User | null = null;

  router: Router = inject(Router)

  login() {
    this.router.navigate(['/login']);
  }

}
