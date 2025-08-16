import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private httpClient = inject(HttpClient);
  
  protected apiHealthCheck: boolean = false;
  protected apiHealthCheckMessage: string = '';

  title = 'client';




  /**
   *
   */
  constructor() {
  
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:7276/api/v1/healthcheck').subscribe({
      next: response => {
        this.apiHealthCheck = true;
        this.apiHealthCheckMessage = 'API is healthy';
      },
      error: error => {
        this.apiHealthCheck = false;
        this.apiHealthCheckMessage = error ? error.message : 'API is not healthy';
      }
    });
  }
    
  
}
