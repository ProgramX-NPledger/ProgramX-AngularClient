import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../apps/admin/services/users-service.service';
import { LoginService } from '../core/services/login-service.service';
import { MatchValidatorDirective } from '../directives/match-validator';
import { JsonPipe } from '@angular/common';
import {UpdateResponse} from '../apps/admin/models/update-response';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule,MatchValidatorDirective],
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

  protected newPassword: string='';
  protected confirmPassword: string='';

  changePassword(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const updateUserRequest = {
      userName: this.loginService.currentUser()!.userName,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
      updatePasswordScope: true
    };

    // this.isBusy.set(true);
    // this.usersService.updateUser(this.loginService.currentUser()!.userName, updateUserRequest).subscribe({
    //   next: (response: UpdateResponse) => {
    //       this.isBusy.set(false);
    //       this.isPasswordChanged.set(true);
    //       this.loginService.logout();
    //       this.router.navigate(['login'],
    //         {
    //           queryParams: {
    //             changedPassword: true
    //           }
    //         }
    //       )
    //     }
    //   },
    //   error: (error: any) => { console.error(error); }
    // });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  isConfirmPasswordMatching() {
    return this.newPassword === this.confirmPassword;
  }

}
