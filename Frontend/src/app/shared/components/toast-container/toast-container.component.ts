import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  NotificationService,
  ToastMessage,
} from "../../../core/services/notification.service";

@Component({
  selector: "app-toast-container",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./toast-container.component.html",
  styleUrls: ["./toast-container.component.scss"],
})
export class ToastContainerComponent {
  toasts$;

  constructor(private notificationService: NotificationService) {
    this.toasts$ = this.notificationService.toasts$;
  }

  dismiss(toast: ToastMessage): void {
    this.notificationService.dismiss(toast.id);
  }
}
