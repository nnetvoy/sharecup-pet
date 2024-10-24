import {Routes} from "@angular/router";

export const authorizationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.component')
      .then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component')
      .then(c => c.RegisterComponent)
  },
]
