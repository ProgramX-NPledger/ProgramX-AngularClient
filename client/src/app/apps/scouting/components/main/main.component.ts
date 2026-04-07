import { Component, signal, inject } from '@angular/core';
import {ApplicationsComponent} from "../../../admin/applications/applications.component";
import {RolesComponent} from "../../../admin/roles/roles.component";
import {UsersComponent} from "../../../admin/users/users.component";
import {ScoresLedgerComponent} from '../scores-ledger/scores-ledger.component';
import {ActivitiesComponent} from '../activities/activities.component';
import {UsersService} from '../../../admin/services/users-service.service';
import {OsmService} from '../../services/osm-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})

export class MainComponent {
  isAuthenticatedWithOsm = signal(false);

  private osmService = inject(OsmService);

  authenticateWithOsm() {
    this.osmService.getOsmKeyInitiation().subscribe(osmKeyInitiationResponse => {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (osmKeyInitiationResponse) {
        console.log('Received OSM key initiation response:', osmKeyInitiationResponse);
        iframe.src = osmKeyInitiationResponse; // TODO: doesn't load in IFrAME
        this.isAuthenticatedWithOsm.set(true);

      }

    });
  }
}
