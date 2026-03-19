import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest } from '../../../core/models/hr.model';

@Component({
    selector: 'app-my-leaves',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './my-leaves.component.html',
})
export class MyLeavesComponent implements OnInit {
    private leaveService = inject(LeaveService);

    leaves: LeaveRequest[] = [];
    loading = true;

    ngOnInit() {
        // this.leaveService.getMyLeaves().subscribe({
        //     next: (data) => {
        //         this.leaves = data;
        //         this.loading = false;
        //     },
        //     error: () => this.loading = false
        // });
    }
}
