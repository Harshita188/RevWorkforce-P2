import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../../../core/services/leave.service';
import { ToastService } from '../../../core/services/toast.service';
import { ApplyLeaveResponse, LeaveType } from '../../../core/models/hr.model';

@Component({
    selector: 'app-apply-leave',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './apply-leave.component.html',
})
export class ApplyLeaveComponent {
    private fb           = inject(FormBuilder);
    private leaveService = inject(LeaveService);
    private toastService = inject(ToastService);
    private router       = inject(Router);

    leaveTypes: LeaveType[] = [];

    constructor() {
        this.leaveService.getLeaveTypes().subscribe({
            next: (types) => {
                this.leaveTypes = types;
            }
        });
    }

    applyForm: FormGroup = this.fb.group({
        leaveTypeId: [1, Validators.required],
        startDate:   ['', Validators.required],
        endDate:     ['', Validators.required],
        reason:      ['', [Validators.required, Validators.minLength(10)]]
    }, { validators: this.dateRangeValidator });

    loading      = false;
    errorMessage = '';

    private dateRangeValidator(group: FormGroup) {
        const from = group.get('startDate')?.value;
        const to   = group.get('endDate')?.value;
        if (from && to && new Date(from) > new Date(to)) {
            return { dateRange: true };
        }
        return null;
    }

    onSubmit(): void {
        if (this.applyForm.invalid) {
            this.applyForm.markAllAsTouched();
            return;
        }

        this.loading      = true;
        this.errorMessage = '';

        const payload = {
            leaveTypeId: Number(this.applyForm.value.leaveTypeId),
            startDate:   this.applyForm.value.startDate,
            endDate:     this.applyForm.value.endDate,
            reason:      this.applyForm.value.reason
        };

        this.leaveService.applyLeave(payload).subscribe({
            next: (res: ApplyLeaveResponse) => {
                this.loading = false;
                this.toastService.success(
                    'Leave Applied Successfully!',
                    `${res.leaveType} leave from ${this.formatDate(res.startDate)} to ${this.formatDate(res.endDate)} is ${res.status}.`
                );
                this.router.navigate(['/employee/my-leaves']);
            },
            error: (err) => {
                this.loading      = false;
                this.errorMessage = err?.error?.message || 'Failed to submit leave request. Please try again.';
                this.toastService.error(
                    'Submission Failed',
                    this.errorMessage
                );
            }
        });
    }

    private formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    }
}
