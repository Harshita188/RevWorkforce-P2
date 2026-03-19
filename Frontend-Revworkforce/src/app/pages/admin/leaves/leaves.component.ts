import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest } from '../../../core/models/hr.model';

/**
 * Admin Leaves Management - View all leaves in system
 */
@Component({
  selector: 'app-admin-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>All Leaves</h1>

      <div class="filters">
        <select [(ngModel)]="filterStatus">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div *ngIf="loading" class="loading">Loading...</div>

      <table *ngIf="!loading && filteredLeaves.length > 0">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Manager</th>
            <th>Leave Type</th>
            <th>From - To</th>
            <th>Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let leave of filteredLeaves">
            <td>{{ leave.employeeName }}</td>
            <td>{{ leave.managerName }}</td>
            <td>{{ leave.leaveType }}</td>
            <td>{{ leave.startDate }} to {{ leave.endDate }}</td>
            <td><span [ngClass]="'status-' + leave.status">{{ leave.status }}</span></td>
            <td>{{ leave.reason }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && filteredLeaves.length === 0" class="no-data">
        No leaves found
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .filters { margin: 20px 0; }
    .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: 600; }
    .status-PENDING { color: orange; font-weight: 600; }
    .status-APPROVED { color: green; font-weight: 600; }
    .status-REJECTED { color: red; font-weight: 600; }
  `]
})
export class AdminLeavesComponent implements OnInit {
  private leaveService = inject(LeaveService);

  leaves: LeaveRequest[] = [];
  filteredLeaves: LeaveRequest[] = [];
  filterStatus: string = '';
  loading = true;

  ngOnInit() {
    this.loadLeaves();
  }

  private loadLeaves(): void {
    this.leaveService.getAllLeaves().subscribe({
      next: (leaves) => {
        this.leaves = leaves;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private applyFilters(): void {
    this.filteredLeaves = this.leaves.filter(leave =>
      !this.filterStatus || leave.status === this.filterStatus
    );
  }
}
