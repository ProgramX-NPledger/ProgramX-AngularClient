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
import {PaginatorComponent} from '../../../paginator/paginator.component';
import {ActivatedRoute, Router} from '@angular/router';
import {PagedData} from '../../../model/paged-data';


@Component({
  selector: 'app-users',
  imports: [
    CreateUserDialogComponent,
    DatePipe,
    ReactiveFormsModule,
    PaginatorComponent,
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
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  isUserCreated : WritableSignal<CreateUserResponse | null>= signal(null);

  pagedUsers: PagedData<SecureUser> | undefined = {
    items : [],
    totalItems : 0,
    pagesWithUrls : [],
    itemsPerPage : 0,
    timeDeltaMs : 0,
    continuationToken : undefined,
    isLastPage : false,
    requestCharge : 0
  };

  //users: SecureUser[] | null = null;
  roles: Role[] | null = null;
  applications: Application[] | null = null;

  filterForm = this.formBuilder.group({
    containingText: <string | null> null,
    hasRole:  <string | null> null,
    hasApplication:  <string | null> null,
  })

  ngOnInit(): void {
    this.refreshRolesFilter();
    this.refreshApplicationsFilter();

    this.onPageChange(1);
  }

  refreshUsersList() {
    //this.users=null;
    console.log('refreshUsersList');
    this.usersService.getUsers({
      containingText: this.filterForm.controls.containingText.value,
      hasRole: this.filterForm.controls.hasRole.value,
      hasApplication: this.filterForm.controls.hasApplication.value,
    },{
      offset: this.activatedRoute.snapshot.queryParams['offset'] ? parseInt(this.activatedRoute.snapshot.queryParams['offset']) : 0,
      itemsPerPage: this.activatedRoute.snapshot.queryParams['itemsPerPage'] ? parseInt(this.activatedRoute.snapshot.queryParams['itemsPerPage']) : 10,
    }).subscribe(pagedData => {
      this.pagedUsers = pagedData;
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

  protected readonly Array = Array;

  onPageChange($event: number) {
    if (this.pagedUsers) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          offset: ($event * this.pagedUsers.itemsPerPage) - this.pagedUsers.itemsPerPage,
          itemsPerPage: this.pagedUsers.itemsPerPage
        },
        queryParamsHandling: 'merge' // Keep existing params
      }).then(r => this.refreshUsersList());
    }
  }

  clearFilters() {
    this.filterForm.reset();
    this.refreshUsersList();
  }
}
