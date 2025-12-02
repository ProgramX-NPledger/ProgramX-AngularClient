import {Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import { HealthCheckService } from '../core/services/health-check-service.service';
import { GetHealthCheckResponse} from '../model/get-health-check-response';
import {catchError, from, mergeMap, Observable, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {HealthCheckItemResponse} from '../model/health-check-item-response';
import {SignalMap} from '../core/SignalMap';


@Component({
  selector: 'app-site-health',
  imports: [
    AsyncPipe
  ],
  templateUrl: './site-health.component.html',
  styleUrl: './site-health.component.css'
})

export class SiteHealthComponent implements OnInit {
  ngOnInit(): void {
      this.discoverHealthCheckServices();
  }

  isLoading = signal(false);
  isTooManyRequests = signal(false);
  isError = signal(false);
  healthCheckItems: HealthCheckItemResponse[] = [];
  private healthCheckService = inject(HealthCheckService);
  healthCheckStatus = signal<GetHealthCheckResponse | null>(null);
  private healthCheckItemResults = new SignalMap();

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

  discoverHealthCheckServices() {
    // TODO: Consider renaming this function if this function will be doing all health checks
    this.isLoading.set(true);
    this.healthCheckService.discoverHealthCheck().pipe(
      tap(response => {
          console.log('tap', response)
          this.isLoading.set(false);
        }
      ),
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
    ).subscribe(response => {})
  }
}
