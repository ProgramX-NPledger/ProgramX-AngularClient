import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management/management.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', 
    component: ManagementComponent
  }
]

@NgModule({
  bootstrap: [ ManagementComponent ],
  declarations: [
    ManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  exports: [
    
  ]
})

export class AdminModule {
  constructor() {
    console.log('AdminModule loaded');
  }
}
