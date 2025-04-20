import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";


export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: ()=> import('./login/login.component').then(m=>LoginComponent),
  },
  {
    path: 'verify-email',
    loadComponent: ()=> import('./verify-email/verify-email.component').then(m=>VerifyEmailComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]
