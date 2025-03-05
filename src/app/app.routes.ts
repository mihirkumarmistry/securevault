import { Routes } from '@angular/router';
import { UnauthorizedComponent } from '@web/other/unauthorized/unauthorized.component';
import { GuestComponent } from '@layouts/guest/guest.component';
import { UserLayoutComponent } from '@layouts/user-layout/user-layout.component';
import { AppRoutes } from '@shared/routes/routes.model';

const appRoutes = AppRoutes;

export const routes: Routes = [
    {
      path: '',
      component: UserLayoutComponent,
      children: [
        {
          path: '',
          redirectTo: `/${appRoutes.Dashboard}`,
          pathMatch: 'full'
        },

        // general
        {
          path: appRoutes.Dashboard,
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
          path: appRoutes.Login,
          loadComponent: () => import('./authentication/login/login.component')
        },
        {
          path: appRoutes.Register,
          loadComponent: () => import('./authentication/register/register.component')
        }
      ]
    },
    {
      path: appRoutes.Unauthorized,
      component: UnauthorizedComponent
    }
  ];
