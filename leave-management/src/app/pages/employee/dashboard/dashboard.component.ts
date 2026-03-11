import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest } from '../../../core/models/hr.model';

@Component({
    selector: 'app-employee-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
})
export class EmployeeDashboardComponent implements OnInit {
    private leaveService = inject(LeaveService);

    recentLeaves: LeaveRequest[] = [];
    stats = {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0
    };

    ngOnInit() {
        this.leaveService.getMyLeaves().subscribe((leaves: LeaveRequest[]) => {
            this.recentLeaves = leaves.slice(0, 5);
            this.stats.total = leaves.length;
            this.stats.approved = leaves.filter((l: LeaveRequest) => l.status === 'APPROVED').length;
            this.stats.pending = leaves.filter((l: LeaveRequest) => l.status === 'PENDING').length;
            this.stats.rejected = leaves.filter((l: LeaveRequest) => l.status === 'REJECTED').length;
        });
    }
}
