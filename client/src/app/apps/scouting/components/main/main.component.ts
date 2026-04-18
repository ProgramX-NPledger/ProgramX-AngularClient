import {Component, signal, inject, OnInit} from '@angular/core';
import {ApplicationsComponent} from "../../../admin/applications/applications.component";
import {RolesComponent} from "../../../admin/roles/roles.component";
import {UsersComponent} from "../../../admin/users/users.component";
import {ScoresLedgerComponent} from '../scores-ledger/scores-ledger.component';
import {ActivitiesComponent} from '../activities/activities.component';
import {UsersService} from '../../../admin/services/users-service.service';
import {OsmService} from '../../services/osm-service.service';
import { ActivatedRoute } from '@angular/router';
import {Term} from '../../models/term';
import {GetTermsResponse} from '../../models/get-terms-response';
import {GetMembersResponse} from '../../models/get-members-response';
import {Member} from '../../models/member';
import {ScoutingService} from '../../services/scouting.service';
import {GetScoutingScoresResponse} from '../../models/get-scouting-scores-response';
import {ScoutingScore} from '../../models/scouting-score';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})

export class MainComponent implements OnInit {

  isAuthenticatedWithOsm = signal(false);

  allTerms: Term[] = [];
  selectedTerm: Term | null = null;
  allMembers: Member[] = [];

  isLoadingWithinTerm = signal(false);
  isLoadingAllTerms = signal(false);
  isErrorGettingMembers = signal(false);

  private osmService = inject(OsmService);

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.populateTerms();
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
  //
  // authenticateWithOsm() {
  //   this.osmService.getOsmKeyInitiation().subscribe(osmKeyInitiationResponse => {
  //     if (osmKeyInitiationResponse) {
  //       const popup = window.open(osmKeyInitiationResponse, 'osmLogin', 'width=600,height=700');
  //       if (!popup) {
  //         console.error('Popup blocked');
  //         return;
  //       }
  //
  //       const handleMessage = (event: MessageEvent) => {
  //         // Make sure this matches your backend/frontend origin
  //         if (event.origin !== window.location.origin) {
  //           return;
  //         }
  //
  //         console.log('Login result from popup:', event.data);
  //
  //         window.removeEventListener('message', handleMessage);
  //         popup.close();
  //
  //         // Use the returned data here
  //         // this.someSignal.set(event.data);
  //       };
  //       window.addEventListener('message', handleMessage);
  //     }
  //   })
  // }
}
