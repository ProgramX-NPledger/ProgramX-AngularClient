import {Component, effect, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import { HealthCheckService } from '../core/services/health-check-service.service';
import { GetHealthCheckResponse} from '../model/get-health-check-response';
import {catchError, EMPTY, from, mergeMap, Observable, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {HealthCheckItemResponse} from '../model/health-check-item-response';
import {SignalMap} from '../core/SignalMap';
import {EMPTY_SUBSCRIPTION} from 'rxjs/internal/Subscription';
import {EMPTY_OBSERVER} from 'rxjs/internal/Subscriber';


@Component({
  selector: 'app-site-health',
  imports: [
    AsyncPipe
  ],
  templateUrl: './site-health.component.html',
  styleUrl: './site-health.component.css'
})

export class SiteHealthComponent  {

  isLoading = signal(false);
  isTooManyRequests = signal(false);
  isError = signal(false);
  readonly healthCheck$ = this.getHealthCheckServices();

  //
  // healthCheckItems: HealthCheckItemResponse[] = [];
  private healthCheckService = inject(HealthCheckService);
  // healthCheckStatus = signal<GetHealthCheckResponse | null>(null);
  healthCheckItemResults = new SignalMap();

  constructor() {
    effect(()=> {
      console.log('effect pre');
      this.getHealthCheckServices();
      console.log('effect post');
    });
  }
  // readonly healthCheck$: Observable<GetHealthCheckResponse> = this.healthCheckService.healthCheck$.pipe(
  //   tap ((getHealthCheckResponse : GetHealthCheckResponse)=> {
  //     from(getHealthCheckResponse.healthCheckItems.filter(item => !item.immediateHealthCheckResponse)).pipe(
  //       mergeMap(async (service) => this.healthCheckService.getHealthOfService(service.name).subscribe(
  //         r => this.healthCheckItemResults.addOrUpdateItem(service.name, r)))); // r is the individual health check response for each service and needs to be updated on the UI
  //   })
  // );

  // getHealthCheck(name: string) : WritableSignal<GetHealthCheckResponse | null>  {
  //   this.healthCheckService.getHealthOfService(name).subscribe(getHealthCheckResponse => {
  //       console.log(name, getHealthCheckResponse)
  //       this.healthCheckItemResults.addOrUpdateItem(name, getHealthCheckResponse)
  //     }
  //   );
  //   return signal(null);
  // }

  getHealthCheckServices(): Observable<GetHealthCheckResponse>
  {
    this.isLoading.set(true);
    console.log(this.healthCheckService);
    if (
      this.healthCheckService!=null &&
      this.healthCheckService.healthCheckItems$!=null) {
      console.log('not null');
      console.log(this.healthCheckService.healthCheckItems$);
      this.healthCheckService.healthCheckItems$.pipe(
        tap(response => {
            console.log('tap', response)
            // TODO: Is this where we should display the services?
            this.isLoading.set(false);
          }
        ),
        mergeMap(response => from(response.services)),
        mergeMap(service => {
          console.log("service", service);
          return EMPTY;
        }),
        catchError(error => {
          if (error.status === 429) {
            this.isTooManyRequests.set(true);
            console.log('Too many requests, retrying in 10 seconds');
          } else {
            this.isError.set(true);
            console.error('Error whilst getting Health Check',error);
          }
          return from([])
        })
      ).subscribe();
    }
    return from([]);
  }
}
