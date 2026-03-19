import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'admin',
        component: MainLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'ADMIN' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/admin/users/users.component').then(m => m.UsersComponent)
            },
            {
                path: 'leaves',
                loadComponent: () => import('./pages/admin/leaves/leaves.component').then(m => m.AdminLeavesComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/admin/settings/settings.component').then(m => m.SettingsComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'employee',
        component: MainLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'EMPLOYEE' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/employee/dashboard/dashboard.component').then(m => m.EmployeeDashboardComponent)
            },
            {
                path: 'apply-leave',
                loadComponent: () => import('./pages/employee/apply-leave/apply-leave.component').then(m => m.ApplyLeaveComponent)
            },
            {
                path: 'my-leaves',
                loadComponent: () => import('./pages/employee/my-leaves/my-leaves.component').then(m => m.MyLeavesComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'manager',
        component: MainLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'MANAGER' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/manager/dashboard/dashboard.component').then(m => m.ManagerDashboardComponent)
            },
            {
                path: 'leave-requests',
                loadComponent: () => import('./pages/manager/leave-requests/leave-requests.component').then(m => m.LeaveRequestsComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
