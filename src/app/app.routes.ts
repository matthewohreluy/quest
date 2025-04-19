import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { authRoutes } from './pages/auth/auth.routing';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: ()=> import('./pages/auth/auth.component').then(m=>AuthComponent),
    children: authRoutes
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
