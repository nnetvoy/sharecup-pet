import { Routes } from '@angular/router';
import {isAuthorizatedGuard} from "./shared/guards/is-authorizated.guard";
import {isNotAuthorizatedGuard} from "./shared/guards/is-not-authorizated.guard";
import {isAdminGuard} from "./shared/guards/is-admin.guard";
import {isUserGuard} from "./shared/guards/is-user.guard";

export const routes: Routes = [
  {
    path: '',
    canActivate: [isNotAuthorizatedGuard],
    loadComponent: () => import('./static/pages/landing/landing.component')
      .then(c => c.LandingComponent)
  },
  {
    path: 'auth',
    canActivate: [isNotAuthorizatedGuard],
    loadChildren: () => import('./authorization/authorization.routes')
      .then(r => r.authorizationRoutes)
  },
  {
    path: 'cabinet',
    canActivate: [isAuthorizatedGuard, isUserGuard],
    loadChildren: () => import('./cabinet/cabinet.routes')
      .then(r => r.cabinetRoutes)
  },
  {
    path: 'admin',
    canActivate: [isAuthorizatedGuard, isAdminGuard],
    loadChildren: () => import('./admin/admin.routes')
      .then(r => r.adminRoutes)
  },
  {
    path: '**',
    loadComponent: () => import('./static/pages/not-found/not-found.component')
      .then(c => c.NotFoundComponent)
  }
];
