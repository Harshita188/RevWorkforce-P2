import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../../core/services/master-data.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Admin Settings - Manage system-wide settings
 * - Create departments
 * - Create designations
 * - Add holidays
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h1>System Settings</h1>

      <!-- Departments -->
      <div class="settings-section">
        <h2>Departments</h2>
        <div class="add-form">
          <input [(ngModel)]="newDepartment" placeholder="Department name">
          <button (click)="addDepartment()">Add Department</button>
        </div>
        <ul *ngIf="departments.length > 0">
          <li *ngFor="let dept of departments">{{ dept.name }}</li>
        </ul>
      </div>

      <!-- Designations -->
      <div class="settings-section">
        <h2>Designations</h2>
        <div class="add-form">
          <input [(ngModel)]="newDesignation" placeholder="Designation name">
          <button (click)="addDesignation()">Add Designation</button>
        </div>
        <ul *ngIf="designations.length > 0">
          <li *ngFor="let desig of designations">{{ desig.name }}</li>
        </ul>
      </div>

      <!-- Holidays -->
      <div class="settings-section">
        <h2>Holidays</h2>
        <div class="add-form">
          <input [(ngModel)]="newHolidayName" placeholder="Holiday name">
          <input type="date" [(ngModel)]="newHolidayDate">
          <button (click)="addHoliday()">Add Holiday</button>
        </div>
        <ul *ngIf="holidays.length > 0">
          <li *ngFor="let holiday of holidays">{{ holiday.name }} - {{ holiday.date }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { padding: 20px; max-width: 1000px; margin: 0 auto; }
    .settings-section { margin-bottom: 40px; padding: 20px; background: #f9f9f9; border-radius: 8px; }
    .add-form { display: flex; gap: 10px; margin-bottom: 15px; }
    .add-form input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .add-form button { padding: 8px 20px; background: #007bff; color: white; border: none; border-radius: 4px; }
    ul { list-style: none; padding: 0; }
    li { padding: 10px; background: white; margin-bottom: 5px; border-left: 4px solid #007bff; }
  `]
})
export class SettingsComponent {
  private masterDataService = inject(MasterDataService);
  private toastService = inject(ToastService);

  departments: any[] = [];
  designations: any[] = [];
  holidays: any[] = [];

  newDepartment = '';
  newDesignation = '';
  newHolidayName = '';
  newHolidayDate = '';

  ngOnInit() {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.masterDataService.getDepartments().subscribe(
      depts => this.departments = depts
    );
    this.masterDataService.getDesignations().subscribe(
      desigs => this.designations = desigs
    );
    this.masterDataService.getHolidays().subscribe(
      holidays => this.holidays = holidays
    );
  }

  addDepartment(): void {
    if (!this.newDepartment.trim()) return;
    this.masterDataService.createDepartment(this.newDepartment).subscribe({
      next: () => {
        this.toastService.success('Success', 'Department added');
        this.newDepartment = '';
        this.loadSettings();
      },
      error: () => this.toastService.error('Error', 'Failed to add department')
    });
  }

  addDesignation(): void {
    if (!this.newDesignation.trim()) return;
    this.masterDataService.createDesignation(this.newDesignation).subscribe({
      next: () => {
        this.toastService.success('Success', 'Designation added');
        this.newDesignation = '';
        this.loadSettings();
      },
      error: () => this.toastService.error('Error', 'Failed to add designation')
    });
  }

  addHoliday(): void {
    if (!this.newHolidayName.trim() || !this.newHolidayDate) return;
    this.masterDataService.addHoliday(this.newHolidayName, this.newHolidayDate).subscribe({
      next: () => {
        this.toastService.success('Success', 'Holiday added');
        this.newHolidayName = '';
        this.newHolidayDate = '';
        this.loadSettings();
      },
      error: () => this.toastService.error('Error', 'Failed to add holiday')
    });
  }
}
