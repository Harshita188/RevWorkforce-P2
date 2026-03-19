import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { AuthResponse, User, UserRole } from '../models/hr.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // ─── Constants ──────────────────────────────────────────────────────────────
    private readonly API_URL   = `${environment.apiBaseUrl}/auth/login`;
    private readonly USER_KEY  = environment.userKey;
    private readonly TOKEN_KEY = environment.tokenKey;

    // ─── State ───────────────────────────────────────────────────────────────────
    /**
     * Source of truth for the authenticated user.
     * Initialised from localStorage so auth state survives page refresh.
     */
    private readonly _currentUser$ = new BehaviorSubject<User | null>(
        this.getStoredUser()
    );

    /** Public observable — subscribe anywhere to react to auth changes. */
    readonly currentUser$: Observable<User | null> =
        this._currentUser$.asObservable();

    /**
     * Angular signal derived from the observable.
     * Used by template expressions such as `user()?.name`.
     */
    readonly currentUser = toSignal(this.currentUser$, {
        initialValue: this.getStoredUser()
    });

    // ─── Constructor ─────────────────────────────────────────────────────────────
    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) {}

    // ─── Authentication ───────────────────────────────────────────────────────────

    /**
     * Call POST /auth/login with credentials.
     * On success: persists token + user to localStorage and updates auth state.
     * On failure: propagates a user-friendly error message via throwError.
     */
    login(email: string, password: string): Observable<User> {
        return this.http
            .post<AuthResponse>(this.API_URL, { email, password })
            .pipe(
                tap((response) => {
                    console.log('Login API response:', response);
                    // Store token immediately from raw response
                    localStorage.setItem(this.TOKEN_KEY, response.token);
                }),
                map((response) => this.mapResponseToUser(response)),
                tap((user)     => {
                    console.log('User mapped and persisting:', user);
                    this.persistSession(user);
                }),
                catchError((err) => this.handleError(err))
            );
    }

    /** Clear all auth state and redirect to login. */
    logout(): void {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
        this._currentUser$.next(null);
        this.router.navigate(['/login']);
    }

    // ─── Getters ──────────────────────────────────────────────────────────────────

    /** Synchronous snapshot of the current user (useful in guards). */
    getUser(): User | null {
        return this._currentUser$.getValue();
    }

    /** Retrieve the stored JWT. */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /** Store a token explicitly (e.g. after token refresh). */
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /** Returns true when there is an authenticated user with a valid token. */
    isLoggedIn(): boolean {
        return !!this._currentUser$.getValue() && !!this.getToken();
    }

    /** Check whether the current user has the given role. */
    hasRole(role: UserRole): boolean {
        return this._currentUser$.getValue()?.role === role;
    }

    // ─── Internals ────────────────────────────────────────────────────────────────

    /**
     * Map the raw API response to the domain User model.
     * Normalises "ROLE_MANAGER" → "MANAGER" etc.
     */
    private mapResponseToUser(response: AuthResponse): User {
        const rawRole  = response.role?.replace('ROLE_', '') as UserRole;
        const role: UserRole = (rawRole === 'MANAGER' || rawRole === 'EMPLOYEE' || rawRole === 'ADMIN')
            ? rawRole
            : 'EMPLOYEE';

        console.log('API Response role:', response.role, 'Mapped role:', role);

        return {
            email:     response.email,
            name:      response.name,
            role,
            ...(response.id !== undefined && { managerId: response.id })
        };
    }

    /**
     * Save user to localStorage, push into BehaviorSubject and redirect.
     * Token is already stored inside the login() tap above.
     */
    private persistSession(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this._currentUser$.next(user);
        this.redirectBasedOnRole(user.role);
    }

    private redirectBasedOnRole(role: UserRole): void {
        let target: string;
        switch (role) {
            case 'ADMIN':
                target = '/admin/dashboard';
                break;
            case 'MANAGER':
                target = '/manager/dashboard';
                break;
            case 'EMPLOYEE':
            default:
                target = '/employee/dashboard';
                break;
        }
        this.router.navigate([target]);
    }

    private getStoredUser(): User | null {
        try {
            const raw = localStorage.getItem(this.USER_KEY);
            return raw ? (JSON.parse(raw) as User) : null;
        } catch {
            return null;
        }
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let message = 'An unexpected error occurred. Please try again.';

        if (err.status === 0) {
            message = 'Unable to reach the server. Check your connection.';
        } else if (err.status === 401) {
            message = 'Invalid email or password.';
        } else if (err.status === 403) {
            message = 'Access denied. Contact your administrator.';
        } else if (err.error?.message) {
            message = err.error.message;
        }

        return throwError(() => new Error(message));
    }
}

