import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { Task } from "../../../../core/models/task.model";
import { TaskService } from "../../../../core/services/task.service";
import { NotificationService } from "../../../../core/services/notification.service";

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"],
})
export class TaskFormComponent implements OnInit, OnDestroy {
  @Input() task?: Task;
  @Output() saved = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

  model: Partial<Task> = {
    title: "",
    description: "",
    status: 1,
    priority: 1,
    dueDate: new Date().toISOString().split("T")[0],
  };
  private destroy$ = new Subject<void>();
  private lastTasksSnapshot: Task[] = [];
  private pendingAction: "create" | "update" | null = null;
  private pendingTaskId: number | null = null;
  private lastSubmittedForm: any;

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    if (this.task) {
      this.model = {
        ...this.task,
        dueDate: this.task.dueDate ? this.task.dueDate.slice(0, 10) : undefined,
      };
    }

    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => {
        if (this.pendingAction === "create") {
          const newTask = tasks.find(
            (task) =>
              !this.lastTasksSnapshot.some((prev) => prev.id === task.id),
          );

          if (newTask) {
            this.notificationService.showSuccess("Task created successfully");
            this.saved.emit(newTask);
            this.lastSubmittedForm?.resetForm();
            this.resetModel();
            this.pendingAction = null;
            this.pendingTaskId = null;
          }
        } else if (
          this.pendingAction === "update" &&
          this.pendingTaskId !== null
        ) {
          const updatedTask = tasks.find(
            (task) => task.id === this.pendingTaskId,
          );

          if (updatedTask) {
            this.notificationService.showSuccess("Task updated successfully");
            this.saved.emit(updatedTask);
            this.pendingAction = null;
            this.pendingTaskId = null;
          }
        }

        this.lastTasksSnapshot = [...tasks];
      });

    this.taskService.error$.pipe(takeUntil(this.destroy$)).subscribe((err) => {
      if (!err) {
        return;
      }

      const message =
        typeof err === "string"
          ? err
          : (err.message ?? "Unable to process request. Please try again.");

      this.notificationService.showError(message);
      this.pendingAction = null;
      this.pendingTaskId = null;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    const taskData = {
      title: this.model.title!,
      description: this.model.description ?? "",
      status: Number(this.model.status ?? 1),
      priority: Number(this.model.priority ?? 1),
      dueDate: this.model.dueDate,
    };

    if (this.task?.id) {
      this.pendingAction = "update";
      this.pendingTaskId = this.task.id;
      this.lastSubmittedForm = form;
      this.taskService.updateTask(this.task.id, taskData);
    } else {
      this.pendingAction = "create";
      this.pendingTaskId = null;
      this.lastSubmittedForm = form;
      this.taskService.createTask(taskData);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  isValidDate(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
  }

  isContainInvalidCharacters(content: string): boolean {
    const invalidChars = ["!", "@", "~", "%"];
    return invalidChars.some((char) => content.includes(char));
  }

  private resetModel(): void {
    this.model = {
      title: "",
      description: "",
      status: 1,
      priority: 1,
      dueDate: new Date().toISOString().split("T")[0],
    };
  }
}
