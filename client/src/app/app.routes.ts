import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './core/guards/auth.guard';

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
        path: 'admin',
        loadChildren: () => import('./apps/admin/admin.module').then(m => m.AdminModule),
        canActivate: [authGuard], // Ensure this route is protected
    
    },
    {
        path: '**',
        component: HomeComponent,
        data: {
            error: 404
        }
    }
];
