import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HealthCheckService } from '../core/services/health-check-service.service';
import { HealthCheck } from '../model/health-check';

@Component({
  selector: 'app-site-health',
  imports: [],
  templateUrl: './site-health.component.html',
  styleUrl: './site-health.component.css'
})
export class SiteHealthComponent implements OnInit {
  private healthCheckService = inject(HealthCheckService);
  healthCheckStatus = signal<HealthCheck | null>(null);

  ngOnInit() {
    this.getHealth();
  }

  getHealth() {
    this.healthCheckService.getHealth().subscribe({
      next: response => {
        this.healthCheckStatus.set(response);
        console.log('Health Check Response:', response);
      },
      error: error => {
        this.healthCheckStatus.set({
          status: error.message,
          azureFunctions: false,
          azureCosmosDb: false,
          azureStorage: false
        } as HealthCheck);
      }
    });
  }
}
