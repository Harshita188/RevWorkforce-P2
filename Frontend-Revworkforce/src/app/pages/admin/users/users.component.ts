import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, UserDto, CreateUpdateUserDto } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Admin Users Management - CRUD operations for users
 * Allows admin to:
 * - View all users
 * - Create new users
 * - Update user information
 * - Delete users
 * - Assign managers
 */
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="users-container">
      <h1>Users Management</h1>

      <!-- Create User Form -->
      <div class="create-section">
        <h2>Create New User</h2>
        <form [formGroup]="createForm" (ngSubmit)="createUser()">
          <div class="form-row">
            <input type="email" formControlName="email" placeholder="Email" required>
            <input type="text" formControlName="firstName" placeholder="First Name" required>
            <input type="text" formControlName="lastName" placeholder="Last Name" required>
            <input type="password" formControlName="password" placeholder="Password" required>
            <button type="submit" [disabled]="createForm.invalid || creatingUser">
              {{ creatingUser ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Users List -->
      <div class="users-list">
        <h2>All Users ({{ users.length }})</h2>
        <div *ngIf="loading" class="loading">Loading...</div>

        <table *ngIf="!loading && users.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.department.name }}</td>
              <td>{{ user.designation.name }}</td>
              <td>
                <button class="btn-edit">Edit</button>
                <button class="btn-delete" (click)="deleteUser(user.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && users.length === 0" class="no-data">
          No users found
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .create-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .form-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .form-row input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .form-row button { padding: 8px 20px; background: #007bff; color: white; border: none; border-radius: 4px; }
    .users-list { margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: 600; }
    .btn-edit, .btn-delete { padding: 6px 12px; margin-right: 5px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-edit { background: #28a745; color: white; }
    .btn-delete { background: #dc3545; color: white; }
  `]
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  users: UserDto[] = [];
  loading = true;
  creatingUser = false;

  createForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Error', 'Failed to load users');
      }
    });
  }

  createUser(): void {
    if (this.createForm.invalid) return;

    this.creatingUser = true;
    const formValue = this.createForm.value;
    const userData: CreateUpdateUserDto = {
      email: formValue.email!,
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      password: formValue.password!
    };

    this.userService.createUser(userData).subscribe({
      next: () => {
        this.toastService.success('Success', 'User created successfully');
        this.createForm.reset();
        this.creatingUser = false;
        this.loadUsers();
      },
      error: (err) => {
        this.creatingUser = false;
        this.toastService.error('Error', 'Failed to create user');
      }
    });
  }

  deleteUser(userId: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.toastService.success('Success', 'User deleted successfully');
        this.loadUsers();
      },
      error: () => {
        this.toastService.error('Error', 'Failed to delete user');
      }
    });
  }
}
