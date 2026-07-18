import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {UserService} from '../../services/user-service.service';
import {LoginService} from '../../../core/services/login-service.service';
import {MatchValidatorDirective} from '../../../directives/match-validator';
import {UpdateUserPasswordRequest} from '../../models/update-user-password-request';
import {UpdateUserPasswordResponse} from '../../models/update-user-password-response';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule,MatchValidatorDirective],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})

export class ChangePasswordComponent {

  userService = inject(UserService);
  loginService = inject(LoginService);
  router = inject(Router);

  isError = signal<boolean>(false);
  isBusy = signal<boolean>(false);
  isPasswordChanged = signal<boolean>(false);
  isPasswordChangedFailed = signal<boolean>(false);
  passwordChangedFailedErrorMessage = signal<string | undefined>('');

  protected currentPassword: string='';
  protected newPassword: string='';
  protected confirmPassword: string='';
  protected confirmPasswordNonce: string | null=null;

  changePassword(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const updateUserPasswordRequest: UpdateUserPasswordRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      passwordConfirmationNonce: this.confirmPasswordNonce,
    };

    this.isBusy.set(true);
    this.userService.updateUserPassword(this.loginService.currentUser()!.userName, updateUserPasswordRequest).subscribe({
      next: (response: UpdateUserPasswordResponse) => {
          this.isBusy.set(false);
          this.isPasswordChanged.set(true);
          this.loginService.logout();
          this.router.navigate(['login'],
            {
              queryParams: {
                changedPassword: true
              }
            }
          )
        },
        error: (error: any) => {
          this.isBusy.set(false);
          switch (error.status) {
            case 401:
              this.isPasswordChangedFailed.set(true);
              this.passwordChangedFailedErrorMessage.set('Current password is incorrect.');
              break;
            case 403:
              this.isPasswordChangedFailed.set(true);
              this.passwordChangedFailedErrorMessage.set('Attempt to change another user\'s password is not allowed.');
              break;
            case 400:
              this.isPasswordChangedFailed.set(true);
              this.passwordChangedFailedErrorMessage.set('Password was not complex enough.');
              break;
            case 404:
              this.isPasswordChangedFailed.set(true);
              this.passwordChangedFailedErrorMessage.set('User not found.');
              break;
            default:
              this.isPasswordChangedFailed.set(true);
              this.passwordChangedFailedErrorMessage.set('A server error occurred.');
          }
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  isConfirmPasswordMatching() {
    return this.newPassword === this.confirmPassword;
  }

}
