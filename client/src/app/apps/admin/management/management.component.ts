import {Component, inject, OnInit, signal} from '@angular/core';
import {ApplicationsService} from '../services/applications-service.service';
import {GetApplicationsHealthResponse} from '../model/get-applications-health-response';


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css',
  standalone: false
})
export class ManagementComponent implements OnInit {

  applicationsService = inject(ApplicationsService);

  isBusy = signal(false);
  applicationsHealthResponse = signal<GetApplicationsHealthResponse | null>(null);

  constructor() {


  }

  ngOnInit(): void {
    this.isBusy.set(true);
    this.applicationsService.getApplicationsHealth().subscribe({
      next: (response) => {
        this.isBusy.set(false);
        this.applicationsHealthResponse.set(response);
      },
      error: (error) => {
        this.isBusy.set(false);
        console.error('Error getting applications health:', error);
      }
    });

  }




}
