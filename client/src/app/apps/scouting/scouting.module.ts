import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {ActivitiesComponent} from './components/activities/activities.component';
import {ScoresLedgerComponent} from './components/scores-ledger/scores-ledger.component';
import {
  CreateScoreLedgerItemDialogComponent
} from './components/create-scoreledger-item-dialog/create-scoreledger-item-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
]

@NgModule({
  bootstrap: [ MainComponent ],
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ActivitiesComponent,
    ScoresLedgerComponent,
    CreateScoreLedgerItemDialogComponent
  ],
  providers: [],
  exports: [

  ]
})

export class ScoutingModule {
  constructor() {
    console.log('Scouting module loaded');
  }
}
