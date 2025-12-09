import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  @Input() task?: Task;
  @Output() saved = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

  model: Partial<Task> = {
    title: '',
    description: '',
    status: 1,
    priority: 1,
    dueDate: new Date().toISOString().split('T')[0]
  };

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.task) {
      this.model = {
        ...this.task,
        dueDate: this.task.dueDate ? this.task.dueDate.slice(0, 10) : undefined
      };
    }
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    const taskData = {
      title: this.model.title!,
      description: this.model.description ?? '',
      status: Number(this.model.status ?? 1),
      priority: Number(this.model.priority ?? 1),
      dueDate: this.model.dueDate
    };

    if (this.task?.id) {
      this.taskService.updateTask(this.task.id, taskData)
        .pipe(
          switchMap(() => {
            return this.taskService.getTaskById(this.task!.id);
          })
        )
        .subscribe({
          next: (updatedTask) => {
            this.notificationService.showSuccess('Task updated successfully');
            this.saved.emit(updatedTask);
          },
          error: (err) => {
            this.notificationService.showError('Unable to update task. Please try again.');
          }
        });
    } else {
      // Create
      this.taskService.createTask(taskData)
        .subscribe({
          next: (newTask) => {
            this.notificationService.showSuccess('Task created successfully');
            this.saved.emit(newTask);
            form.resetForm();
          },
          error: (err) => {
            this.notificationService.showError('Unable to create task. Please try again.');
          }
        });
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
}

