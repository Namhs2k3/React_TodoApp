import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface ConfirmDialogRequest {
  message: string;
  resolve: (result: boolean) => void;
}

@Injectable({
  providedIn: "root",
})
export class ConfirmDialogService {
  private requestSubject = new Subject<ConfirmDialogRequest>();
  request$ = this.requestSubject.asObservable();

  open(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.requestSubject.next({ message, resolve });
    });
  }
}
