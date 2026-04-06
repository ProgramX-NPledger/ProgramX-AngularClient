import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {ActivitiesComponent} from './components/activities/activities.component';
import {ScoresLedgerComponent} from './components/scores-ledger/scores-ledger.component';

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
    ScoresLedgerComponent
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
