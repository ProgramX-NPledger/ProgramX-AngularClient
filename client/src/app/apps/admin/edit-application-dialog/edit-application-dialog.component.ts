import {Component, ElementRef, EventEmitter, inject, Output, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UpdateRoleResponse} from '../model/update-role-response';
import {RolesService} from '../services/roles-service.service';
import {UsersService} from '../services/users-service.service';
import {ApplicationsService} from '../services/applications-service.service';
import {userNameExistsValidator} from '../validators/username-exists.validator';
import {Role} from '../model/role';
import {Application} from '../../../model/application';
import {UpdateApplicationResponse} from '../model/update-application-response';

@Component({
  selector: 'app-edit-application-dialog',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './edit-application-dialog.component.html',
  styleUrl: './edit-application-dialog.component.css'
})
export class EditApplicationDialogComponent {
  @ViewChild('modal', { static: true }) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() updated = new EventEmitter<UpdateApplicationResponse>();

  private formBuilder = inject(FormBuilder);
  private applicationsService = inject(ApplicationsService);

  isBusy = signal(false);
  isUpdating = signal(false);

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
  });

  get formControls() {
    return this.form.controls;
  }

  open(application: Application): void {
    this.form.reset();
    this.modalRef.nativeElement.showModal();
    this.form.patchValue({
      name: application.name
    });
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
      this.applicationsService.updateApplication({
        name: this.formControls.name.value,
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
          console.error('Error updating Application:', error);
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
