import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    authService = inject(AuthService);
    user = this.authService.currentUser;

    getCurrentDate(): string {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}
