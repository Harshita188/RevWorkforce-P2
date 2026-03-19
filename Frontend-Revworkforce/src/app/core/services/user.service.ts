import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * User model
 */
export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: {
    id: number;
    name: string;
  };
  designation: {
    id: number;
    name: string;
  };
}

/**
 * Create/Update user request
 */
export interface CreateUpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

/**
 * User service handles all user-related API calls
 * - Get all users (Admin)
 * - Get current user profile (Employee)
 * - Get team members (Manager)
 * - Create user (Admin)
 * - Update user (Admin/Manager/Employee)
 * - Delete user (Admin)
 * - Assign manager (Manager)
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/users`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all users in the system
   * ✓ ADMIN only
   */
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}`);
  }

  /**
   * Get current authenticated user's profile
   * ✓ EMPLOYEE only
   */
  getMyProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`);
  }

  /**
   * Get team members under this manager
   * ✓ MANAGER only
   */
  getMyTeam(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/my-team`);
  }

  /**
   * Get user by ID
   * ✓ ADMIN/MANAGER can retrieve team members
   */
  getUserById(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Create a new user
   * ✓ ADMIN only
   * @param user User data to create
   * @param managerId Optional manager ID to assign
   */
  createUser(user: CreateUpdateUserDto, managerId?: number): Observable<UserDto> {
    let params = new HttpParams();
    if (managerId) {
      params = params.set('managerId', managerId.toString());
    }
    return this.http.post<UserDto>(`${this.apiUrl}`, user, { params });
  }

  /**
   * Update user information
   * ✓ ADMIN can update anyone
   * ✓ MANAGER can update their team members
   * ✓ EMPLOYEE can update own profile
   */
  updateUser(userId: number, user: CreateUpdateUserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/${userId}`, user);
  }

  /**
   * Delete a user
   * ✓ ADMIN only
   */
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  /**
   * Manager assigns themselves to a user
   * ✓ MANAGER only
   */
  assignMeAsManager(userId: number): Observable<UserDto> {
    return this.http.put<UserDto>(
      `${this.apiUrl}/${userId}/assign-manager`,
      {}
    );
  }
}
