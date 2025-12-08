import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  showSuccess(message: string): void {
    this.pushToast({ type: 'success', message });
  }

  showError(message: string): void {
    this.pushToast({ type: 'error', message });
  }

  showInfo(message: string): void {
    this.pushToast({ type: 'info', message });
  }

  dismiss(id: string): void {
    this.toastsSubject.next(this.toastsSubject.getValue().filter(t => t.id !== id));
  }

  private pushToast(toast: Omit<ToastMessage, 'id'>): void {
    const current = this.toastsSubject.getValue();
    const id = crypto.randomUUID();
    const newToast: ToastMessage = { id, ...toast };
    this.toastsSubject.next([...current, newToast]);
    setTimeout(() => this.dismiss(id), 3000);
  }
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

