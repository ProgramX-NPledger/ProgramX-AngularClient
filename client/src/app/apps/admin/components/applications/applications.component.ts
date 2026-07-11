import {Component, inject, signal, WritableSignal} from '@angular/core';
import {ApplicationsService} from '../../services/applications-service.service';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Application} from '../../../../core/models/application';
import {catchError, EMPTY} from 'rxjs';
import {RolesService} from '../../services/roles-service.service';
import {Role} from '../../models/role';
import {CreateUserDialogComponent} from '../create-user-dialog/create-user-dialog.component';
import {DatePipe} from '@angular/common';
import {DeleteUsersDialogComponent} from '../delete-users-dialog/delete-users-dialog.component';
import {EditUserDialogComponent} from '../edit-user-dialog/edit-user-dialog.component';
import {PaginatorComponent} from '../../../../core/components/paginator/paginator.component';

@Component({
  selector: 'app-applications',
  imports: [
    CreateUserDialogComponent,
    DatePipe,
    DeleteUsersDialogComponent,
    EditUserDialogComponent,
    PaginatorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css',
  standalone: true
})
export class ApplicationsComponent {
  private applicationsService = inject(ApplicationsService);
  private rolesService = inject(RolesService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  applications: Application[] | null = null;
  roles: Role[] | null = null;
  errorMessage: string | null = null;
  isPopulatingGrid : WritableSignal<boolean>= signal(false);

  filterForm = this.formBuilder.group({
    containingText: <string | null> null,
    supportsRoles: '',
  })


  ngOnInit(): void {
    this.refreshRolesFilter();
  }


  refreshApplicationsList() {
    this.applications = [];
    this.isPopulatingGrid.set(true);
    console.log('hello');
    this.applicationsService.getApplications({
      // TODO: filtering should be moved to url
      containingText: this.filterForm.controls.containingText.value,
      withinRoles: this.filterForm.controls.supportsRoles.value
    },{
      offset: 0,
      itemsPerPage: 99,
    }).pipe(
      catchError(error => {
        console.error(error);
        this.isPopulatingGrid.set(false);
        this.errorMessage = error.message;
        console.error('Error fetching Applications:', error);
        return EMPTY;
      })
    ).subscribe(applications => {
      console.log(applications);
      this.applications = applications.applications;
      this.isPopulatingGrid.set(false);
    });
  }

  refreshRolesFilter() {
    this.roles = null;
    this.rolesService.getRoles(null,null)
      .subscribe(roles => {
        this.roles = roles.items;
      })
  }

  clearFilters() {
    this.filterForm.reset();
    this.refreshApplicationsList();
  }




}
