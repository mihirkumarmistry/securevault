import { Routes } from '@angular/router';
import { UnauthorizedComponent } from '@web/other/unauthorized/unauthorized.component';
import { GuestComponent } from '@layouts/guest/guest.component';
import { UserLayoutComponent } from '@layouts/user-layout/user-layout.component';
import { AppRoutes } from '@shared/routes/routes.model';
import { AuthGuard } from '@core/guards/auth.guard';

const appRoutes = AppRoutes;

export enum SystemUserType
{
  User = "USER",
  Admin = "ADMIN",
  Master = "MASTER"
}

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
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.User, SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/dashboard/dashboard.component').then((c) => c.DefaultComponent)
        },
        {
          path: appRoutes.Files,
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.User, SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/files/files.component').then((c) => c.FilesComponent)
        },
        {
          path: appRoutes.SharedWithMe,
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.User, SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/shared-with-me/shared-with-me.component').then((c) => c.SharedWithMeComponent)
        },
        {
          path: appRoutes.Bin,
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.User, SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/bin/bin.component').then((c) => c.BinComponent)
        },
        
        // admin
        {
          path: appRoutes.User,
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/user/user.component').then((c) => c.UserComponent)
        },
        {
          path: appRoutes.Audit,
          canActivate: [AuthGuard],
          data: { allowedUserTypes: [SystemUserType.Admin, SystemUserType.Master] },
          loadComponent: () => import('./web/audit/audit.component').then((c) => c.AuditComponent)
        },

        // other
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
