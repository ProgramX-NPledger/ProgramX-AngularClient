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

  private osmService = inject(OsmService);

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.populateTerms();
  }

  populateTerms() {
    this.osmService.getTerms().subscribe({
      next: (getTermsResponse: GetTermsResponse) => {
        this.allTerms = getTermsResponse.items;
        this.selectedTerm = this.allTerms.find(term => term.isCurrent) || this.allTerms[this.allTerms.length - 1];
        console.log('Terms:', this.allTerms);
        console.log('Selected Term:', this.selectedTerm);
      },
      error: (error) => {
        console.error('Error fetching terms:', error);
      }
    })
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
