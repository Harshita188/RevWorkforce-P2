import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 w-96 max-w-[calc(100vw-3rem)]">
        <div
            *ngFor="let toast of toastService.toasts$ | async; trackBy: trackById"
            class="flex items-start gap-3 p-4 rounded-2xl shadow-lg border animate-slide-in"
            [ngClass]="{
                'bg-green-50 border-green-200 text-green-800': toast.type === 'success',
                'bg-red-50  border-red-200  text-red-800':   toast.type === 'error',
                'bg-blue-50 border-blue-200 text-blue-800':  toast.type === 'info',
                'bg-amber-50 border-amber-200 text-amber-800': toast.type === 'warning'
            }">

            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
                <!-- Success -->
                <svg *ngIf="toast.type === 'success'"
                    class="w-5 h-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <!-- Error -->
                <svg *ngIf="toast.type === 'error'"
                    class="w-5 h-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                </svg>
                <!-- Info -->
                <svg *ngIf="toast.type === 'info'"
                    class="w-5 h-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                </svg>
                <!-- Warning -->
                <svg *ngIf="toast.type === 'warning'"
                    class="w-5 h-5 text-amber-500"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm">{{ toast.title }}</p>
                <p class="text-sm mt-0.5 opacity-80">{{ toast.message }}</p>
            </div>

            <!-- Dismiss -->
            <button
                (click)="toastService.dismiss(toast.id)"
                class="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    </div>
    `,
    styles: [`
        @keyframes slide-in {
            from { opacity: 0; transform: translateX(100%); }
            to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
    `]
})
export class ToastComponent {
    toastService = inject(ToastService);

    trackById(_: number, toast: Toast): number {
        return toast.id;
    }
}
