import {AfterViewInit, Component, OnInit, signal, ViewChild} from '@angular/core';
import {UsersComponent} from '../users/users.component';
import {RolesComponent} from '../roles/roles.component';
import {ApplicationsComponent} from '../applications/applications.component';



@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css',
  standalone: false
})
export class ManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(UsersComponent) usersTab!: UsersComponent;
  @ViewChild(RolesComponent) rolesTab!: RolesComponent;
  @ViewChild(ApplicationsComponent) applicationsTab!: ApplicationsComponent;

  // applicationsService = inject(ApplicationsService);

  isBusy = signal(false);
 // applicationsHealthResponse = signal<GetApplicationsHealthResponse | null>(null);

  ngOnInit(): void {
    this.refreshHealthData();
  }

  ngAfterViewInit(): void {
    this.usersTab.refreshUsersList();
  }

  refreshHealthData(): void {
    // this.isBusy.set(true);
    // this.applicationsService.getApplicationsHealth().subscribe({
    //   next: (response) => {
    //     this.isBusy.set(false);
    //     this.applicationsHealthResponse.set(response);
    //   },
    //   error: (error) => {
    //     this.isBusy.set(false);
    //     console.error('Error getting applications health:', error);
    //   }
    // });
  }


  protected onTabClick(tab: string) {
    switch (tab) {
      case "users":
        this.usersTab.refreshUsersList();
        break;
      case "roles":
        this.rolesTab.refreshRolesList();
        break;
      case "applications":
        this.applicationsTab.refreshApplicationsList();
        break;
    }
  }
}
