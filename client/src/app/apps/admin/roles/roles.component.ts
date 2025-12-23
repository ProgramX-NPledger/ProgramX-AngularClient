import {Component, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {CreateUserDialogComponent} from "../create-user-dialog/create-user-dialog.component";
import {UsersService} from '../services/users-service.service';
import {CreateUserResponse} from '../model/create-user-response';
import {SecureUser} from '../model/secure-user';
import {CreateRoleResponse} from '../model/create-role-response';
import {Role} from '../model/role';
import {RolesService} from '../services/roles-service.service';
import {CreateRoleDialogComponent} from '../create-role-dialog/create-role-dialog.component';
import {DatePipe} from '@angular/common';
import {DeleteUsersDialogComponent} from '../delete-users-dialog/delete-users-dialog.component';
import {EditUserDialogComponent} from '../edit-user-dialog/edit-user-dialog.component';
import {PaginatorComponent} from '../../../paginator/paginator.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ApplicationsService} from '../services/applications-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RoleDeletionCompleteEvent} from '../model/role-deletion-complete-event';
import {UpdateUserResponse} from '../model/update-user-response';
import {PagedData} from '../../../model/paged-data';
import {Application} from '../model/application';
import {catchError, EMPTY} from 'rxjs';
import {EditRoleDialogComponent} from '../edit-role-dialog/edit-role-dialog.component';
import {DeleteRolesDialogComponent} from '../delete-roles-dialog/delete-roles-dialog.component';
import {UpdateRoleResponse} from '../model/update-role-response';

@Component({
  selector: 'app-roles',
  imports: [
    CreateRoleDialogComponent,
    DatePipe,
    DeleteRolesDialogComponent,
    EditRoleDialogComponent,
    PaginatorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  standalone: true,
})
export class RolesComponent  implements OnInit {
  @ViewChild(CreateRoleDialogComponent) createRoleDialog!: CreateRoleDialogComponent;
  @ViewChild(DeleteRolesDialogComponent) deleteRolesDialog!: DeleteRolesDialogComponent;
  @ViewChild(EditRoleDialogComponent) editRoleDialog!: EditRoleDialogComponent;


  private rolesService = inject(RolesService);
  private usersService = inject(UsersService);
  private applicationsService = inject(ApplicationsService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  isRoleCreated : WritableSignal<CreateRoleResponse | null>= signal(null);
  isRolesDeleted : WritableSignal<RoleDeletionCompleteEvent | null>= signal(null);
  isRoleUpdated : WritableSignal<UpdateRoleResponse | null>= signal(null);

  selectedRoles = signal<string[]>([]);
  errorMessage: string | null = null;


  pagedRoles: PagedData<Role> | undefined = {
    items : [],
    totalItems : 0,
    pagesWithUrls : [],
    itemsPerPage : 0,
    timeDeltaMs : 0,
    continuationToken : undefined,
    isLastPage : false,
    requestCharge : 0
  };


  applications: Application[] | null = null;

  filterForm = this.formBuilder.group({
    containingText: <string | null> null,
    usedInApplications: '',
  })


  ngOnInit(): void {
    this.refreshApplicationsFilter();

    this.onPageChange(1);
  }

  refreshRolesList() {
    this.pagedRoles = undefined;
    this.rolesService.getRoles({
      // TODO: filtering should be moved to url
      containingText: this.filterForm.controls.containingText.value,
      usedInApplications: this.filterForm.controls.usedInApplications.value,
    },{
      offset: this.activatedRoute.snapshot.queryParams['offset'] ? parseInt(this.activatedRoute.snapshot.queryParams['offset']) : 0,
      itemsPerPage: this.activatedRoute.snapshot.queryParams['itemsPerPage'] ? parseInt(this.activatedRoute.snapshot.queryParams['itemsPerPage']) : 5,
    }).pipe(
      catchError(error => {
        this.errorMessage = error.message;
        console.error('Error fetching roles:', error);
        return EMPTY;
      })
    ).subscribe(pagedData => {
      this.pagedRoles = pagedData;
    });
  }


  refreshApplicationsFilter() {
    this.applications = null;
    this.applicationsService.getApplications()
      .subscribe(applications => {
        this.applications = applications.items;
      })
  }




  openCreateRoleDialog() {
    this.createRoleDialog.open();
  }

  openEditRoleDialog(role: Role) {
    this.editRoleDialog.open(role);
  }


  onURoleCreated(createRoleResponse: CreateRoleResponse): void {
    // Refresh list, toast, etc.
    // this.entities = await this.service.fetch();
    this.isRoleCreated.set(createRoleResponse);
    this.refreshRolesList();
    setTimeout(() => {
      this.isRoleCreated.set(null);
    },5000)
  }

  onPageChange($event: number) {
    if (this.pagedRoles) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          offset: ($event * this.pagedRoles.itemsPerPage) - this.pagedRoles.itemsPerPage,
          itemsPerPage: this.pagedRoles.itemsPerPage
        },
        queryParamsHandling: 'merge'
      }).then(r => this.refreshRolesList());
    }
  }

  onRoleSelected($event: string) {
    if (this.selectedRoles().includes($event)) {
      this.selectedRoles.set(this.selectedRoles().filter(x => x !== $event));
    } else {
      this.selectedRoles().push($event);
    }

  }

  clearFilters() {
    this.filterForm.reset();
    this.selectedRoles.set([]);
    this.refreshRolesList();
  }

  openDeleteDialog() {
    this.deleteRolesDialog.open(this.selectedRoles());
  }

  onUsersDeleted($event: RoleDeletionCompleteEvent) {
    this.isRolesDeleted.set($event);
    this.refreshRolesList();
    setTimeout(() => {
      this.isRolesDeleted.set(null);
    },5000)
  }



}
