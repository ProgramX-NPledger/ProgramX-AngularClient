import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management/management.component';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from "./users/users.component";

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
    RouterModule.forChild(routes),
    UsersComponent
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
