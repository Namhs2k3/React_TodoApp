import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Task } from "../../../core/models/task.model";

@Injectable({
  providedIn: "root",
})
export class TaskStateService {
  private selectedTaskSubject = new BehaviorSubject<Task | null>(null);
  public selectedTask$: Observable<Task | null> =
    this.selectedTaskSubject.asObservable();

  setSelectedTask(task: Task | null): void {
    this.selectedTaskSubject.next(task);
  }

  getSelectedTask(): Task | null {
    return this.selectedTaskSubject.value;
  }
}
