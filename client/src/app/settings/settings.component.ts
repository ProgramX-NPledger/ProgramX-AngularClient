import { Component, inject, signal } from '@angular/core';
import { LoginService } from '../core/services/login-service.service';
import { Router } from '@angular/router';
import { UsersService } from '../apps/admin/services/users-service.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UpdateResponse } from '../apps/admin/model/update-response';
import { AppTheme, isAppTheme, ThemeService } from '../core/services/theme-service.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  loginService = inject(LoginService);
  router = inject(Router);
  private usersService = inject(UsersService);
  themeService = inject(ThemeService);
  
  isError = signal<boolean>(false);
  isBusy = signal<boolean>(false);
  isSettingsUpdated = signal<boolean>(false);
  isSettingsUpdateFailed = signal<boolean>(false);
  settingsUpdateFailedErrorMessage = signal<string | undefined>('');

  ngOnInit(): void {
    if (this.loginService.currentUser()) {      
      const userName: string = this.loginService.currentUser()!.userName; 
      this.isBusy.set(true);
      this.usersService.getUser(userName).subscribe(user => {
        if (!user || !user.user) {
          this.isError.set(true);
          this.isBusy.set(false);
        } else {
          const t = user.user?.theme ?? '';
          this.theme = isAppTheme(t) ? t : '';

          this.isBusy.set(false);
        }
      });
    }
  }

  protected theme: AppTheme | '' = '';

  updateSettings(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const UpdateSettingsRequest = {
      theme: this.theme
    };

    this.isBusy.set(true);
    this.usersService.updateSettings({
      userName: this.loginService.currentUser()!.userName,
      updateSettingsScope: true,
      theme: this.theme
    }).subscribe({
      next: (response: UpdateResponse) => {
        if (response.isOk) {
          this.isBusy.set(false);
          this.isSettingsUpdated.set(true);
          if (isAppTheme(this.theme)) {
            this.themeService.setTheme(this.theme); // OK, AppTheme
          } else {
            // handle invalid theme string (e.g., ignore or set default)
            this.themeService.setTheme('light');
          } 
        } else {
          this.isBusy.set(false);
          this.isSettingsUpdated.set(false);
          this.isSettingsUpdateFailed.set(true);
          this.settingsUpdateFailedErrorMessage.set(response.errorMessage);
        }
      },
      error: (error: any) => { console.log(error); }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
