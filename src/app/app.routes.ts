import { Routes } from '@angular/router';
import { MoviesComponent } from './components/movies/movies.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'movies' },
    {
        path: 'movies',
        component: MoviesComponent,
        children: [
            { path: 'detail', loadComponent: () => import('./components/movies/details/details.component').then((m) => m.DetailsComponent) }
        ],
    },
    { path: '**', redirectTo: 'movies' }
];
