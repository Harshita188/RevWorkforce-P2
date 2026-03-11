import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private fb          = inject(FormBuilder);
    private authService = inject(AuthService);

    loginForm: FormGroup = this.fb.group({
        email:    ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(2)]]
    });

    error: string | null = null;
    loading = false;

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error   = null;

        const { email, password } = this.loginForm.value;

        this.authService.login(email, password).subscribe({
            next: () => {
                // Navigation is handled inside AuthService.redirectBasedOnRole()
                this.loading = false;
            },
            error: (err: Error) => {
                this.error   = err.message;
                this.loading = false;
            }
        });
    }
}

