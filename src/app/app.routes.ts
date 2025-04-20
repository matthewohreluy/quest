import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/ui/auth.component';
import { authRoutes } from './pages/auth/ui/auth.routing';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: ()=> import('./pages/auth/ui/auth.component').then(m=>AuthComponent),
    children: authRoutes
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
