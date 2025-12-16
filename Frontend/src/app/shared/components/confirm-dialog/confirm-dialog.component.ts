import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import {
  ConfirmDialogService,
  ConfirmDialogRequest,
} from "../../../core/services/confirm-dialog.service";

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  active = false;
  message = "";
  private resolver: ((result: boolean) => void) | null = null;
  private sub?: Subscription;

  constructor(private confirmDialogService: ConfirmDialogService) {}

  ngOnInit(): void {
    this.sub = this.confirmDialogService.request$.subscribe(
      (req: ConfirmDialogRequest) => {
        this.message = req.message;
        this.resolver = req.resolve;
        this.active = true;
      },
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  handle(result: boolean): void {
    this.active = false;
    this.resolver?.(result);
    this.resolver = null;
  }
}
