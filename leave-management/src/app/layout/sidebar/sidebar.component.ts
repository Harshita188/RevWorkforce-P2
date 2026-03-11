import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    authService = inject(AuthService);
    user = this.authService.currentUser;

    employeeMenu = [
        { label: 'Dashboard', icon: 'dashboard', route: '/employee/dashboard' },
        { label: 'Apply Leave', icon: 'add_circle', route: '/employee/apply-leave' },
        { label: 'My Leaves', icon: 'list', route: '/employee/my-leaves' },
    ];

    managerMenu = [
        { label: 'Dashboard', icon: 'dashboard', route: '/manager/dashboard' },
        { label: 'Leave Requests', icon: 'pending_actions', route: '/manager/leave-requests' },
    ];

    get menuItems() {
        return this.user()?.role === 'MANAGER' ? this.managerMenu : this.employeeMenu;
    }
}
