import {Routes} from "@angular/router";

export const cabinetRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/profile/profile.component')
      .then(c => c.ProfileComponent)
  },
  {
    path: 'edit',
    loadComponent: () => import('./pages/edit-profile/edit-profile.component')
      .then(c => c.EditProfileComponent)
  },
  {
    path: 'subscription',
    loadComponent: () => import('./pages/subscription/subscription.component')
      .then(c => c.SubscriptionComponent)
  }
]
