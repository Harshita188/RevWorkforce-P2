import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { LeaveService } from '../../../core/services/leave.service';
import { UserDto } from '../../../core/services/user.service';
import { LeaveRequest } from '../../../core/models/hr.model';

/**
 * Admin Dashboard - Overview of all system activity
 * Shows:
 * - Total users, leaves, pending approvals
 * - Recent activities
 * - System statistics
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Admin Dashboard</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p>{{ totalUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>Pending Leaves</h3>
          <p>{{ pendingLeavesCount }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Leaves</h3>
          <p>{{ totalLeaves }}</p>
        </div>
      </div>

      <div class="recent-section">
        <h2>Recent Leaves</h2>
        <div *ngIf="loading" class="loading">Loading...</div>
        <table *ngIf="!loading && recentLeaves.length > 0">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Date Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let leave of recentLeaves">
              <td>{{ leave.employeeName }}</td>
              <td>{{ leave.leaveType }}</td>
              <td>{{ leave.startDate }} to {{ leave.endDate }}</td>
              <td><span [ngClass]="'status-' + leave.status">{{ leave.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
    .stat-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; text-align: center; }
    .stat-card h3 { margin: 0; color: #666; }
    .stat-card p { font-size: 32px; font-weight: bold; margin: 10px 0 0; }
    .recent-section { margin-top: 40px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; font-weight: 600; }
    .status-PENDING { color: orange; font-weight: 600; }
    .status-APPROVED { color: green; font-weight: 600; }
    .status-REJECTED { color: red; font-weight: 600; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private userService = inject(UserService);
  private leaveService = inject(LeaveService);

  totalUsers = 0;
  totalLeaves = 0;
  pendingLeavesCount = 0;
  recentLeaves: LeaveRequest[] = [];
  loading = true;

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load users
    this.userService.getAllUsers().subscribe({
      next: (users: UserDto[]) => {
        this.totalUsers = users.length;
      },
      error: () => console.error('Failed to load users')
    });

    // Load all leaves
    this.leaveService.getAllLeaves().subscribe({
      next: (leaves: LeaveRequest[]) => {
        this.totalLeaves = leaves.length;
        this.pendingLeavesCount = leaves.filter(l => l.status === 'PENDING').length;
        this.recentLeaves = leaves.slice(0, 5);
        this.loading = false;
      },
      error: () => {
        console.error('Failed to load leaves');
        this.loading = false;
      }
    });
  }
}
