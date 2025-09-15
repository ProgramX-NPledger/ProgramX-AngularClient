import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../core/services/login-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteHealthComponent } from "../site-health/site-health.component";
import { MessageBusService } from '../core/services/message-bus.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-login',
  imports: [FormsModule, SiteHealthComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const changed = this.activatedRoute.snapshot.queryParamMap.get('changedPassword');
    this.isPasswordChanged.set(changed === '' || changed === 'true' || changed === '1');

    const accountConfirmed = this.activatedRoute.snapshot.queryParamMap.get('accountConfirmed');
    this.isAccountConfirmed.set(accountConfirmed === '' || accountConfirmed === 'true' || accountConfirmed === '1');

  }

  private loginService: LoginService = inject(LoginService);
  private router = inject(Router);
  private messageBus = inject(MessageBusService);

  protected username: string = '';
  protected password: string = '';
  protected isLoading = signal(false);
  protected loginError = signal(false);
  protected isPasswordChanged = signal(false);
  protected isAccountConfirmed = signal(false);

  login() {
    this.isLoading.set(true);
    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.loginError.set(false);

        this.messageBus.notifyProfilePhotoChanged(`${environment.azureAvatarImagesStorageAccountUrl}/${this.loginService.currentUser()?.userName}/${response.profilePhotographSmall}`);

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
