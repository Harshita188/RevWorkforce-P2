import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../core/services/leave.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ApplyLeaveResponse } from '../../../core/models/hr.model';

@Component({
    selector: 'app-leave-requests',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './leave-requests.component.html',
})
export class LeaveRequestsComponent implements OnInit {
    private leaveService = inject(LeaveService);
    private authService  = inject(AuthService);
    private toastService = inject(ToastService);

    leaves: ApplyLeaveResponse[] = [];
    loading = true;
    actionLoading: number | null = null;
    errorMessage = '';

    // ── Reject modal state ───────────────────────────────────────────────────
    rejectModalOpen   = false;
    rejectTarget: ApplyLeaveResponse | null = null;
    rejectComment     = '';
    rejectCommentTouched = false;

    ngOnInit(): void {
        this.loadLeaves();
    }

    loadLeaves(): void {
        const managerId = this.authService.getUser()?.managerId;

        if (!managerId) {
            this.errorMessage = 'Manager ID not found. Please log in again.';
            this.loading = false;
            return;
        }

        this.loading      = true;
        this.errorMessage = '';

        this.leaveService.getPendingLeaves(managerId).subscribe({
            next: (data) => {
                this.leaves  = data;
                this.loading = false;
            },
            error: (err) => {
                this.loading      = false;
                this.errorMessage = err?.error?.message || 'Failed to load leave requests.';
                this.toastService.error('Load Failed', this.errorMessage);
            }
        });
    }

    approve(id: number): void {
        const managerId = this.authService.getUser()?.managerId;
        if (!managerId) { this.toastService.error('Error', 'Manager ID not found.'); return; }

        this.actionLoading = id;
        this.leaveService.approveLeave(id, managerId).subscribe({
            next: (res: ApplyLeaveResponse) => {
                this.actionLoading = null;
                this.toastService.success(
                    'Leave Approved',
                    `${res.employeeName}'s ${res.leaveType} leave has been approved.`
                );
                this.loadLeaves();
            },
            error: (err) => {
                this.actionLoading = null;
                this.toastService.error('Approval Failed', err?.error?.message || 'Could not approve the request.');
            }
        });
    }

    /** Step 1 — open the reject modal for the chosen leave */
    openRejectModal(leave: ApplyLeaveResponse): void {
        this.rejectTarget        = leave;
        this.rejectComment       = '';
        this.rejectCommentTouched = false;
        this.rejectModalOpen     = true;
    }

    closeRejectModal(): void {
        this.rejectModalOpen = false;
        this.rejectTarget    = null;
        this.rejectComment   = '';
    }

    /** Step 2 — called from modal confirm button */
    confirmReject(): void {
        this.rejectCommentTouched = true;
        if (!this.rejectComment.trim() || !this.rejectTarget) return;

        const id = this.rejectTarget.id;
        this.actionLoading   = id;
        this.rejectModalOpen = false;

        this.leaveService.rejectLeave(id, this.rejectComment.trim()).subscribe({
            next: (res: ApplyLeaveResponse) => {
                this.actionLoading = null;
                this.toastService.success(
                    'Leave Rejected',
                    `${res.employeeName}'s ${res.leaveType} leave has been rejected.`
                );
                this.rejectTarget = null;
                this.loadLeaves();
            },
            error: (err) => {
                this.actionLoading = null;
                this.toastService.error('Rejection Failed', err?.error?.message || 'Could not reject the request.');
            }
        });
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    }
}
