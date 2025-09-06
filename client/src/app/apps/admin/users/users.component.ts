import {Component, inject, OnInit, ViewChild} from '@angular/core';
import { UsersService } from '../services/users-service.service';
import { SecureUser } from '../model/secure-user';
import {RouterLink} from '@angular/router';
import {CreateUserDialogComponent} from '../create-user-dialog/create-user-dialog.component';


@Component({
  selector: 'app-users',
  imports: [
    RouterLink,
    CreateUserDialogComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  @ViewChild(CreateUserDialogComponent) createUserDialog!: CreateUserDialogComponent;


  private usersService = inject(UsersService);
  users: SecureUser[] | null = null;


  ngOnInit(): void {
    this.refreshUsersList();
  }

  refreshUsersList() {
    this.usersService.getUsers().subscribe(users => {
      this.users = users.items;
      console.log('Users fetched:', users);
    });
  }

  openCreateUserDialog() {
    this.createUserDialog.open();
  }

  onUserCreated(entity: { name: string; description?: string }): void {
    // Refresh list, toast, etc.
    // this.entities = await this.service.fetch();
    this.refreshUsersList();
  }

}
