import {Component, ElementRef, EventEmitter, inject, Output, signal, ViewChild} from '@angular/core';
import {RoleDeletionCompleteEvent} from '../model/role-deletion-complete-event';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {UsersService} from '../services/users-service.service';
import {RolesService} from '../services/roles-service.service';
import {concatMap, delay, of} from 'rxjs';

@Component({
  selector: 'app-delete-roles-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './delete-roles-dialog.component.html',
  styleUrl: './delete-roles-dialog.component.css',
  standalone: true,

})
export class DeleteRolesDialogComponent {
  @ViewChild('modal', {static: true}) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() deletionComplete = new EventEmitter<RoleDeletionCompleteEvent>();

  rolesToDelete:string[] = [];
  rolesSuccessfullyDeleted:string[] = [];
  rolesFailedToDelete:string[] = [];

  private formBuilder = inject(FormBuilder);
  private rolesService = inject(RolesService);

  isBusy = signal(false);
  isDeleting = signal(false);

  form = this.formBuilder.nonNullable.group({
  });

  get formControls() {
    return this.form.controls;
  }

  open(idsToDelete:string[]): void {
    this.rolesToDelete = idsToDelete;
    this.modalRef.nativeElement.showModal();
  }

  close(result?: string): void {
    this.modalRef.nativeElement.close(result);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.isBusy.set(true);
    this.isDeleting.set(true);
    try {
      of(...this.rolesToDelete).pipe(
        concatMap(id => of(id)
          .pipe(
            delay(1000)
          ))
      ).subscribe({
        next: (id) => {
          this.rolesService.deleteRole(id).subscribe({
            next: (response) => {
              this.rolesSuccessfullyDeleted.push(id);

              this.closeWindowOnCompletion();
            },
            error: (error) => {
              this.rolesFailedToDelete.push(id);

              this.closeWindowOnCompletion();
            }
          })
        },
        error: (error) => {
        }
      })
    } finally {


    }
  }


  closeWindowOnCompletion() {
    if (this.rolesFailedToDelete.length + this.rolesSuccessfullyDeleted.length === this.rolesToDelete.length) {
      this.isBusy.set(false);
      this.isDeleting.set(false);
      this.deletionComplete.emit({
        rolesToDelete: this.rolesToDelete,
        rolesFailedToDelete: this.rolesFailedToDelete,
        rolesSuccessfullyDeleted: this.rolesSuccessfullyDeleted
      });
      this.close('deleted');
    }
  }

  onClosed(): void {
    const result = this.modalRef.nativeElement.returnValue; // e.g., 'created'
  }
}
