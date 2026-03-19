import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformanceGoal, SubmitPerformanceGoalRequest, ReviewPerformanceRequest } from '../models/hr.model';
import { environment } from '../../../environments/environment';

/**
 * Performance service handles all performance-related API calls
 * - Submit performance goal (Employee)
 * - Get pending reviews (Manager)
 * - Review performance (Manager)
 * - Get performance history (Employee)
 */
@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/performance`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Submit a new performance goal
   * ✓ EMPLOYEE only
   * POST /api/performance
   */
  submitPerformanceGoal(request: SubmitPerformanceGoalRequest): Observable<PerformanceGoal> {
    return this.http.post<PerformanceGoal>(this.apiUrl, request);
  }

  /**
   * Get pending performance reviews for manager
   * ✓ MANAGER only
   * GET /api/performance/pending?managerId={id}
   */
  getPendingReviews(managerId: number): Observable<PerformanceGoal[]> {
    return this.http.get<PerformanceGoal[]>(
      `${this.apiUrl}/pending`,
      { params: { managerId: managerId.toString() } }
    );
  }

  /**
   * Review an employee's performance goal
   * ✓ MANAGER only
   * PUT /api/performance/{id}/review
   */
  reviewPerformance(goalId: number, request: ReviewPerformanceRequest): Observable<PerformanceGoal> {
    return this.http.put<PerformanceGoal>(
      `${this.apiUrl}/${goalId}/review`,
      request
    );
  }

  /**
   * Get performance history for employee
   * ✓ EMPLOYEE only
   * GET /api/performance/my?employeeId={id}
   */
  getMyPerformanceHistory(employeeId: number): Observable<PerformanceGoal[]> {
    return this.http.get<PerformanceGoal[]>(
      `${this.apiUrl}/my`,
      { params: { employeeId: employeeId.toString() } }
    );
  }
}
