import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import {ConfirmPasswordComponent} from './confirm-password/confirm-password.component';

export const routes: Routes = [
    {
        path: '', // default
        component: HomeComponent
    },
    // need to dynamically add routes to other modules as apps
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
      path: 'confirm-password',
      component: ConfirmPasswordComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'update-profile/:id',
        component: UpdateProfileComponent
    },
    {
        path: 'admin',
        loadChildren: () => import('./apps/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard], // Ensure this route is protected
    },
    {
        path: '**',
        component: HomeComponent,
        data: {
            error: 404
        }
    }
];
