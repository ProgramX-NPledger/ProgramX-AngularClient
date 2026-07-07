import {Component, signal, inject, OnDestroy, OnInit} from '@angular/core';
import {catchError, EMPTY, finalize, from, mergeMap, Subject, takeUntil, tap} from 'rxjs';
import {SignalMap} from '../../../../../core/SignalMap';
import {ApplicationsHealthCheckService} from '../../../../services/applications-health-check-service.service';
import {ApplicationsService} from '../../../../../core/services/applications.service';
import {LoginService} from '../../../../../core/services/login-service.service';
import {Application} from '../../../../../core/models/application';
import {GetHealthCheckServiceResponse} from '../../../../../models/get-health-check-service-response';

@Component({
    selector: 'app-applications-health',
    templateUrl: './applications-health.component.html',
    standalone: true,
    styleUrl: './applications-health.component.css'
})

export class ApplicationsHealthComponent implements OnInit, OnDestroy {
  isLoadingApplications = signal(false);
  isLoadingHealthChecks = signal(false);
  isUserLoggedIn = signal(false);
  isError = signal(false);

  healthCheckItemResults = new SignalMap();
  applications = signal<Application[]>([]);

  private destroy$ = new Subject<void>();

  private applicationsService = inject(ApplicationsService);
  private healthCheckService = inject(ApplicationsHealthCheckService);
  private loginService = inject(LoginService);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadApplications() {
    const currentUser = this.loginService.currentUser();
    if (!currentUser) {
      this.isUserLoggedIn.set(false);
      this.applications.set([]);
      return;
    }

    this.isUserLoggedIn.set(true);
    this.isLoadingApplications.set(true);
    this.applicationsService.getApplicationsForRoles(currentUser.memberOfRoles).pipe(
      tap((applications: Application[]) => {
        this.applications.set(applications);
        this.loadHealthChecks(applications);
      }),
      catchError(error => {
        console.error('Error whilst getting applications', error);
        this.isError.set(true);
        this.applications.set([]);
        return EMPTY;
      }),
      finalize(() => this.isLoadingApplications.set(false)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private loadHealthChecks(applications: Application[]) {
    this.isLoadingHealthChecks.set(true);
    this.healthCheckItemResults.clearAll();

    from(applications).pipe(
      mergeMap((application: Application) =>
        this.healthCheckService.getHealthOfApplication(application.name).pipe(
          tap((result: GetHealthCheckServiceResponse) => {
            this.healthCheckItemResults.addOrUpdateItem(result.name || application.name, result);
          }),
          catchError(error => {
            console.error(`Error whilst getting health check for ${application.name}`, error);
            this.healthCheckItemResults.addOrUpdateItem(application.name, {
              name: application.name,
              timeStamp: new Date(),
              isHealthy: false,
              message: 'Health check failed',
              subItems: []
            });
            return EMPTY;
          })
        )
      ),
      finalize(() => this.isLoadingHealthChecks.set(false)),
      takeUntil(this.destroy$)
    ).subscribe();
  }


  ngOnInit(): void {
    this.loadApplications();
  }
}
