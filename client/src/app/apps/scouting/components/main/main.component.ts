import { Component } from '@angular/core';
import {ApplicationsComponent} from "../../../admin/applications/applications.component";
import {RolesComponent} from "../../../admin/roles/roles.component";
import {UsersComponent} from "../../../admin/users/users.component";
import {ScoresLedgerComponent} from '../scores-ledger/scores-ledger.component';
import {ActivitiesComponent} from '../activities/activities.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: false,
})
export class MainComponent {

}
