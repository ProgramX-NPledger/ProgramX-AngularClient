import {
  Component, effect,
  ElementRef,
  EventEmitter,
  inject,
  NO_ERRORS_SCHEMA,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';
import {Role} from '../../models/role';
import {RolesService} from '../../services/roles-service.service';
import {userNameExistsValidator} from '../../validators/username-exists.validator';
import {UsersService} from '../../services/users-service.service';
import {CreateUserResponse} from '../../models/create-user-response';

@Component({
  selector: 'app-create-user-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.css',
  standalone: true,
})
export class CreateUserDialogComponent {

  @ViewChild('modal', { static: true }) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() created = new EventEmitter<CreateUserResponse>();

  private formBuilder = inject(FormBuilder);
  private rolesService = inject(RolesService);
  private usersService = inject(UsersService);

  isBusy = signal(false);
  isCreating = signal(false);
  isLoadingRoles = signal(false);
  isErrorLoadingRoles = signal(false);
  errorMessageLoadingRoles = signal<string | undefined>(undefined);

  form = this.formBuilder.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    emailAddress: ['', [Validators.required, Validators.email]],
    confirmationExpiry: ['', [Validators.required]],
    roles: this.formBuilder.array<FormGroup>([])
  });

  constructor(private router: Router) {
    effect(() => {
      if (this.isBusy()) {
        this.form.controls.userName.disable( { emitEvent: false } );
        this.form.controls.firstName.disable( { emitEvent: false } );
        this.form.controls.lastName.disable( { emitEvent: false } );
        this.form.controls.emailAddress.disable( { emitEvent: false } );
        this.form.controls.confirmationExpiry.disable( { emitEvent: false } );
      } else {
        this.form.controls.userName.enable( { emitEvent: false } );
        this.form.controls.firstName.enable( { emitEvent: false } );
        this.form.controls.lastName.enable( { emitEvent: false } );
        this.form.controls.emailAddress.enable( { emitEvent: false } );
        this.form.controls.confirmationExpiry.enable( { emitEvent: false } );
      }
    })
  }

  get formControls() {
    return this.form.controls;
  }

  createRoleFormsGroup(role: Role) {
    return this.formBuilder.nonNullable.group({
      isSelected: false,
      name: role.roleName,
      description: role.description,
      // applications: this.formBuilder.nonNullable.array<FormGroup>(
      //   role.applications.map(app => this.formBuilder.nonNullable.group(
      //     {
      //       name: app.name
      //     })))
    })
  }

  async loadRoles(): Promise<void> {
    this.isLoadingRoles.set(true);
    this.isBusy.set(true);
    this.isErrorLoadingRoles.set(false);
    try {
      const roles = await firstValueFrom(this.rolesService.getRoles(null, null));
      for (const role of roles.items) {
        this.form.controls.roles.push(this.createRoleFormsGroup({
          roleName: role.roleName,
          description: role.description,
          // applications: role.applications,
          versionNumber: role.versionNumber,
          type: role.type
        }));
      }
    } catch (error: any) {
      this.isErrorLoadingRoles.set(true);
      this.errorMessageLoadingRoles.set(error.message);
    } finally {
      this.isLoadingRoles.set(false);
      this.isBusy.set(false);
    }
  }

  async open(): Promise<void> {
    this.form.reset();
    this.form.controls.roles.clear();
    await this.loadRoles();
    this.modalRef.nativeElement.showModal();
  }

  close(result?: string): void {
    this.modalRef.nativeElement.close(result);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.isBusy.set(true);
    this.isCreating.set(true);
    try {
      this.usersService.createUser({
        userName: this.formControls.userName.value,
        addToRoles: this.formControls.roles.controls.map(m=>m.value).filter(m=>m.isSelected).map(m=>m.name),
        emailAddress: this.formControls.emailAddress.value,
        firstName: this.formControls.firstName.value,
        lastName: this.formControls.lastName.value,
        passwordConfirmationLinkExpiryDate: new Date(this.formControls.confirmationExpiry.value)
      }).subscribe({
        next: (response) => {
          this.isBusy.set(false);
          this.isCreating.set(false);
          this.created.emit(response as any);
          this.close('created');
        },
        error: (error) => {
          this.isBusy.set(false);
          this.isCreating.set(false);
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
