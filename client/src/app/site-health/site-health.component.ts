import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HealthCheckService } from '../core/services/health-check-service.service';
import {GetHealthCheckResponse} from '../model/get-health-check-response';
import {from, mergeMap} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-site-health',
  imports: [],
  templateUrl: './site-health.component.html',
  styleUrl: './site-health.component.css'
})
export class SiteHealthComponent implements OnInit {
  private healthCheckService = inject(HealthCheckService);
  healthCheckStatus = signal<GetHealthCheckResponse | null>(null);

  ngOnInit() {
    this.getHealth();
  }

  getHealth() {
    this.healthCheckService.getHealth().subscribe({
      next: response => {
        this.healthCheckStatus.set(response);
        from(response.healthCheckItems.filter(item => !item.immediateHealthCheckResponse)).pipe(
          mergeMap(service =>
            this.healthCheckService.getHealthOfService(service.name))).subscribe(r => console.log(r)); // r is the individual health check response for each service and needs to be updated on the UI

      },
      error: error => {
        // this.healthCheckStatus.set({
        //   status: error.message,
        //   azureFunctions: false,
        //   azureCosmosDb: false,
        //   azureStorage: false
        // } as HealthCheck);
      }
    });
  }
}
