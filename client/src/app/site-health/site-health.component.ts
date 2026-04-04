import {Component, effect, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import { HealthCheckService } from '../core/services/health-check-service.service';
import { GetHealthCheckResponse} from '../model/get-health-check-response';
import {catchError, EMPTY, from, mergeMap, Observable, of, tap} from 'rxjs';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';
import {HealthCheckItemResponse} from '../model/health-check-item-response';
import {SignalMap} from '../core/SignalMap';
import {EMPTY_SUBSCRIPTION} from 'rxjs/internal/Subscription';
import {EMPTY_OBSERVER} from 'rxjs/internal/Subscriber';
import {GetHealthCheckServiceResponse} from '../model/get-health-check-service-response';


@Component({
  selector: 'app-site-health',
  imports: [
    AsyncPipe,
    NgIf,
    JsonPipe
  ],
  templateUrl: './site-health.component.html',
  styleUrl: './site-health.component.css',
  standalone: true
})

export class SiteHealthComponent  {

  isLoading = signal(false);
  isTooManyRequests = signal(false);
  isError = signal(false);
  isLoadingMore = signal(false);
  healthCheckItemResults = new SignalMap();
  healthCheckItemNames: string[] = [];
  haveReceivedFromHealthChecks: string[] = [];

  private healthCheckService = inject(HealthCheckService);


  readonly healthCheck$: Observable<GetHealthCheckResponse> = this.healthCheckService.healthCheckItems$.pipe(
    tap(response => {
      this.isLoading.set(false);
      this.isError.set(false);
      this.isTooManyRequests.set(false);
      this.isLoadingMore.set(true);
      this.healthCheckItemNames = response.services.map(service => service.name);
      // fan out requests for individual health checks
      of (...this.healthCheckItemNames).pipe(
        mergeMap(
          (healthCheckName: string) => this.healthCheckService.getHealthOfService(healthCheckName)
        )
      ).subscribe(getHealthCheckServiceResponse => {
          this.haveReceivedFromHealthChecks.push(getHealthCheckServiceResponse.name);
          if (this.haveReceivedFromHealthChecks.length === this.healthCheckItemNames.length) {
            this.isLoadingMore.set(false);
          }
          this.healthCheckItemResults.addOrUpdateItem(getHealthCheckServiceResponse.name, getHealthCheckServiceResponse);
        }
      )
    }),
    catchError(error => {
      if (error.status === 429) {
        this.isTooManyRequests.set(true);
      } else {
        this.isError.set(true);
        console.error('Error whilst getting Health Check', error);
      }
      this.isLoading.set(false);
      return EMPTY;
    }),
  );

  constructor() {
    this.isLoading.set(false);
  }
}
