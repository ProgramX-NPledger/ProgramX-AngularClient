import {Component, ElementRef, EventEmitter, inject, OnInit, Output, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CreateUserResponse} from '../model/create-user-response';
import {RolesService} from '../services/roles-service.service';
import {UsersService} from '../services/users-service.service';
import {userNameExistsValidator} from '../validators/username-exists.validator';
import {Role} from '../model/role';
import {User} from '../../../model/user';
import {Application} from '../model/application';
import {ApplicationsService} from '../services/applications-service.service';
import {CreateRoleResponse} from '../model/create-role-response';
import {SecureUser} from '../model/secure-user';

@Component({
  selector: 'app-create-role-dialog',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './create-role-dialog.component.html',
  styleUrl: './create-role-dialog.component.css',
  standalone: true,
})
export class CreateRoleDialogComponent implements OnInit {
  ngOnInit(): void {
    // get all roles
    this.loadUsers();
    this.loadApplications();
  }


  @ViewChild('modal', { static: true }) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() created = new EventEmitter<CreateRoleResponse>();

  private formBuilder = inject(FormBuilder);
  private rolesService = inject(RolesService);
  private usersService = inject(UsersService);
  private applicationsService = inject(ApplicationsService);

  isBusy = signal(false);
  isCreating = signal(false);
  isLoadingUsers = signal(false);
  isLoadingApplications = signal(false);
  isErrorLoadingUsers = signal(false);
  isErrorLoadingApplications = signal(false);
  errorMessageLoadingUsers = signal<string | undefined>(undefined);
  errorMessageLoadingApplications = signal<string | undefined>(undefined);

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    users: this.formBuilder.array<FormGroup>([]),
    applications: this.formBuilder.array<FormGroup>([]),
  });

  get formControls() {
    return this.form.controls;
  }

  createUserFormsGroup(user: SecureUser) {
    return this.formBuilder.nonNullable.group({
      isSelected: false,
      name: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
    })
  }

  createApplicationFormsGroup(application: Application) {
    return this.formBuilder.nonNullable.group({
      isSelected: false,
      name: application.name,
      description: application.description,
    })
  }

  loadUsers() {
    this.isLoadingUsers.set(true);
    this.isLoadingApplications.set(true);
    this.isBusy.set(true);
    this.isErrorLoadingUsers.set(false);
    this.usersService.getUsers(null,null).subscribe(
      {
        next: users => {
          this.isLoadingUsers.set(false);
          this.isBusy.set(false);
          for (const user of users.items) {
            this.form.controls.users.push(this.createUserFormsGroup({
              userName:user.userName,
              firstName: user.firstName,
              lastName: user.lastName,
              type:user.type,
              id: user.id,
              emailAddress: user.emailAddress,
              roles: user.roles,
              versionNumber: user.versionNumber,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              lastLoginAt: user.lastLoginAt,
              lastPasswordChangedAt: user.lastPasswordChangedAt,
              passwordLinkExpiresAt: user.passwordLinkExpiresAt
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


  loadApplications() {
    this.isLoadingUsers.set(true);
    this.isLoadingApplications.set(true);
    this.isBusy.set(true);
    this.isErrorLoadingApplications.set(false);
    this.applicationsService.getApplications().subscribe(
      {
        next: applications => {
          this.isLoadingApplications.set(false);
          this.isBusy.set(false);
          for (const application of applications.items) {
            this.form.controls.users.push(this.createApplicationFormsGroup({
              name: application.name,
              description: application.description,
              versionNumber:application.versionNumber,
              type:application.type,
              imageUrl: application.imageUrl,
              ordinal: application.ordinal,
              targetUrl: application.targetUrl,
              isDefaultApplicationOnLogin: application.isDefaultApplicationOnLogin
            }));
          }
        },
        error: error => {
          this.isLoadingApplications.set(false);
          this.isBusy.set(false);
          this.isErrorLoadingApplications.set(true);
          this.errorMessageLoadingApplications.set(error.message);
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
      this.rolesService.createRole({
        name: this.formControls.name.value,
        description: this.formControls.name.value,
        addToApplications: [],
        addToUsers: []
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
          console.error('Error creating role:', error);
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

