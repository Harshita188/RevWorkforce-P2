import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: number;
    type: ToastType;
    title: string;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _toasts$ = new BehaviorSubject<Toast[]>([]);
    readonly toasts$ = this._toasts$.asObservable();

    private nextId = 0;

    show(type: ToastType, title: string, message: string, duration = 4000): void {
        const toast: Toast = { id: ++this.nextId, type, title, message };
        this._toasts$.next([...this._toasts$.getValue(), toast]);
        setTimeout(() => this.dismiss(toast.id), duration);
    }

    success(title: string, message: string): void {
        this.show('success', title, message);
    }

    error(title: string, message: string): void {
        this.show('error', title, message);
    }

    dismiss(id: number): void {
        this._toasts$.next(this._toasts$.getValue().filter(t => t.id !== id));
    }
}
