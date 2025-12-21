import {Component, effect, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import { HealthCheckService } from '../core/services/health-check-service.service';
import { GetHealthCheckResponse} from '../model/get-health-check-response';
import {catchError, EMPTY, from, mergeMap, Observable, of, tap} from 'rxjs';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';
import {HealthCheckItemResponse} from '../model/health-check-item-response';
import {SignalMap} from '../core/SignalMap';
import {EMPTY_SUBSCRIPTION} from 'rxjs/internal/Subscription';
import {EMPTY_OBSERVER} from 'rxjs/internal/Subscriber';


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
  healthCheckItemResults = new SignalMap();

  private healthCheckService = inject(HealthCheckService);


  readonly healthCheck$: Observable<GetHealthCheckResponse> = this.healthCheckService.healthCheckItems$.pipe(
    tap(response => {
      this.isLoading.set(false);
      this.isError.set(false);
      this.isTooManyRequests.set(false);
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
    tap(response => {
      response.services.forEach(service => {
        this.healthCheckService.getHealthOfService(service.name).pipe(
          tap(result => {
            this.healthCheckItemResults.addOrUpdateItem(service.name, result);
          }),
          catchError(error => {
            console.error('Error whilst getting Health Check for ' + service.name, error);
            this.healthCheckItemResults.addOrUpdateItem(service.name, null);
            return EMPTY;
          })
        ).subscribe();
      });
    })
  );

  constructor() {
    this.isLoading.set(false);
  }
}
