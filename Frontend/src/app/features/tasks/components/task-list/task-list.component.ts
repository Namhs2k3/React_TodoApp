import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { TaskStateService } from '../../services/task-state.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskStatusPipe } from '../../../../shared/pipes/task-status.pipe';
import { HighlightOverdueDirective } from '../../../../shared/directives/highlight-overdue.directive';
import { TaskFormComponent } from '../task-form/task-form.component';
import { PriorityPipe } from '../../../../shared/pipes/priority.pipe';
import { PriorityStyleDirective } from '../../../../shared/directives/priority-style.directive';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TaskStatusPipe,
    PriorityPipe,
    HighlightOverdueDirective,
    PriorityStyleDirective,
    TaskFormComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy, AfterViewInit {
  tasks: Task[] = [];
  loading = false;
  error: string | null = null;
  selectedTask: Task | null = null;
  editingTask: Task | null = null;
  showForm = false;
  private destroy$ = new Subject<void>();
  @ViewChild('addBtn') addBtn?: ElementRef<HTMLButtonElement>;

  constructor(
    private taskService: TaskService,
    private taskStateService: TaskStateService,
    private notificationService: NotificationService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    
    combineLatest([
      this.taskService.getTasks(),
      this.taskStateService.selectedTask$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([tasks, selectedTask]) => {
      this.tasks = tasks;
      this.selectedTask = selectedTask;
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.addBtn?.nativeElement.focus();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;

    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Unable to load task list. Please try again later.';
          this.loading = false;
          this.notificationService.showError(this.error);
        }
      });
  }

  onDelete(id: number): void {
    this.confirmDialog.open('Are you sure you want to delete this task?').then(confirmed => {
      if (!confirmed) return;
      this.taskService.deleteTask(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Task deleted successfully.');
            this.loadTasks();
          },
          error: () => {
            this.notificationService.showError('Unable to delete task. Please try again later.');
          }
        });
    });
  }

  onSelectTask(task: Task): void {
    this.taskStateService.setSelectedTask(task);
  }

  openAddModal(): void {
    this.editingTask = null;
    this.showForm = true;
  }

  onEdit(task: Task): void {
    this.editingTask = task;
    this.showForm = true;
  }

  onFormSaved(task: Task): void {
    this.showForm = false;
    this.taskStateService.setSelectedTask(task);
    this.loadTasks();
  }

  onFormCancelled(): void {
    this.showForm = false;
  }
}

