import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms';
import {UsersService} from '../apps/admin/services/users-service.service';
import {LoginService} from '../core/services/login-service.service';
import {UpdateResponse} from '../apps/admin/model/update-response';
import {MatchValidatorDirective} from '../directives/match-validator';

@Component({
  selector: 'app-confirm-password',
  imports: [
    FormsModule,
    MatchValidatorDirective
  ],
  templateUrl: './confirm-password.component.html',
  styleUrl: './confirm-password.component.css'
})
export class ConfirmPasswordComponent {

  activatedRoute = inject(ActivatedRoute);
  usersService = inject(UsersService);
  router = inject(Router);
  loginService = inject(LoginService);

  isError = signal<boolean>(false);
  isBusy = signal<boolean>(false);
  isPasswordChangedFailed = signal<boolean>(false);
  passwordChangedFailedErrorMessage = signal<string | undefined>('');

  protected newPassword: string='';
  protected confirmPassword: string='';

  changePassword(form: NgForm) {
    console.log("change password", form);
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const nonce: string = this.activatedRoute.snapshot.params['n'];
    const userName: string = this.activatedRoute.snapshot.params['username'];

    const updateUserRequest = {
      userName: userName,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
      updatePasswordScope: true,
      confirmPasswordNonce: nonce
    };

    console.log("updateUserRequest",updateUserRequest);
    this.isBusy.set(true);
    this.usersService.updateUser(updateUserRequest).subscribe({
      next: (response: UpdateResponse) => {
        if (response.isOk) {
          this.isBusy.set(false);
          this.loginService.logout();
          this.router.navigate(['login'],
            {
              queryParams: {
                accountConfirmed: true
              }
            }
          )
        } else {
          this.isBusy.set(false);
          this.isPasswordChangedFailed.set(true);
          this.passwordChangedFailedErrorMessage.set(response.errorMessage);
        }
      },
      error: (error: any) => { console.error(error); }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  isConfirmPasswordMatching() {
    return this.newPassword === this.confirmPassword;
  }


}
