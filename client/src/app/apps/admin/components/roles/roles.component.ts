import {Component, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, EMPTY} from 'rxjs';
import {EditRoleDialogComponent} from '../edit-role-dialog/edit-role-dialog.component';
import {Role} from '../../models/role';
import {RolesService} from '../../services/roles-service.service';
import {PaginatorComponent} from '../../../../core/components/paginator/paginator.component';
import {ApplicationsService} from '../../services/applications-service.service';
import {PagedData} from '../../../../core/models/paged-data';
import {UpdateRoleResponse} from '../../models/update-role-response';

@Component({
  selector: 'app-roles',
  imports: [
    DatePipe,
    EditRoleDialogComponent,
    PaginatorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
  standalone: true,
})
export class RolesComponent  implements OnInit {
  @ViewChild(EditRoleDialogComponent) editRoleDialog!: EditRoleDialogComponent;


  private rolesService = inject(RolesService);
  private applicationsService = inject(ApplicationsService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

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


  //applications: Application[] | null = null;

  filterForm = this.formBuilder.group({
    containingText: <string | null> null,
    usedInApplications: '',
  })


  ngOnInit(): void {
    // this.refreshApplicationsFilter();

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


  // getRoleApplications(role: Role): Application[] {
  //   return role?.applications.flatMap(application => application || []) || [];
  // }

  // refreshApplicationsFilter() {
  //   this.applications = null;
  //   this.applicationsService.getApplications(null,null)
  //     .subscribe(applications => {
  //       this.applications = applications.items;
  //     })
  // }



  openEditRoleDialog(role: Role) {
    this.editRoleDialog.open(role);
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


  onRoleUpdated(updateRoleResponse: UpdateRoleResponse): void {
    // Refresh list, toast, etc.
    // this.entities = await this.service.fetch();
    this.isRoleUpdated.set(updateRoleResponse);
    this.refreshRolesList();
    setTimeout(() => {
      this.isRoleUpdated.set(null);
    },5000)
  }


}
