# Angular Frontend - Quick Reference Guide

## 🚀 Quick Start

### Install & Run
```bash
npm install
npm start
# Opens http://localhost:4200
```

### Login Credentials
```
Email: tanu@gmail.com
Password: yourpassword
```

---

## 📚 Common Tasks

### 1. Create a New Component That Calls an API

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../core/services/leave.service';
import { ToastService } from '../../../core/services/toast.service';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <div *ngIf="!loading && !error">
      <!-- Your template -->
    </div>
  `
})
export class MyComponent implements OnInit, OnDestroy {
  private leaveService = inject(LeaveService);
  private toastService = inject(ToastService);
  private destroyed$ = new Subject<void>();

  data: any[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.leaveService.getMyLeaves()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message;
          this.toastService.error('Error', this.error);
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
```

### 2. Using Reactive Forms

```typescript
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export class MyComponent {
  private fb = inject(FormBuilder);

  myForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
  });

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    // Form data is in this.myForm.value
  }
}
```

### 3. Access Current User Info

```typescript
import { AuthService } from '../core/services/auth.service';

export class MyComponent {
  private authService = inject(AuthService);

  // Get current user (reactive)
  user$ = this.authService.currentUser$;

  // Get current user (signal - Angular 17+)
  user = this.authService.currentUser; // Use in template: authService.currentUser()

  // Get user synchronously (in guards, etc.)
  currentUser = this.authService.getUser();

  // Check role
  isManager = this.authService.hasRole('MANAGER');
}
```

```html
<!-- In template -->
<span *ngIf="authService.currentUser() as user">
  Welcome, {{ user.name }}!
</span>
```

### 4. Make an API Call

```typescript
import { LeaveService } from '../core/services/leave.service';

export class MyComponent {
  private leaveService = inject(LeaveService);

  // Get data
  getLeaves() {
    this.leaveService.getMyLeaves().subscribe(leaves => {
      console.log(leaves);
    });
  }

  // Post data
  applyLeave() {
    const payload = {
      leaveTypeId: 1,
      startDate: '2026-03-01',
      endDate: '2026-03-03',
      reason: 'Personal work'
    };
    this.leaveService.applyLeave(payload).subscribe({
      next: (response) => console.log('Success', response),
      error: (err) => console.error('Error', err)
    });
  }

  // Put/Update
  updateLeave(id: number) {
    this.leaveService.approveLeave(id, 5).subscribe(response => {
      console.log('Updated', response);
    });
  }

  // Delete
  deleteLeave(id: number) {
    this.leaveService.cancelLeave(id).subscribe(response => {
      console.log('Deleted', response);
    });
  }
}
```

### 5. Check User Role in Template

```html
<!-- Check if user is MANAGER -->
<div *ngIf="authService.currentUser() as user">
  <div *ngIf="user.role === 'MANAGER'">
    Manager-only content
  </div>

  <div *ngIf="user.role === 'ADMIN'">
    Admin-only content
  </div>

  <div *ngIf="user.role === 'EMPLOYEE'">
    Employee-only content
  </div>
</div>
```

### 6. Show Loading State

```typescript
export class MyComponent {
  loading = true;
  loadingId: number | null = null;  // For specific item loading

  onDelete(id: number) {
    this.loadingId = id;
    this.service.delete(id).subscribe({
      next: () => this.loadingId = null,
      error: () => this.loadingId = null
    });
  }
}
```

```html
<button [disabled]="loadingId === item.id">
  {{ loadingId === item.id ? 'Deleting...' : 'Delete' }}
</button>
```

### 7. Handle Errors

```typescript
import { HttpErrorResponse } from '@angular/common/http';

export class MyComponent {
  errorMessage = '';

  loadData() {
    this.service.getData().subscribe({
      next: (data) => { /* ... */ },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errorMessage = 'Invalid request';
        } else if (error.status === 404) {
          this.errorMessage = 'Not found';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error';
        } else {
          this.errorMessage = error.error?.message || 'An error occurred';
        }
      }
    });
  }
}
```

### 8. Show Toast Notification

```typescript
import { ToastService } from '../core/services/toast.service';

export class MyComponent {
  private toastService = inject(ToastService);

  notify() {
    this.toastService.success('Title', 'Message');
    this.toastService.error('Error Title', 'Error Message');
    this.toastService.info('Info Title', 'Info Message');
    this.toastService.warning('Warning Title', 'Warning Message');
  }
}
```

### 9. Logout User

```typescript
import { AuthService } from '../core/services/auth.service';

export class NavbarComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
    // Automatically redirects to /login
  }
}
```

### 10. Filter/Search List

```typescript
export class MyComponent {
  allLeaves: LeaveRequest[] = [];
  filteredLeaves: LeaveLeaveRequest[] = [];
  searchText = '';
  filterStatus = 'PENDING';

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.leaveService.getMyLeaves().subscribe(leaves => {
      this.allLeaves = leaves;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredLeaves = this.allLeaves.filter(leave =>
      (this.searchText === '' || leave.employeeName.includes(this.searchText)) &&
      (this.filterStatus === '' || leave.status === this.filterStatus)
    );
  }

  onSearchChange(text: string) {
    this.searchText = text;
    this.applyFilters();
  }
}
```

---

## 🛠️ File Locations

### Services
```
src/app/core/services/
├── auth.service.ts          ← Login, logout, user state
├── user.service.ts          ← User CRUD
├── leave.service.ts         ← Leave management
├── performance.service.ts   ← Performance goals
├── master-data.service.ts   ← Departments, holidays
└── toast.service.ts         ← Notifications
```

### Guards
```
src/app/core/guards/
└── auth.guard.ts            ← authGuard, roleGuard
```

### Interceptors
```
src/app/core/interceptors/
└── auth.interceptor.ts      ← JWT attachment & error handling
```

### Models
```
src/app/core/models/
└── hr.model.ts              ← All TypeScript interfaces
```

### Components (by role)
```
src/app/pages/
├── login/
├── admin/
│   ├── dashboard/
│   ├── users/
│   ├── leaves/
│   └── settings/
├── manager/
│   ├── dashboard/
│   └── leave-requests/
└── employee/
    ├── dashboard/
    ├── apply-leave/
    └── my-leaves/
```

### Layout
```
src/app/layout/
├── main-layout/
├── navbar/
└── sidebar/
```

### Configuration
```
src/
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
├── app.config.ts            ← Providers (router, HTTP, interceptors)
└── app.routes.ts            ← Route definitions
```

---

## 🔍 Service API Reference

### AuthService
```typescript
login(email, password): Observable<User>
logout(): void
getUser(): User | null
getToken(): string | null
setToken(token): void
isLoggedIn(): boolean
hasRole(role): boolean
```

### UserService
```typescript
getAllUsers(): Observable<UserDto[]>
getMyProfile(): Observable<UserDto>
getMyTeam(): Observable<UserDto[]>
getUserById(id): Observable<UserDto>
createUser(user, managerId?): Observable<UserDto>
updateUser(id, user): Observable<UserDto>
deleteUser(id): Observable<any>
assignMeAsManager(userId): Observable<UserDto>
```

### LeaveService
```typescript
applyLeave(payload): Observable<ApplyLeaveResponse>
getMyLeaves(): Observable<LeaveRequest[]>
cancelLeave(id): Observable<ApplyLeaveResponse>
getLeavesByEmployeeId(id): Observable<LeaveRequest[]>
getPendingLeaves(managerId): Observable<ApplyLeaveResponse[]>
getTeamLeaves(managerId): Observable<LeaveRequest[]>
approveLeave(id, managerId): Observable<ApplyLeaveResponse>
rejectLeave(id, comment): Observable<ApplyLeaveResponse>
getAllLeaves(): Observable<LeaveRequest[]>
getLeaveTypes(): Observable<LeaveType[]>
createLeaveType(name): Observable<LeaveType>
```

### PerformanceService
```typescript
submitPerformanceGoal(request): Observable<PerformanceGoal>
getPendingReviews(managerId): Observable<PerformanceGoal[]>
reviewPerformance(id, request): Observable<PerformanceGoal>
getMyPerformanceHistory(employeeId): Observable<PerformanceGoal[]>
```

### MasterDataService
```typescript
getDepartments(): Observable<Department[]>
createDepartment(name): Observable<Department>
getDesignations(): Observable<Designation[]>
createDesignation(name): Observable<Designation>
getHolidays(): Observable<Holiday[]>
addHoliday(name, date): Observable<Holiday>
```

---

## 🎨 Common Patterns

### Observable → Signal Pattern
```typescript
// Old (RxJS-only)
leaves$ = this.leaveService.getMyLeaves();

// New (Angular 17+)
leaves = toSignal(this.leaveService.getMyLeaves());

// In template
ngFor="let leave of leaves()"  // Call as function
```

### Error Handling Pattern
```typescript
data$ = this.service.getData().pipe(
  catchError(error => {
    console.error('Error:', error);
    this.toastService.error('Error', error.message);
    return of([]);  // Return fallback value
  })
);
```

### Unsubscribe Pattern
```typescript
private destroyed$ = new Subject<void>();

ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroyed$))
    .subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroyed$.next();
  this.destroyed$.complete();
}
```

---

## 🚨 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Cannot inject MyService` | Add `providedIn: 'root'` to @Injectable() |
| `Cannot match any routes` | Check route path spelling in app.routes.ts |
| `Token not attaching` | Verify authInterceptor is in app.config.ts |
| `401 on every request` | Check if backend requires different token header format |
| `Memory leak warnings` | Use takeUntil() to unsubscribe properly |
| `Type error in template` | Import types from core/models/hr.model.ts |

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ injects Service
       ▼
┌─────────────────────┐
│  MyService          │
└──────┬──────────────┘
       │ calls http.get/post
       ▼
┌──────────────────────────┐
│  HTTP Interceptor        │
│  - Attach JWT token      │
│  - Handle 401/403        │
└──────┬───────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Spring Boot Backend    │
│  http://localhost:8080  │
└─────────────────────────┘
```

---

## ✅ Pre-Commit Checklist

Before pushing code:
- [ ] `ng build` compiles without errors
- [ ] No console.log statements
- [ ] Unused imports removed
- [ ] Proper error handling in components
- [ ] Loading states shown
- [ ] Disabled buttons during API calls
- [ ] Types defined for all data
- [ ] Comments for complex logic

---

## 📖 Documentation Files

1. **IMPLEMENTATION_SUMMARY.md** - Complete implementation overview
2. **ANGULAR_ARCHITECTURE_GUIDE.md** - Detailed architecture & examples
3. **QUICK_REFERENCE.md** - This file

---

## 🌐 Useful Links

- [Angular 17 Docs](https://angular.io/docs)
- [RxJS Docs](https://rxjs.dev)
- [Frontend API Guide](./docs/api/frontend-guide.md) - Spring Boot API details
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

**Happy Coding!** 🚀
