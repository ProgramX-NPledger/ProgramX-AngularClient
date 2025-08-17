import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../core/services/login-service.service';
import { Router } from '@angular/router';
import { SiteHealthComponent } from "../site-health/site-health.component";


@Component({
  selector: 'app-login',
  imports: [FormsModule, SiteHealthComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private loginService: LoginService = inject(LoginService);
  private router = inject(Router);
  
  protected username: string = '';
  protected password: string = '';
  protected isLoading = signal(false);
  protected loginError = signal(false);

  login() {
    this.isLoading.set(true);
    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.loginError.set(false);
        // get the default application
        const defaultApplication = response.applications.find(app => app.IsDefaultApplicationOnLogin);
        if (defaultApplication) {
          this.router.navigate([`/${defaultApplication.targetUrl}`]);
        } else {
          // Navigate to a default route if no default application is set
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.loginError.set(true);
      }
    });
  }
}
