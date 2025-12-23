import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management/management.component';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from "./users/users.component";
import {CreateUserDialogComponent} from './create-user-dialog/create-user-dialog.component';
import {RolesComponent} from "./roles/roles.component";

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
        RolesComponent,
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
