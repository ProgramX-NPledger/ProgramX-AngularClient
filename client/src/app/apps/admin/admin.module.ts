import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ManagementComponent} from './components/management/management.component';
import {UsersComponent} from './components/users/users.component';
import {CreateUserDialogComponent} from './components/create-user-dialog/create-user-dialog.component';
import {RouterModule, Routes} from '@angular/router';
import {RolesComponent} from './components/roles/roles.component';

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
    UsersComponent,
    CreateUserDialogComponent,
    RolesComponent],
  providers: [],
  exports: [

  ]
})

export class AdminModule {
  constructor() {
    console.log('AdminModule loaded');
  }
}

