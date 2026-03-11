// ──────────────────────── AUTHENTICATION ────────────────────────

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';

/**
 * Raw response shape returned by POST /auth/login
 */
export interface AuthResponse {
    id?: number;
    token: string;
    tokenType: string;
    name: string;
    email: string;
    /** e.g. "ROLE_MANAGER" | "ROLE_EMPLOYEE" | "ROLE_ADMIN" */
    role: string;
}

/**
 * Normalised user stored in application state / localStorage
 */
export interface User {
    id?: string;
    /** Numeric ID used for manager-scoped API calls */
    managerId?: number;
    email: string;
    name: string;
    role: UserRole;
    employeeId?: string;
}

// ──────────────────────── LEAVES ────────────────────────

/**
 * Leave request model - used for GET endpoints
 */
export interface LeaveRequest {
    id: number;
    employeeName: string;
    managerName: string;
    leaveType: string;
    status: LeaveStatus;
    startDate: string;
    endDate: string;
    reason: string;
}

/**
 * Apply leave request - sent when employee applies for leave
 */
export interface ApplyLeaveRequest {
    leaveTypeId: number;
    startDate: string;
    endDate: string;
    reason: string;
}

/**
 * Response returned by POST /api/leaves and other leave operations
 */
export interface ApplyLeaveResponse {
    id: number;
    employeeName: string;
    managerName: string;
    leaveType: string;
    status: LeaveStatus;
    startDate: string;
    endDate: string;
    reason: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

/**
 * Leave type model
 */
export interface LeaveType {
    id: number;
    name: string;
}

/**
 * Leave balance for an employee
 */
export interface LeaveBalance {
    leaveTypeId: number;
    leaveTypeName: string;
    totalDays: number;
    usedDays: number;
    balanceDays: number;
}

// ──────────────────────── PERFORMANCE ────────────────────────

/**
 * Performance goal model
 */
export interface PerformanceGoal {
    id: number;
    employeeId: number;
    managerId: number;
    goal: string;
    status: PerformanceStatus;
    feedback?: string;
    rating?: number;
    startDate: string;
    endDate: string;
}

/**
 * Submit performance goal request
 */
export interface SubmitPerformanceGoalRequest {
    employeeId: number;
    managerId: number;
    goal: string;
    startDate: string;
    endDate: string;
}

/**
 * Review performance request
 */
export interface ReviewPerformanceRequest {
    feedback: string;
    rating: number;
}

export type PerformanceStatus = 'PENDING' | 'REVIEWED' | 'COMPLETED';

// ──────────────────────── DEPARTMENTS & DESIGNATIONS ────────────────────────

/**
 * Department model
 */
export interface Department {
    id: number;
    name: string;
}

/**
 * Designation model
 */
export interface Designation {
    id: number;
    name: string;
}

// ──────────────────────── HOLIDAYS ────────────────────────

/**
 * Holiday model
 */
export interface Holiday {
    id: number;
    name: string;
    date: string;
}
