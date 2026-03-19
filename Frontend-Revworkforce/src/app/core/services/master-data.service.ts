import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, Designation, Holiday } from '../models/hr.model';
import { environment } from '../../../environments/environment';

/**
 * Master data service for departments, designations, and holidays
 * These are common endpoints used by all roles
 */
@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly departmentsUrl = `${this.baseUrl}/api/departments`;
  private readonly designationsUrl = `${this.baseUrl}/api/designations`;
  private readonly holidaysUrl = `${this.baseUrl}/api/holidays`;

  constructor(private readonly http: HttpClient) {}

  // ────────────────────── DEPARTMENTS ──────────────────────

  /**
   * Get all departments
   * ✓ All roles
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.departmentsUrl);
  }

  /**
   * Create a new department
   * ✓ ADMIN only
   */
  createDepartment(name: string): Observable<Department> {
    return this.http.post<Department>(this.departmentsUrl, { name });
  }

  // ────────────────────── DESIGNATIONS ──────────────────────

  /**
   * Get all designations
   * ✓ All roles
   */
  getDesignations(): Observable<Designation[]> {
    return this.http.get<Designation[]>(this.designationsUrl);
  }

  /**
   * Create a new designation
   * ✓ ADMIN only
   */
  createDesignation(name: string): Observable<Designation> {
    return this.http.post<Designation>(this.designationsUrl, { name });
  }

  // ────────────────────── HOLIDAYS ──────────────────────

  /**
   * Get all holidays
   * ✓ All roles
   */
  getHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(this.holidaysUrl);
  }

  /**
   * Add a new holiday
   * ✓ ADMIN only
   */
  addHoliday(name: string, date: string): Observable<Holiday> {
    return this.http.post<Holiday>(this.holidaysUrl, { name, date });
  }
}
