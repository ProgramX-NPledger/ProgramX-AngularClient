import {Component, ElementRef, EventEmitter, inject, Output, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {RolesService} from '../../services/roles-service.service';
import {UsersService} from '../../services/users-service.service';
import {userNameExistsValidator} from '../../validators/username-exists.validator';
import {Role} from '../../models/role';
import {SecureUser} from '../../models/secure-user';
import {UpdateUserResponse} from '../../models/update-user-response';

@Component({
  selector: 'app-edit-user-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent {
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
  roleNamesDefinedInUserAndNotInRoles: string[] = [];

  form = this.formBuilder.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    emailAddress: ['', [Validators.required, Validators.email]],
    roles: this.formBuilder.array<FormGroup>([])
  });

  get formControls() {
    return this.form.controls;
  }

  createRoleFormsGroup(role: Role) {
    return this.formBuilder.nonNullable.group({
      isSelected: false,
      name: role.roleName,
      description: role.description,
    })
  }

  async loadRoles(): Promise<void> {
    this.isLoadingRoles.set(true);
    this.isBusy.set(true);
    this.isErrorLoadingRoles.set(false);
    try {
      try {
        const roles = await firstValueFrom(this.rolesService.getRoles(null, null));
        for (const role of roles.items) {
          this.form.controls.roles.push(this.createRoleFormsGroup({
            roleName: role.roleName,
            description: role.description,
            usedInApplications: []
          }));
        }
      } catch (error: any) {
        this.isErrorLoadingRoles.set(true);
        this.errorMessageLoadingRoles.set(error.message);
      }
    } finally {
      this.isLoadingRoles.set(false);
      this.isBusy.set(false);
    }
  }

  async open(user: SecureUser): Promise<void> {
    this.form.reset();
    this.form.controls.roles.clear();
    await this.loadRoles();
    this.modalRef.nativeElement.showModal();
    this.form.patchValue({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
    this.roleNamesDefinedInUserAndNotInRoles = [];
    for (const roleName of user.roles) {
      let roleIsDefined = false;
      for (const roleOnForm of this.form.controls.roles.controls) {
        if (roleName === roleOnForm.value.name) {
          roleIsDefined = true;
          roleOnForm.patchValue({isSelected: true});
          break;
        }
      }
      if (!roleIsDefined) {
        this.roleNamesDefinedInUserAndNotInRoles.push(roleName);
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
      this.usersService.updateUser(this.formControls.userName.value, {
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
