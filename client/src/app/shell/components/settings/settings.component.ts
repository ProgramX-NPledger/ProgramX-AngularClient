import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import {LoginService} from '../../../core/services/login-service.service';
import {AppTheme, isAppTheme, ThemeService} from '../../../core/services/theme-service.service';
import {UserService} from '../../services/user-service.service';
import {UpdateResponse} from '../../../core/models/update-response';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  loginService = inject(LoginService);
  router = inject(Router);
  private userService = inject(UserService);
  themeService = inject(ThemeService);


  isError = signal<boolean>(false);
  isBusy = signal<boolean>(false);
  isSettingsUpdated = signal<boolean>(false);
  isSettingsUpdateFailed  = signal<boolean>(false);
  settingsUpdateFailedErrorMessage = signal<string | undefined>('');

  ngOnInit(): void {
    if (this.loginService.currentUser()) {
      const userName: string = this.loginService.currentUser()!.userName;
      this.isBusy.set(true);
      this.userService.getUser(userName).subscribe(user => {
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
    this.userService.updateSettings(this.loginService.currentUser()!.userName,
      {
      theme: this.theme
    }).subscribe({
      next: (response: UpdateResponse) => {
        this.isBusy.set(false);
        this.isSettingsUpdated.set(true);
        if (isAppTheme(this.theme)) {
          this.themeService.setTheme(this.theme); // OK, AppTheme
        } else {
          // handle invalid theme string (e.g., ignore or set default)
          this.themeService.setTheme('light');
        }
      },
      error: (error: any) => { console.log(error); }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
