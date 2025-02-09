import { Routes } from '@angular/router';
import { GuestComponent } from './layouts/guest/guest.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { UnauthorizedComponent } from './web/other/unauthorized/unauthorized.component';

export const routes: Routes = [
    {
      path: '',
      component: UserLayoutComponent,
      children: [
        {
          path: '',
          redirectTo: '/dashboard',
          pathMatch: 'full'
        },

        // general
        {
          path: 'dashboard',
          loadComponent: () => import('./web/dashboard/dashboard.component').then((c) => c.DefaultComponent)
        },
        {
          path: 'sample-page',
          loadComponent: () => import('./web/other/sample-page/sample-page.component')
        },
      ]
    },
    {
      path: '',
      component: GuestComponent,
      children: [
        {
          path: 'login',
          loadComponent: () => import('./authentication/login/login.component')
        }
      ]
    },
    {
      path: 'unauthorized',
      component: UnauthorizedComponent
    }
  ];
