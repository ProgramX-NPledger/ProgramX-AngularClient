import {Component, ElementRef, EventEmitter, inject, Output, signal, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UsersService} from '../services/users-service.service';
import {concatMap, delay, of, range} from 'rxjs';
import {DeletionCompleteEvent} from '../model/deletion-complete-event';

@Component({
  selector: 'app-delete-users-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './delete-users-dialog.component.html',
  styleUrl: './delete-users-dialog.component.css',
  standalone: true,
})
export class DeleteUsersDialogComponent {
  @ViewChild('modal', {static: true}) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() deletionComplete = new EventEmitter<DeletionCompleteEvent>();

  usersToDelete:string[] = [];
  usersSuccessfullyDeleted:string[] = [];
  usersFailedToDelete:string[] = [];

  private formBuilder = inject(FormBuilder);
  private usersService = inject(UsersService);

  isBusy = signal(false);
  isDeleting = signal(false);

  form = this.formBuilder.nonNullable.group({
  });

  get formControls() {
    return this.form.controls;
  }

  open(idsToDelete:string[]): void {
    this.usersToDelete = idsToDelete;
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
      of(...this.usersToDelete).pipe(
        concatMap(id => of(id)
          .pipe(
            delay(1000)
          ))
      ).subscribe({
        next: (id) => {
          this.usersService.deleteUser(id).subscribe({
            next: (response) => {
              this.usersSuccessfullyDeleted.push(id);

              this.closeWindowOnCompletion();
            },
            error: (error) => {
              this.usersFailedToDelete.push(id);

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
    if (this.usersFailedToDelete.length + this.usersSuccessfullyDeleted.length === this.usersToDelete.length) {
      this.isBusy.set(false);
      this.isDeleting.set(false);
      this.deletionComplete.emit({
        usersToDelete: this.usersToDelete,
        usersFailedToDelete: this.usersFailedToDelete,
        usersSuccessfullyDeleted: this.usersSuccessfullyDeleted
      });
      this.close('deleted');
    }
  }
  onClosed(): void {
    const result = this.modalRef.nativeElement.returnValue; // e.g., 'created'
  }

}
