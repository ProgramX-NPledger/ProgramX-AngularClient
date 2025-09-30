import {Component, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import { UsersService } from '../services/users-service.service';
import { SecureUser } from '../model/secure-user';
import {CreateUserDialogComponent} from '../create-user-dialog/create-user-dialog.component';
import {CreateUserResponse} from '../model/create-user-response';
import {DatePipe} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {RolesService} from '../services/roles-service.service';
import {ApplicationsService} from '../services/applications-service.service';
import {Role} from '../model/role';
import {Application} from '../model/application';


@Component({
  selector: 'app-users',
  imports: [
    CreateUserDialogComponent,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: true,
})

export class UsersComponent implements OnInit {
  @ViewChild(CreateUserDialogComponent) createUserDialog!: CreateUserDialogComponent;

  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private applicationsService = inject(ApplicationsService);
  private formBuilder = inject(FormBuilder);

  isUserCreated : WritableSignal<CreateUserResponse | null>= signal(null);

  users: SecureUser[] | null = null;
  roles: Role[] | null = null;
  applications: Application[] | null = null;

  filterForm = this.formBuilder.group({
    containingText: <string | null> null,
    hasRole:  <string | null> null,
    hasApplication:  <string | null> null,
  })

  pagingForm = this.formBuilder.group({
    continuationToken:  <string | null> null,
  })

  ngOnInit(): void {
    this.refreshUsersList();
    this.refreshRolesFilter();
    this.refreshApplicationsFilter();
  }

  refreshUsersList() {
    this.users=null;
    this.usersService.getUsers({
      containingText: this.filterForm.controls.containingText.value,
      hasRole: this.filterForm.controls.hasRole.value,
      hasApplication: this.filterForm.controls.hasApplication.value,
      continuationToken: this.pagingForm.controls.continuationToken.value,
    }).subscribe(users => {
      this.users = users.items;
      this.pagingForm.controls.continuationToken.setValue(users.continuationToken ?? null)
      console.log('Users fetched:', users);
      console.log(this.filterForm.controls.containingText.value);
    });
  }

  refreshRolesFilter() {
    this.roles = null;
    this.rolesService.getRoles()
      .subscribe(roles => {
        this.roles = roles.items;
      })
  }

  refreshApplicationsFilter() {
    this.applications = null;
    this.applicationsService.getApplications()
      .subscribe(applications => {
        this.applications = applications.items;
      })
  }

  openCreateUserDialog() {
    this.createUserDialog.open();
  }

  getUserApplications(user: SecureUser): Application[] {
    return user?.roles?.flatMap(role => role?.applications || []) || [];
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
