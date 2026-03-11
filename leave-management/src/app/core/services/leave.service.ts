import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplyLeaveRequest, ApplyLeaveResponse, LeaveRequest, LeaveType } from '../models/hr.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Leave service handles all leave-related API calls
 * - Apply leave (Employee)
 * - Get employee's leaves (Employee)
 * - Get leaves by employee ID (Admin/Manager)
 * - Get pending leaves (Manager)
 * - Get team leaves (Manager)
 * - Get all leaves (Admin)
 * - Approve leave (Manager)
 * - Reject leave (Manager)
 * - Cancel leave (Employee)
 */
@Injectable({
    providedIn: 'root'
})
export class LeaveService {
    private readonly apiUrl = `${environment.apiBaseUrl}/api/leaves`;
    private readonly leaveTypesUrl = `${environment.apiBaseUrl}/api/admin/leave-types`;

    constructor(private readonly http: HttpClient) {}

    // ──────────────────── EMPLOYEE ENDPOINTS ────────────────────

    /**
     * Apply for a new leave
     * ✓ EMPLOYEE only
     * POST /api/leaves
     */
    applyLeave(payload: ApplyLeaveRequest): Observable<ApplyLeaveResponse> {
        return this.http.post<ApplyLeaveResponse>(`${this.apiUrl}`, payload);
    }

    /**
     * Get all leaves for authenticated employee (using JWT)
     * ✓ EMPLOYEE only
     * GET /api/leaves/my
     */
    getMyLeaves(): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(`${this.apiUrl}/my`);
    }

    /**
     * Cancel a pending leave
     * ✓ EMPLOYEE only
     * PUT /api/leaves/{id}/cancel
     */
    cancelLeave(leaveId: number): Observable<ApplyLeaveResponse> {
        return this.http.put<ApplyLeaveResponse>(
            `${this.apiUrl}/${leaveId}/cancel`,
            {}
        );
    }

    // ──────────────────── MANAGER ENDPOINTS ────────────────────

    /**
     * Get leaves for a specific employee
     * ✓ MANAGER can get their team members' leaves
     * GET /api/leaves/employee/{employeeId}
     */
    getLeavesByEmployeeId(employeeId: number): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(`${this.apiUrl}/employee/${employeeId}`);
    }

    /**
     * Get pending leave requests for manager's team
     * ✓ MANAGER only
     * GET /api/leaves/pending?managerId={id}
     */
    getPendingLeaves(managerId: number): Observable<ApplyLeaveResponse[]> {
        return this.http.get<ApplyLeaveResponse[]>(
            `${this.apiUrl}/pending`,
            { params: { managerId: managerId.toString() } }
        );
    }

    /**
     * Get all team leaves
     * ✓ MANAGER only
     * GET /api/leaves/team?managerId={id}
     */
    getTeamLeaves(managerId: number): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(
            `${this.apiUrl}/team`,
            { params: { managerId: managerId.toString() } }
        );
    }

    /**
     * Approve a leave request
     * ✓ MANAGER only
     * PUT /api/leaves/{id}/approve?managerId={id}
     */
    approveLeave(leaveId: number, managerId: number): Observable<ApplyLeaveResponse> {
        return this.http.put<ApplyLeaveResponse>(
            `${this.apiUrl}/${leaveId}/approve`,
            {},
            { params: { managerId: managerId.toString() } }
        );
    }

    /**
     * Reject a leave request with comment
     * ✓ MANAGER only
     * PUT /api/leaves/{id}/reject?comment={reason}
     */
    rejectLeave(leaveId: number, comment: string): Observable<ApplyLeaveResponse> {
        return this.http.put<ApplyLeaveResponse>(
            `${this.apiUrl}/${leaveId}/reject`,
            {},
            { params: { comment } }
        );
    }

    // ──────────────────── ADMIN ENDPOINTS ────────────────────

    /**
     * Get all leaves in the system
     * ✓ ADMIN only
     * GET /api/leaves/all
     */
    getAllLeaves(): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(`${this.apiUrl}/all`);
    }

    // ──────────────────── LEAVE TYPES ────────────────────

    /**
     * Get all leave types
     * ✓ All roles
     * GET /api/admin/leave-types
     */
    getLeaveTypes(): Observable<LeaveType[]> {
        return this.http.get<LeaveType[]>(`${this.leaveTypesUrl}`);
    }

    /**
     * Create a new leave type
     * ✓ ADMIN only
     * POST /api/admin/leave-types
     */
    createLeaveType(name: string): Observable<LeaveType> {
        return this.http.post<LeaveType>(`${this.leaveTypesUrl}`, { name });
    }
}
