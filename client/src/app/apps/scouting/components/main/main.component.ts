import {Component, signal, inject, OnInit} from '@angular/core';
import {OsmService} from '../../services/osm-service.service';
import { ActivatedRoute } from '@angular/router';
import {Term} from '../../models/term';
import {GetTermsResponse} from '../../models/get-terms-response';
import {GetMembersResponse} from '../../models/get-members-response';
import {Member} from '../../models/member';
import {ScoutingService} from '../../services/scouting.service';
import {GetScoresDefinedStatusResponse} from '../../models/get-scores-defined-status-response';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})

export class MainComponent implements OnInit {

  allTerms: Term[] = [];
  selectedTerm: Term | null = null;
  allMembers: Member[] = [];

  isLoadingWithinTerm = signal(false);
  isLoadingAllTerms = signal(false);
  isErrorGettingMembers = signal(false);
  isCheckingAllScoresDefined = signal(false);
  hasAllScoresDefined = signal(true);
  isErrorCheckingAllScoresDefined = signal(false);
  missingScores: string[] = [];
  isFixingAllScoresDefined = signal(false);

  private osmService = inject(OsmService);
  private scoutingService = inject(ScoutingService);

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.populateTerms();
    this.verifyAllScoresDefined();
  }



  populateTerms() {
    this.isLoadingAllTerms.set(true);
    this.osmService.getTerms().subscribe({
      next: (getTermsResponse: GetTermsResponse) => {
        this.isLoadingAllTerms.set(false);
        this.allTerms = getTermsResponse.items;
        this.selectedTerm = this.allTerms.find(term => term.isCurrent) || this.allTerms[this.allTerms.length - 1];
        // populate within the term
        this.populateWithinTerm();
      },
      error: (error) => {
        this.isLoadingAllTerms.set(false);
        console.error('Error fetching terms:', error);
      }
    })
  }

  private populateWithinTerm() {
    if (!this.selectedTerm) return;
    this.populateMembers(this.selectedTerm.osmTermId);
  }

  onTermChange($event: Event) {
    const select = $event.target as HTMLSelectElement;
    const selectedValue = select.value;
    const matchingTerm = this.allTerms.find(term => term.osmTermId === +selectedValue);
    if (matchingTerm) {
      this.selectedTerm = matchingTerm;
      this.populateWithinTerm();
    }
  }

  populateMembers(osmTermId: number) {
    this.isErrorGettingMembers.set(false);
    this.isLoadingWithinTerm.set(true);
    this.osmService.getMembers(osmTermId).subscribe({
      next: (getMembersResponse: GetMembersResponse) => {
        this.isLoadingWithinTerm.set(false);
        this.allMembers = getMembersResponse.items;
      },
      error: (error) => {
        this.isLoadingWithinTerm.set(false);
        this.isErrorGettingMembers.set(true);
        console.error('Error fetching members:', error);
      }
    })
  }

  getScoutMembers() {
    if (!this.allMembers) return [];
    return this.allMembers.filter(member => member.patrolName != 'Leaders');
  }

  verifyAllScoresDefined() {
    this.isCheckingAllScoresDefined.set(true);
    this.scoutingService.verifyAllScoresDefined().subscribe(
      {
        next: (response: GetScoresDefinedStatusResponse) => {
          this.isCheckingAllScoresDefined.set(false);
          if (response.hasAllScoresDefined) {
            this.hasAllScoresDefined.set(true);
          } else {
            this.hasAllScoresDefined.set(false)
            this.missingScores = response.missingScores.map(score => score.name);
          }
        },
        error: (error) => {
          this.isCheckingAllScoresDefined.set(false);
          this.isErrorCheckingAllScoresDefined.set(true);
          console.error('Error verifying scores defined:', error);
        }
      }
    )
  }


  showFixAllScoresDefinedDialog() {
    const fixScoreDefinitionsDialog = document.getElementById('fixScoreDefinitionsDialog') as HTMLDialogElement;
    fixScoreDefinitionsDialog.showModal();
  }

  hideFixAllScoresDefinedDialog() {
    const fixScoreDefinitionsDialog = document.getElementById('fixScoreDefinitionsDialog') as HTMLDialogElement;
    fixScoreDefinitionsDialog.close();
  }

  fixAllScoresDefined() {
    this.isFixingAllScoresDefined.set(true);

    this.scoutingService.fixAllScoresDefined().subscribe({
      next: response => {
        this.isFixingAllScoresDefined.set(false);
        this.hasAllScoresDefined.set(true);
        this.hideFixAllScoresDefinedDialog();
        this.verifyAllScoresDefined();
      },
      error: (error) => {
        this.isFixingAllScoresDefined.set(false);
        this.hasAllScoresDefined.set(true);
        this.hideFixAllScoresDefinedDialog();
        this.verifyAllScoresDefined();
        console.error('Error fixing scores defined:', error);
      }
    })

  }


}
