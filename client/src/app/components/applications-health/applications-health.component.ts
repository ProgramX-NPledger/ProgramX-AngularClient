import { Component, signal, inject } from '@angular/core';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';
import {catchError, EMPTY, from, mergeMap, Observable, of, tap} from 'rxjs';
import {SignalMap} from '../../core/SignalMap';
import {GetHealthCheckResponse} from '../../model/get-health-check-response';
import {ApplicationsHealthCheckServiceService} from '../../services/applications-health-check-service.service';
import {ApplicationHealthCheckService} from '../../model/application-health-check-service';
import {GetApplicationsForHealthCheckResponse} from '../../model/get-applications-for-health-check-response';

@Component({
  selector: 'app-applications-health',
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './applications-health.component.html',
  styleUrl: './applications-health.component.css'
})
export class ApplicationsHealthComponent {
  isLoading = signal(false);
  isError = signal(false);
  healthCheckItemResults = new SignalMap();
  healthCheckItemNames: string[] = [];
  haveReceivedFromHealthChecks: string[] = [];

  private healthCheckService = inject(ApplicationsHealthCheckServiceService);


  readonly healthCheck$: Observable<GetApplicationsForHealthCheckResponse> = this.healthCheckService.healthCheckItems$.pipe(
    tap(response => {
      this.isLoading.set(false);
      this.isError.set(false);
      // fan out requests for individual health checks
      of (...response.healthCheckServices).pipe(
        mergeMap(
          (applicationHealthCheckService: ApplicationHealthCheckService) => this.healthCheckService.getHealthOfApplication(applicationHealthCheckService.name)
        )
      ).subscribe(getHealthCheckServiceResponse => {
          this.healthCheckItemResults.addOrUpdateItem(getHealthCheckServiceResponse.name, getHealthCheckServiceResponse);
        }
      )
    }),
    catchError(error => {
      this.isError.set(true);
      console.error('Error whilst getting Health Check', error);
      this.isLoading.set(false);
      return EMPTY;
    }),
  );

  constructor() {
    this.isLoading.set(false);
  }
}
