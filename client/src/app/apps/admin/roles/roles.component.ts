import {Component, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {CreateUserDialogComponent} from "../create-user-dialog/create-user-dialog.component";
import {UsersService} from '../services/users-service.service';
import {CreateUserResponse} from '../model/create-user-response';
import {SecureUser} from '../model/secure-user';
import {CreateRoleResponse} from '../model/create-role-response';
import {Role} from '../model/role';
import {RolesService} from '../services/roles-service.service';
import {CreateRoleDialogComponent} from '../create-role-dialog/create-role-dialog.component';

@Component({
  selector: 'app-roles',
    imports: [
        CreateRoleDialogComponent
    ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  standalone: true,
})
export class RolesComponent  implements OnInit {
  @ViewChild(CreateRoleDialogComponent) createRoleDialog!: CreateRoleDialogComponent;


  private rolesService = inject(RolesService);

  isRoleCreated : WritableSignal<CreateRoleResponse | null>= signal(null);

  roles: Role[] | null = null;


  ngOnInit(): void {
    this.refreshRolesList();
  }

  refreshRolesList() {
    this.rolesService.getRoles().subscribe(roles => {
      this.roles = roles.items;
    });
  }

  openCreateRoleDialog() {
    this.createRoleDialog.open();
  }

  onUserCreated(createRoleResponse: CreateRoleResponse): void {
    // Refresh list, toast, etc.
    // this.entities = await this.service.fetch();
    this.isRoleCreated.set(createRoleResponse);
    this.refreshRolesList();
    setTimeout(() => {
      this.isRoleCreated.set(null);
    },5000)
  }


}
