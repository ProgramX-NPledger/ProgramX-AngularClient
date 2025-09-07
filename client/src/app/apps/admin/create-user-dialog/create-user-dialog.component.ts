import {Component, ElementRef, EventEmitter, inject, OnInit, Output, signal, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Role} from '../model/role';
import {RolesService} from '../services/roles-service.service';
import {userNameExistsValidator} from '../validators/username-exists.validator';

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
  @Output() created = new EventEmitter<{ name: string; description?: string }>();

  private formBuilder = inject(FormBuilder);
  private rolesService = inject(RolesService);

  isBusy = signal(false);
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
    try {
      // TODO: call your service to create entity
      // await this.entityService.create(this.form.value).toPromise();

      this.created.emit(this.form.value as any);
      this.close('created');
    } finally {
      this.isBusy.set(false);
    }


  }

  onClosed(): void {
    const result = this.modalRef.nativeElement.returnValue; // e.g., 'created'
    // You can use this if needed
  }






}
