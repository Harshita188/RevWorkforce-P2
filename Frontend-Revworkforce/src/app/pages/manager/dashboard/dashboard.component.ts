import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest } from '../../../core/models/hr.model';

@Component({
    selector: 'app-manager-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
})
export class ManagerDashboardComponent implements OnInit {
    private leaveService = inject(LeaveService);

    stats = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    };
    recentRequests: LeaveRequest[] = [];

    ngOnInit() {
        this.leaveService.getMyLeaves().subscribe((leaves: LeaveRequest[]) => {
            this.stats.total = leaves.length;
            this.stats.pending = leaves.filter((l: LeaveRequest) => l.status === 'PENDING').length;
            this.stats.approved = leaves.filter((l: LeaveRequest) => l.status === 'APPROVED').length;
            this.stats.rejected = leaves.filter((l: LeaveRequest) => l.status === 'REJECTED').length;
            this.recentRequests = leaves.filter((l: LeaveRequest) => l.status === 'PENDING').slice(0, 5);
        });
    }
}
