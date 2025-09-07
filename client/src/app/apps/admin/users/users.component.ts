import {Component, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import { UsersService } from '../services/users-service.service';
import { SecureUser } from '../model/secure-user';
import {CreateUserDialogComponent} from '../create-user-dialog/create-user-dialog.component';
import {CreateUserResponse} from '../model/create-user-response';


@Component({
  selector: 'app-users',
  imports: [
    CreateUserDialogComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  @ViewChild(CreateUserDialogComponent) createUserDialog!: CreateUserDialogComponent;


  private usersService = inject(UsersService);

  isUserCreated : WritableSignal<CreateUserResponse | null>= signal(null);

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

  onUserCreated(createUserResponse: CreateUserResponse): void {
    // Refresh list, toast, etc.
    // this.entities = await this.service.fetch();
    this.isUserCreated.set(createUserResponse);
    this.refreshUsersList();
    setTimeout(() => {
      this.isUserCreated.set(null);
    },5000)
  }

}
