import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Role} from '../model/role';
import {RolesService} from '../services/roles-service.service';
import {userNameExistsValidator} from '../validators/username-exists.validator';
import {UsersService} from '../services/users-service.service';
import {Router} from '@angular/router';
import {CreateUserResponse} from '../model/create-user-response';
import {SelectableRole} from '../model/selectable-role';

@Component({
  selector: 'app-create-user-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.css'
})
export class CreateUserDialogComponent implements OnInit {
  ngOnInit(): void {
    // get all roles
    this.loadRoles();
  }


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
    this.rolesService.getRoles().subscribe(
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


  open(): void {
    this.form.reset();
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
