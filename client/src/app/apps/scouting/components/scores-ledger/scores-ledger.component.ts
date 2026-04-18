import {Component, inject, signal, WritableSignal, ViewChild, Input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CreateUserDialogComponent} from '../../../admin/create-user-dialog/create-user-dialog.component';
import {DeleteUsersDialogComponent} from '../../../admin/delete-users-dialog/delete-users-dialog.component';
import {EditUserDialogComponent} from '../../../admin/edit-user-dialog/edit-user-dialog.component';
import {PaginatorComponent} from '../../../../paginator/paginator.component';
import {
  CreateScoreLedgerItemDialogComponent
} from '../create-scoreledger-item-dialog/create-scoreledger-item-dialog.component';
import {CreateUserResponse} from '../../../admin/model/create-user-response';
import {CreateScoreLedgerItemResponse} from '../../models/create-score-ledger-item-response';
import {Member} from '../../models/member';
import {GetTermsResponse} from '../../models/get-terms-response';
import {GetScoutingScoresResponse} from '../../models/get-scouting-scores-response';
import {ScoutingScore} from '../../models/scouting-score';
import {OsmService} from '../../services/osm-service.service';
import {ScoutingService} from '../../services/scouting.service';

@Component({
  selector: 'app-scores-ledger',
  imports: [
    CreateUserDialogComponent,
    DeleteUsersDialogComponent,
    EditUserDialogComponent,
    PaginatorComponent,
    ReactiveFormsModule,
    CreateScoreLedgerItemDialogComponent
  ],
  templateUrl: './scores-ledger.component.html',
  styleUrl: './scores-ledger.component.css'
})

export class ScoresLedgerComponent implements OnInit {
  @ViewChild(CreateScoreLedgerItemDialogComponent) createScoreLedgerItemDialog!: CreateScoreLedgerItemDialogComponent;
  @Input() scouts: Member[] | undefined;

  private formBuilder = inject(FormBuilder);
  allScoutingScores: ScoutingScore[] = [];
  errorMessage: string | null = null;
  isLoadingScoutingScores = signal(false);

  private scoutingService = inject(ScoutingService);

  isScoreLedgerItemCreated : WritableSignal<CreateScoreLedgerItemResponse | null>= signal(null);

  ngOnInit(): void {
    this.populateScoutingScores();
  }

  filterForm = this.formBuilder.group({
    containingText: <string | null> null,

  })

  populateScoutingScores() {
    this.isLoadingScoutingScores.set(true);
    this.scoutingService.getScoutingScores().subscribe({
      next: (getScoutingScoresResponse: GetScoutingScoresResponse) => {
        this.isLoadingScoutingScores.set(false);
        this.allScoutingScores = getScoutingScoresResponse.items;
      },
      error: (error) => {
        this.isLoadingScoutingScores.set(false);
        console.error('Error fetching scouting scores:', error);
      }
    })
  }



  refreshScoresLedger() {
    //this.users=null;
    // this.pagedUsers = undefined;
    // this.usersService.getUsers({
    //   // TODO: filtering should be moved to url
    //   containingText: this.filterForm.controls.containingText.value,
    //   hasRole: this.filterForm.controls.hasRole.value,
    //   hasApplication: this.filterForm.controls.hasApplication.value,
    // },{
    //   offset: this.activatedRoute.snapshot.queryParams['offset'] ? parseInt(this.activatedRoute.snapshot.queryParams['offset']) : 0,
    //   itemsPerPage: this.activatedRoute.snapshot.queryParams['itemsPerPage'] ? parseInt(this.activatedRoute.snapshot.queryParams['itemsPerPage']) : 5,
    // }).pipe(
    //   catchError(error => {
    //     this.errorMessage = error.message;
    //     console.error('Error fetching users:', error);
    //     return EMPTY;
    //   })
    // ).subscribe(pagedData => {
    //   this.pagedUsers = pagedData;
    // });
  }

  openCreateScoreLedgerItemDialog() {
    // if (this.termId) {
    //   this.createScoreLedgerItemDialog.termId = WritableSignal<number | undefined>(this.termId);
    // }
    this.createScoreLedgerItemDialog.open();
  }

  onScoreLedgerItemCreated(createScoreLedgerItemResponse: CreateScoreLedgerItemResponse): void {
    // Refresh list, toast, etc.
    this.isScoreLedgerItemCreated.set(createScoreLedgerItemResponse);
    this.refreshScoresLedger();
    setTimeout(() => {
      this.isScoreLedgerItemCreated.set(null);
    },5000)
  }

}
