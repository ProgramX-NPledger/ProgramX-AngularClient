import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-site-health',
  imports: [],
  templateUrl: './site-health.component.html',
  styleUrl: './site-health.component.css'
})
export class SiteHealthComponent implements OnInit {
  protected apiHealthCheck = signal<boolean>(false);
  protected apiHealthCheckMessage: string = '';
  protected isReady = signal<boolean>(false);
  private httpClient = inject(HttpClient);

  ngOnInit() {
   this.httpClient.get('http://localhost:7276/api/v1/healthcheck').subscribe({
      next: response => {
        this.apiHealthCheck.set(true);
        this.apiHealthCheckMessage = 'API is healthy';
        this.isReady.set(true);
      },
      error: error => {
        this.apiHealthCheck.set(false);
        this.apiHealthCheckMessage = error ? error.message : 'API is not healthy';
        this.isReady.set(true);
      }
    });
  }
}
