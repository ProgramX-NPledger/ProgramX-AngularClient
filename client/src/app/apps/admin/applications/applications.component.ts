import {Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {CreateRoleDialogComponent} from "../create-role-dialog/create-role-dialog.component";
import {DeleteRolesDialogComponent} from "../delete-roles-dialog/delete-roles-dialog.component";
import {EditRoleDialogComponent} from "../edit-role-dialog/edit-role-dialog.component";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginatorComponent} from "../../../paginator/paginator.component";
import {RolesService} from '../services/roles-service.service';
import {UsersService} from '../services/users-service.service';
import {ApplicationsService} from '../services/applications-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateRoleResponse} from '../model/create-role-response';
import {RoleDeletionCompleteEvent} from '../model/role-deletion-complete-event';
import {UpdateRoleResponse} from '../model/update-role-response';
import {PagedData} from '../../../model/paged-data';
import {Role} from '../model/role';
import {Application} from '../../../model/application';
import {catchError, EMPTY} from 'rxjs';
import {EditApplicationDialogComponent} from '../edit-application-dialog/edit-application-dialog.component';
import {UpdateApplicationResponse} from '../model/update-application-response';

@Component({
  selector: 'app-applications',
    imports: [
        EditApplicationDialogComponent,
        FormsModule,
        PaginatorComponent,
        ReactiveFormsModule
    ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css',
  standalone: true
})
export class ApplicationsComponent {
  @ViewChild(EditApplicationDialogComponent) editApplicationDialog!: EditApplicationDialogComponent;

  private rolesService = inject(RolesService);
  private applicationsService = inject(ApplicationsService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  isApplicationUpdated : WritableSignal<UpdateApplicationResponse | null>= signal(null);

  selectedApplications = signal<string[]>([]);
  errorMessage: string | null = null;

  pagedApplications: PagedData<Application> | undefined = {
    items : [],
    totalItems : 0,
    pagesWithUrls : [],
    itemsPerPage : 0,
    timeDeltaMs : 0,
    continuationToken : undefined,
    isLastPage : false,
    requestCharge : 0
  };


  roles: Role[] | null = null;

  filterForm = this.formBuilder.group({
    containingText: <string | null> null,
    withinRoles: '',
  })


  ngOnInit(): void {
    this.refreshRolesFilter();
    this.onPageChange(1);
  }

  refreshApplicationsList() {
    this.pagedApplications = undefined;
    this.applicationsService.getApplications({
      // TODO: filtering should be moved to url
      containingText: this.filterForm.controls.containingText.value,
      withinRoles: this.filterForm.controls.withinRoles.value,
    },{
      offset: this.activatedRoute.snapshot.queryParams['offset'] ? parseInt(this.activatedRoute.snapshot.queryParams['offset']) : 0,
      itemsPerPage: this.activatedRoute.snapshot.queryParams['itemsPerPage'] ? parseInt(this.activatedRoute.snapshot.queryParams['itemsPerPage']) : 5,
    }).pipe(
      catchError(error => {
        this.errorMessage = error.message;
        console.error('Error fetching applications:', error);
        return EMPTY;
      })
    ).subscribe(pagedData => {
      this.pagedApplications = pagedData;
    });
  }



  refreshRolesFilter() {
    this.roles = null;
    this.rolesService.getRoles(null,null)
      .subscribe(roles => {
        this.roles = roles.items;
      })
  }


  openEditApplicationDialog(application: Application) {
    this.editApplicationDialog.open(application);
  }


  onPageChange($event: number) {
    if (this.pagedApplications) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          offset: ($event * this.pagedApplications.itemsPerPage) - this.pagedApplications.itemsPerPage,
          itemsPerPage: this.pagedApplications.itemsPerPage
        },
        queryParamsHandling: 'merge'
      }).then(r => this.refreshApplicationsList());
    }
  }


  onApplicationSelected($event: string) {
    if (this.selectedApplications().includes($event)) {
      this.selectedApplications.set(this.selectedApplications().filter(x => x !== $event));
    } else {
      this.selectedApplications().push($event);
    }

  }


  clearFilters() {
    this.filterForm.reset();
    this.selectedApplications.set([]);
    this.refreshApplicationsList();
  }

  onApplicationUpdated(updateApplicationResponse: UpdateApplicationResponse): void {
    // Refresh list, toast, etc.
    // this.entities = await this.service.fetch();
    this.isApplicationUpdated.set(updateApplicationResponse);
    this.refreshApplicationsList();
    setTimeout(() => {
      this.isApplicationUpdated.set(null);
    },5000)
  }





}
