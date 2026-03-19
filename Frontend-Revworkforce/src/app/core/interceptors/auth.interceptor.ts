import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * HTTP Interceptor for JWT Authentication
 *
 * Responsibilities:
 * 1. Attach Authorization header with JWT token to all requests
 * 2. Handle 401 Unauthorized - token expired or invalid
 * 3. Handle 403 Forbidden - insufficient permissions
 * 4. Redirect to login on auth failure
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem(environment.tokenKey);

    // Add Authorization header if token exists
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Handle response errors
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle 401 Unauthorized - invalid or expired token
            if (error.status === 401) {
                // Clear auth data from localStorage
                localStorage.removeItem(environment.tokenKey);
                localStorage.removeItem(environment.userKey);

                // Redirect to login
                router.navigate(['/login']);

                console.error('Token expired or invalid. Please login again.');
            }

            // Handle 403 Forbidden - user is authenticated but lacks permission.
            // Do NOT redirect to login — the user IS logged in.
            // Let the component handle this gracefully (show an error message, etc.)
            if (error.status === 403) {
                console.error('Access denied. You do not have permission to access this resource.');
            }

            // Re-throw error for components to handle
            return throwError(() => error);
        })
    );
};
