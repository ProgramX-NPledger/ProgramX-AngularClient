import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../apps/admin/services/users-service.service';
import { Router } from '@angular/router';
import { UpdateResponse } from '../apps/admin/model/update-response';
import { LoginService } from '../core/services/login-service.service';

@Component({
  selector: 'app-update-profile',
  imports: [FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent implements OnInit {
  loginService = inject(LoginService);
  router = inject(Router);

  isError = signal<boolean>(false);
  isBusy = signal<boolean>(false);
  isProfileUpdated = signal<boolean>(false);
  isProfileUpdateFailed = signal<boolean>(false);
  profileUpdateFailedErrorMessage = signal<string | undefined>('');

  ngOnInit(): void {
    if (this.loginService.currentUser()) {      
      const userName: string = this.loginService.currentUser()!.userName; 
      this.isBusy.set(true);
      this.usersService.getUser(userName).subscribe(user => {
        if (!user || !user.user) {
          this.isError.set(true);
          this.isBusy.set(false);
        } else {
          this.userName = user.user.userName;
          this.firstName = user.user.firstName;
          this.lastName = user.user.lastName;
          this.emailAddress = user.user.emailAddress;
          this.isBusy.set(false);
        }
      });
    }
  }

  private usersService = inject(UsersService);

  protected userName: string = '';
  protected firstName: string = '';
  protected lastName: string = '';
  protected emailAddress: string = '';

  updateProfile(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const updateUserRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      emailAddress: this.emailAddress,
      userName: this.userName,
      updateProfileScope: true
    };

    this.isBusy.set(true);
    this.usersService.updateUser(updateUserRequest).subscribe({
      next: (response: UpdateResponse) => {
        console.log(response);
        if (response.isOk) {
          this.isBusy.set(false);
          this.isProfileUpdated.set(true);
        } else {
          this.isBusy.set(false);
          this.isProfileUpdated.set(false);
          this.isProfileUpdateFailed.set(true);
          this.profileUpdateFailedErrorMessage.set(response.errorMessage);
        }
      },
      error: (error: any) => { console.log(error); }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
