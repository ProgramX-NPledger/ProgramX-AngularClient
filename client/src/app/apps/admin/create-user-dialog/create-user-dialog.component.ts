import {Component, ElementRef, EventEmitter, inject, OnInit, Output, signal, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Role} from '../model/role';
import {RolesService} from '../services/roles-service.service';
import {userNameExistsValidator} from '../validators/username-exists.validator';
import {UsersService} from '../services/users-service.service';
import {Router} from '@angular/router';
import {CreateUserResponse} from '../model/create-user-response';

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
    console.log('CreateUserDialogComponent.ngOnInit');
    // get all roles
    this.loadRoles();
  }


  @ViewChild('modal', { static: true }) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() created = new EventEmitter<CreateUserResponse>();

  private formBuilder = inject(FormBuilder);
  private rolesService = inject(RolesService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  isBusy = signal(false);
  isCreating = signal(false);
  roles : Role[] = [];
  isLoadingRoles = signal(false);
  isErrorLoadingRoles = signal(false);
  errorMessageLoadingRoles = signal<string | undefined>(undefined);

  form = this.formBuilder.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    emailAddress: ['', [Validators.required, Validators.email]],
    confirmationExpiry: ['', [Validators.required]],
  });

  get formControls() {
    return this.form.controls;
  }

  loadRoles() {
    console.log('loadRoles');
    this.isLoadingRoles.set(true);
    this.isBusy.set(true);
    this.isErrorLoadingRoles.set(false);
    this.rolesService.getRoles().subscribe(
      {
        next: roles => {
          this.isLoadingRoles.set(false);
          this.isBusy.set(false);
          this.roles=roles.items;
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
    this.form.reset(); // optional: reset when opened
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
        addToRoles: [],
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
      // TODO: call your service to create entity
      // await this.entityService.create(this.form.value).toPromise();

    } finally {
      this.isBusy.set(false);
    }


  }

  onClosed(): void {
    const result = this.modalRef.nativeElement.returnValue; // e.g., 'created'
    // You can use this if needed
  }






}
