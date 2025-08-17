import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '', // default
        component: HomeComponent
    },
    {
        path: '**',
        component: HomeComponent,
        data: {
            error: 404
        }
    }
];
