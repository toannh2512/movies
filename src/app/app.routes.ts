import { Routes } from '@angular/router';
import { MoviesComponent } from './components/movies/movies.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'movies' },
    {
        path: 'movies',
        component: MoviesComponent,
        children: [
            { path: ':id', loadComponent: () => import('./components/movies/detail/detail.component').then((m) => m.DetailComponent) }
        ],
    },
    { path: '**', redirectTo: 'movies' }
];
