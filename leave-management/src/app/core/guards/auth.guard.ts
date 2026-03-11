import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/hr.model';

/**
 * AuthGuard - Protects routes that require authentication
 * Checks if user is logged in and has a valid token
 * Redirects to /login if not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

/**
 * RoleGuard - Protects routes by role
 * Checks if user has the required role from route.data.role
 * Redirects to appropriate dashboard if wrong role
 */
export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRole = route.data['role'] as UserRole;

    const user = authService.getUser();
    if (user && user.role === expectedRole) {
        return true;
    }

    // Redirect to their own dashboard if they have the wrong role
    if (user) {
        const target = getDefaultDashboardByRole(user.role);
        router.navigate([target]);
    } else {
        router.navigate(['/login']);
    }

    return false;
};

/**
 * Helper function to get default dashboard URL by role
 */
function getDefaultDashboardByRole(role: UserRole): string {
    switch (role) {
        case 'ADMIN':
            return '/admin/dashboard';
        case 'MANAGER':
            return '/manager/dashboard';
        case 'EMPLOYEE':
        default:
            return '/employee/dashboard';
    }
}
