import {Routes} from "@angular/router";

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/orders/orders.component')
      .then(c => c.OrdersComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component')
      .then(c => c.UsersComponent)
  }
]
