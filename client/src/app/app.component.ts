import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private httpClient = inject(HttpClient);

  protected apiHealthCheck = signal<boolean>(false);
  protected apiHealthCheckMessage: string = '';
  protected isReady = signal<boolean>(false);

  title = 'client';




  /**
   *
   */
  constructor() {
  
  }

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
