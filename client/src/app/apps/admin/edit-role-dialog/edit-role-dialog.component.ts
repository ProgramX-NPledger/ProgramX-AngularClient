import {Component, ElementRef, EventEmitter, inject, OnInit, Output, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RolesService} from '../services/roles-service.service';
import {UsersService} from '../services/users-service.service';
import {userNameExistsValidator} from '../validators/username-exists.validator';
import {Role} from '../model/role';
import {User} from '../../../model/user';
import {UpdateRoleResponse} from '../model/update-role-response';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-edit-role-dialog',
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './edit-role-dialog.component.html',
  styleUrls:  ['./edit-role-dialog.component.css']
})
export class EditRoleDialogComponent implements OnInit {
  @ViewChild('modal', { static: true }) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() updated = new EventEmitter<UpdateRoleResponse>();

  private formBuilder = inject(FormBuilder);
  private rolesService = inject(RolesService);
  private usersService = inject(UsersService);

  isBusy = signal(false);
  isUpdating = signal(false);
  isLoadingUsers = signal(false);
  isErrorLoadingUsers = signal(false);
  errorMessageLoadingUsers = signal<string | undefined>(undefined);

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
    users: this.formBuilder.array<FormGroup>([])
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  get formControls() {
    return this.form.controls;
  }

  createUserFormsGroup(user: User, isSelected: boolean = false) {
    console.log('createUserFormsGroup',user);
    return this.formBuilder.nonNullable.group({
      isSelected: isSelected,
      userName: user.userName
    })
  }


  loadUsers() {
    this.isLoadingUsers.set(true);
    this.isBusy.set(true);
    this.isErrorLoadingUsers.set(false);
    this.usersService.getUsers(null,null).subscribe(
      {
        next: users => {
          // now get users in role
          this.usersService.getUsers({
            hasRole: this.formControls.name.value
          },null).subscribe(
            {
              next: usersInRole => {
                this.isLoadingUsers.set(false);
                this.isBusy.set(false);
                for (const user of users.items) {
                  this.form.controls.users.push(this.createUserFormsGroup({
                    applications: [],
                    emailAddress: user.emailAddress,
                    firstName: user.firstName,
                    initials: user.initials,
                    lastName: user.lastName,
                    profilePhotographSmall: '',
                    roles: user.roles.map(role => role.name),
                    token: '',
                    userName: user.userName
                  }, usersInRole.items.some(u => u.userName === user.userName)));
                }
              },
              error: error => {
                this.isLoadingUsers.set(false);
                this.isBusy.set(false);
                this.isErrorLoadingUsers.set(true);
                this.errorMessageLoadingUsers.set(error.message);
              }
            })
        },
        error: error => {
          this.isLoadingUsers.set(false);
          this.isBusy.set(false);
          this.isErrorLoadingUsers.set(true);
          this.errorMessageLoadingUsers.set(error.message);
        }
      }
    );
  }


  open(role: Role): void {
    this.form.reset();
    this.modalRef.nativeElement.showModal();
    this.form.patchValue({
      name: role.name,
      description: role.description
    });
    // for (const userInRole of user.roles) {
    //   for (const roleOnForm of this.form.controls.roles.controls) {
    //     if (userInRole.name === roleOnForm.value.name) {
    //       roleOnForm.patchValue({isSelected: true});
    //       break;
    //     }
    //   }
    // }
    this.form.controls.name.disable();
  }


  close(result?: string): void {
    this.modalRef.nativeElement.close(result);
  }



  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.isBusy.set(true);
    this.isUpdating.set(true);
    try {
      this.rolesService.updateRole({
        // updateRolesScope: true,
        // updateProfileScope: true,
        description: this.formControls.description.value,
        name: this.formControls.name.value,
        usersInRole: this.formControls.users.controls.map(m=>m.value).filter(m=>m.isSelected).map(m=>m.userName),
        // userName: this.formControls.userName.value,
        // roles: this.formControls.roles.controls.map(m=>m.value).filter(m=>m.isSelected).map(m=>m.name),
        // emailAddress: this.formControls.emailAddress.value,
        // firstName: this.formControls.firstName.value,
        // lastName: this.formControls.lastName.value,
      }).subscribe({
        next: (response) => {
          this.isBusy.set(false);
          this.isUpdating.set(false);
          this.updated.emit(response as any);
          this.close('updated');
        },
        error: (error) => {
          this.isBusy.set(false);
          this.isUpdating.set(false);
          console.error('Error updating role:', error);
        }
      })
    } finally {
      this.isBusy.set(false);
    }


  }

  onClosed(): void {
    const result = this.modalRef.nativeElement.returnValue; // e.g., 'created'
  }


  protected readonly JSON = JSON;
  protected readonly String = String;
  protected readonly Object = Object;



}
