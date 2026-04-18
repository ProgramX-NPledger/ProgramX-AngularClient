import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  signal,
  inject,
  effect,
  OnInit,
  input, InputSignal
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {CreateScoreLedgerItemResponse} from '../../models/create-score-ledger-item-response';
import {userNameExistsValidator} from '../../../admin/validators/username-exists.validator';
import {Router} from '@angular/router';
import {OsmService} from '../../services/osm-service.service';
import {GetTermsResponse} from '../../models/get-terms-response';
import {Term} from '../../models/term';
import {Member} from '../../models/member';
import {GetMembersResponse} from '../../models/get-members-response';
import {ScoutingScore} from '../../models/scouting-score';
import {ScoutingService} from '../../services/scouting.service';

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
  @Input() scouts: Member[] | undefined;
  @Input() scoutingScores: ScoutingScore[] | undefined;

//  termId: InputSignal<number | undefined> = input<number | undefined>(undefined);

  selectedMember: Member | null = null;
  selectedScoutingScore: ScoutingScore | null = null;

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private osmService = inject(OsmService);
  private scoutingService = inject(ScoutingService);

//  private rolesService = inject(RolesService);

  isBusy = signal(false);

  form = this.formBuilder.nonNullable.group({
    date: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)],[userNameExistsValidator(300)]],
    member: ['', [Validators.required]],
    patrol: [
      { value: '',
        disabled: true,
        validators: [
          Validators.required
        ]
      }],
    scoutingScore: ['', [Validators.required]],
    score: ['', [Validators.required]],
    notes: ['', [Validators.maxLength(1024)]]
  });


  constructor() {
    effect((onCleanup) => {
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


  }

  onMemberChange($event: Event) {
    const select = $event.target as HTMLSelectElement;
    const selectedValue = select.value;
    if (this.scouts) {
      const matchingMember = this.scouts.find(member => member.osmScoutId === +selectedValue);
      if (matchingMember) {
        this.selectedMember = matchingMember;
        if (matchingMember.patrolName) {
          this.form.controls.patrol.setValue(matchingMember.patrolName);
        } else {
          this.form.controls.patrol.reset();
        }
        this.form.controls.patrol.disable();
      }
    }
  }


  onScoutingScoreChange($event: Event) {
    const select = $event.target as HTMLSelectElement;
    const selectedValue = select.value;
    if (this.scoutingScores) {
      const matchingScoutingScore = this.scoutingScores.find(scoutingScore => scoutingScore.id === selectedValue);
      if (matchingScoutingScore) {
        this.selectedScoutingScore = matchingScoutingScore;
        if (matchingScoutingScore.score) {
          this.form.controls.score.setValue(matchingScoutingScore.score.toString());
        } else {
          this.form.controls.score.reset();
        }
        this.form.controls.score.disable();
      }
    }
  }

  get formControls() {
    return this.form.controls;
  }


  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.isBusy.set(true);
    try {
      if (this.selectedMember && this.selectedScoutingScore) {
        this.scoutingService.createScoutingScoreItem({
          score: +this.formControls.score.value,
          notes: this.formControls.notes.value,
          date: new Date(this.formControls.date.value),
          osmPatrolId: this.selectedMember?.osmPatrolId ?? 0,
          scoreName: this.selectedScoutingScore.name ?? '',
          patrolName: this.selectedMember?.patrolName ?? '',
          osmScoutId: this.selectedMember?.osmScoutId ?? 0
        }).subscribe({
          next: (response) => {
            this.isBusy.set(false);
            this.created.emit(response as any);
            this.close('created');
          },
          error: (error) => {
            this.isBusy.set(false);
            console.error('Error creating Scouting Score Item:', error);
          }
        })
      }
    } finally {
      this.isBusy.set(false);
    }

  }

  open(): void {
    this.form.reset();
    this.modalRef.nativeElement.showModal();
  }

  close(result?: string): void {
    this.modalRef.nativeElement.close(result);
  }


  onClosed(): void {
    const result = this.modalRef.nativeElement.returnValue; // e.g., 'created'
  }

  protected readonly String = String;
  protected readonly Object = Object;


}
