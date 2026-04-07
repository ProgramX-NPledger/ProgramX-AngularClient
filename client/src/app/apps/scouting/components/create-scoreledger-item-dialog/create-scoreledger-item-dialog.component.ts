import { Component, ViewChild, ElementRef, EventEmitter, Output, signal, inject, effect, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {CreateScoreLedgerItemResponse} from '../../models/create-score-ledger-item-response';
import {userNameExistsValidator} from '../../../admin/validators/username-exists.validator';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-scoreledger-item-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-scoreledger-item-dialog.component.html',
  styleUrl: './create-scoreledger-item-dialog.component.css'
})
export class CreateScoreLedgerItemDialogComponent implements OnInit {
  @ViewChild('modal', { static: true }) modalRef!: ElementRef<HTMLDialogElement>;
  @Output() created = new EventEmitter<CreateScoreLedgerItemResponse>();

  private formBuilder = inject(FormBuilder);
//  private rolesService = inject(RolesService);

  isBusy = signal(false);

  form = this.formBuilder.nonNullable.group({
    date: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
    scout: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    value: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    score: ['', [Validators.required, Validators.email]],
    notes: ['', [Validators.required]]
  });


  constructor(private router: Router) {
    effect(() => {
      if (this.isBusy()) {
        this.form.controls.date.disable( { emitEvent: false } );
        // this.form.controls.firstName.disable( { emitEvent: false } );
        // this.form.controls.lastName.disable( { emitEvent: false } );
        // this.form.controls.emailAddress.disable( { emitEvent: false } );
        // this.form.controls.confirmationExpiry.disable( { emitEvent: false } );
      } else {
        this.form.controls.date.enable( { emitEvent: false } );
        // this.form.controls.firstName.enable( { emitEvent: false } );
        // this.form.controls.lastName.enable( { emitEvent: false } );
        // this.form.controls.emailAddress.enable( { emitEvent: false } );
        // this.form.controls.confirmationExpiry.enable( { emitEvent: false } );
      }
    })
  }

  ngOnInit(): void {
    // TODO: get scoures from OSM
    // TODO: get values from API

  }

  get formControls() {
    return this.form.controls;
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
    try {
      // this.usersService.createUser({
      //   userName: this.formControls.userName.value,
      //   addToRoles: this.formControls.roles.controls.map(m=>m.value).filter(m=>m.isSelected).map(m=>m.name),
      //   emailAddress: this.formControls.emailAddress.value,
      //   firstName: this.formControls.firstName.value,
      //   lastName: this.formControls.lastName.value,
      //   passwordConfirmationLinkExpiryDate: new Date(this.formControls.confirmationExpiry.value)
      // }).subscribe({
      //   next: (response) => {
      //     this.isBusy.set(false);
      //     this.isCreating.set(false);
      //     this.created.emit(response as any);
      //     this.close('created');
      //   },
      //   error: (error) => {
      //     this.isBusy.set(false);
      //     this.isCreating.set(false);
      //     console.error('Error creating user:', error);
      //   }
      // })
    } finally {
      this.isBusy.set(false);
    }


  }

  onClosed(): void {
    const result = this.modalRef.nativeElement.returnValue; // e.g., 'created'
  }

  protected readonly String = String;
  protected readonly Object = Object;


}
