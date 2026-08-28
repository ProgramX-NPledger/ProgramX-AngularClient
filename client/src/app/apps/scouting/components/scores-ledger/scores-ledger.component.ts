import {Component, inject, signal, WritableSignal, ViewChild, Input, OnInit, input, effect} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  CreateScoreLedgerItemDialogComponent
} from '../create-scoreledger-item-dialog/create-scoreledger-item-dialog.component';
import {CreateScoreLedgerItemResponse} from '../../models/create-score-ledger-item-response';
import {Member} from '../../models/member';
import {GetScoutingScoresResponse} from '../../models/get-scouting-scores-response';
import {ScoutingScore} from '../../models/scouting-score';
import {ScoutingService} from '../../services/scouting.service';
import {ScoutingScoreItem} from '../../models/scouting-score-item';
import {PaginatorComponent} from '../../../../core/components/paginator/paginator.component';
import {PagedData} from '../../../../core/models/paged-data';
import {Term} from '../../models/term';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, EMPTY} from 'rxjs';

@Component({
  selector: 'app-scores-ledger',
  imports: [
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
  currentTerm = input<Term | null>(null);

  private scoutingService = inject(ScoutingService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  isScoreLedgerItemCreated : WritableSignal<CreateScoreLedgerItemResponse | null>= signal(null);

  private formBuilder = inject(FormBuilder);
  allScoutingScores: ScoutingScore[] = [];
  errorMessage: string | null = null;
  isLoadingScoutingScores = signal(false);
  isPopulatingGrid : WritableSignal<boolean>= signal(false);

  pagedScoutingScores: PagedData<ScoutingScoreItem> | undefined = {
    items : [],
    totalItems : 0,
    pagesWithUrls : [],
    itemsPerPage : 0,
    timeDeltaMs : 0,
    continuationToken : undefined,
    isLastPage : false,
    requestCharge : 0
  };

  filterForm = this.formBuilder.group({
    fromDate: [null as string | null],
    toDate: [null as string | null],
    member: [ null ],
    score: [ null ],
    patrol: [ null ]
  })

  constructor() {
    effect(() => {
      const term = this.currentTerm();
      this.filterForm.patchValue({
        fromDate: term?.startDate?.toString() ?? null,
        toDate: term?.endDate?.toString() ?? null
      });
      this.populateScoutingScores();
    });
  }

  ngOnInit(): void {
    this.populateScoutingScores();
    this.refreshScoresLedger();
  }


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
    this.allScoutingScores = [];
    this.pagedScoutingScores = undefined;
    this.isPopulatingGrid.set(true);
    this.scoutingService.getScoutingScoreLedgerItems({
      fromDate: this.filterForm.controls.fromDate.value,
      toDate: this.filterForm.controls.toDate.value,
      osmScoutId: this.filterForm.controls.member.value,
      scoreId: this.filterForm.controls.score.value,
    },{
        offset: this.activatedRoute.snapshot.queryParams['offset'] ? parseInt(this.activatedRoute.snapshot.queryParams['offset']) : 0,
        itemsPerPage: this.activatedRoute.snapshot.queryParams['itemsPerPage'] ? parseInt(this.activatedRoute.snapshot.queryParams['itemsPerPage']) : 5,
      }).pipe(
        catchError(error => {
          this.isPopulatingGrid.set(false);
          this.errorMessage = error.message;
          console.error('Error fetching Scouting Scores Ledger:', error);
          return EMPTY;
        })
      ).subscribe(pagedData => {
        this.isPopulatingGrid.set(false);
        this.pagedScoutingScores = pagedData;
      });
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
    console.log('onScoreLedgerItemCreated', createScoreLedgerItemResponse);

    this.isScoreLedgerItemCreated.set(createScoreLedgerItemResponse);
    this.refreshScoresLedger();
    setTimeout(() => {
      this.isScoreLedgerItemCreated.set(null);
    },5000)
  }

  clearFilters() {
    this.filterForm.reset();
    // this.selectedUsers.set([]);
    this.refreshScoresLedger();
  }


  onPageChange($event: number) {
    if (this.pagedScoutingScores) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          offset: ($event * this.pagedScoutingScores.itemsPerPage) - this.pagedScoutingScores.itemsPerPage,
          itemsPerPage: this.pagedScoutingScores.itemsPerPage
        },
        queryParamsHandling: 'merge'
      }).then(r => this.refreshScoresLedger());
    }
  }

}
