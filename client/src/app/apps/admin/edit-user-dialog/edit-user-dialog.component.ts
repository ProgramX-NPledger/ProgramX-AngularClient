import {Component, ElementRef, EventEmitter, inject, OnInit, Output, signal, ViewChild} from '@angular/core';
import {CreateUserResponse} from '../model/create-user-response';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RolesService} from '../services/roles-service.service';
import {UsersService} from '../services/users-service.service';
import {userNameExistsValidator} from '../validators/username-exists.validator';
import {Role} from '../model/role';
import {SecureUser} from '../model/secure-user';
import {UpdateUserResponse} from '../model/update-user-response';

@Component({
  selector: 'app-edit-user-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent implements OnInit {
  @ViewChild('modal', { static: true }) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() updated = new EventEmitter<UpdateUserResponse>();

  private formBuilder = inject(FormBuilder);
  private rolesService = inject(RolesService);
  private usersService = inject(UsersService);

  isBusy = signal(false);
  isUpdating = signal(false);
  isLoadingRoles = signal(false);
  isErrorLoadingRoles = signal(false);
  errorMessageLoadingRoles = signal<string | undefined>(undefined);

  form = this.formBuilder.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    emailAddress: ['', [Validators.required, Validators.email]],
    roles: this.formBuilder.array<FormGroup>([])
  });

  ngOnInit(): void {
    this.loadRoles();
    }

  get formControls() {
    return this.form.controls;
  }

  createRoleFormsGroup(role: Role) {
    return this.formBuilder.nonNullable.group({
      isSelected: false,
      name: role.name,
      description: role.description,
      applications: this.formBuilder.nonNullable.array<FormGroup>(
        role.applications.map(app => this.formBuilder.nonNullable.group(
          {
            name: app.name
          })))
    })
  }

  loadRoles() {
    this.isLoadingRoles.set(true);
    this.isBusy.set(true);
    this.isErrorLoadingRoles.set(false);
    this.rolesService.getRoles(null,null).subscribe(
      {
        next: roles => {
          this.isLoadingRoles.set(false);
          this.isBusy.set(false);
          for (const role of roles.items) {
            this.form.controls.roles.push(this.createRoleFormsGroup({
              name:role.name,
              description:role.description,
              applications:role.applications,
              versionNumber:role.versionNumber,
              type:role.type
            }));
          }
        },
        error: error => {
          this.isLoadingRoles.set(false);
          this.isBusy.set(false);
          this.isErrorLoadingRoles.set(true);
          this.errorMessageLoadingRoles.set(error.message);
        }
      }
    );
  }

  open(user: SecureUser): void {
    this.form.reset();
    this.modalRef.nativeElement.showModal();
    this.form.patchValue({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
    for (const userInRole of user.roles) {
      for (const roleOnForm of this.form.controls.roles.controls) {
        if (userInRole.name === roleOnForm.value.name) {
          roleOnForm.patchValue({isSelected: true});
          break;
        }
      }
    }
    this.form.controls.userName.disable();
  }

  close(result?: string): void {
    this.modalRef.nativeElement.close(result);
  }


  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.isBusy.set(true);
    this.isUpdating.set(true);
    try {
      this.usersService.updateUser({
        updateRolesScope: true,
        updateProfileScope: true,
        userName: this.formControls.userName.value,
        roles: this.formControls.roles.controls.map(m=>m.value).filter(m=>m.isSelected).map(m=>m.name),
        emailAddress: this.formControls.emailAddress.value,
        firstName: this.formControls.firstName.value,
        lastName: this.formControls.lastName.value,
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
          console.error('Error creating user:', error);
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
