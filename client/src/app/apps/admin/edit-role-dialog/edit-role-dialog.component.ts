import {Component, ElementRef, EventEmitter, inject, Output, signal, ViewChild} from '@angular/core';
import {UpdateUserResponse} from '../model/update-user-response';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RolesService} from '../services/roles-service.service';
import {UsersService} from '../services/users-service.service';
import {userNameExistsValidator} from '../validators/username-exists.validator';
import {Role} from '../model/role';
import {User} from '../../../model/user';
import {SecureUser} from '../model/secure-user';
import {UpdateRoleResponse} from '../model/update-role-response';

@Component({
  selector: 'app-edit-role-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-role-dialog.component.html',
  styleUrl: './edit-role-dialog.component.css'
})
export class EditRoleDialogComponent {
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

  createUserFormsGroup(user: User) {
    return this.formBuilder.nonNullable.group({
      isSelected: false,
      name: user.userName
    })
  }


  loadUsers() {
    this.isLoadingUsers.set(true);
    this.isBusy.set(true);
    this.isErrorLoadingUsers.set(false);
    this.usersService.getUsers(null,null).subscribe(
      {
        next: users => {
          this.isLoadingUsers.set(false);
          this.isBusy.set(false);
          for (const user of users.items) {
            this.form.controls.users.push(this.createUserFormsGroup({
              applications: [],
              emailAddress: user.emailAddress,
              firstName: user.firstName,
              initials: '',
              lastName: user.lastName,
              profilePhotographSmall: '',
              roles: [],
              token: '',
              userName:user.userName
              // versionNumber:user.versionNumber,
              // type:user.type
            }));
          }
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
