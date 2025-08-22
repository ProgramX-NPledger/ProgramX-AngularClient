import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

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
        path: 'update-profile',
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
