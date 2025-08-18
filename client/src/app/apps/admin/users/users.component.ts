import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../services/users-service.service';
import { SecureUser } from '../model/secure-user';


@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);
  users: SecureUser[] | null = null;


  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users.items;
      console.log('Users fetched:', users);
    });
  }
}
