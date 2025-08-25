import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../apps/admin/services/users-service.service';
import { UpdateResponse } from '../apps/admin/model/update-response';
import { LoginService } from '../core/services/login-service.service';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})

export class ChangePasswordComponent {
  usersService = inject(UsersService);
  loginService = inject(LoginService);
  router = inject(Router);

  isError = signal<boolean>(false);
  isBusy = signal<boolean>(false);
  isPasswordChanged = signal<boolean>(false);
  isPasswordChangedFailed = signal<boolean>(false);
  passwordChangedFailedErrorMessage = signal<string | undefined>('');

  ngOnInit(): void {
  }

  protected newPassword: string='';
  protected confirmPassword: string='';

  changePassword(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const updateUserRequest = {
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmPassword
    };

    this.isBusy.set(true);
    this.usersService.updateUser(updateUserRequest).subscribe({
      next: (response: UpdateResponse) => {
        console.log(response);
        if (response.isOk) {
          this.isBusy.set(false);
          this.isPasswordChanged.set(true);
          this.loginService.logout();
          this.router.navigate(['login'])
        } else {
          this.isBusy.set(false);
          this.isPasswordChanged.set(false);
          this.isPasswordChangedFailed.set(true);
          this.passwordChangedFailedErrorMessage.set(response.errorMessage);
        }
      },
      error: (error: any) => { console.log(error); }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
