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
  private previousTasks: Task[] = [];
  private pendingDeleteId: number | null = null;
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
      this.taskService.tasks$,
      this.taskStateService.selectedTask$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([tasks, selectedTask]) => {
      if (
        this.pendingDeleteId !== null &&
        this.previousTasks.some(t => t.id === this.pendingDeleteId) &&
        !tasks.some(t => t.id === this.pendingDeleteId)
      ) {
        this.notificationService.showSuccess('Task deleted successfully.');
        this.pendingDeleteId = null;
      }

      this.tasks = tasks;
      this.selectedTask = selectedTask;
      this.previousTasks = [...tasks];
    });

    this.taskService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    this.taskService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(err => {
        if (err) {
          const message = typeof err === 'string'
            ? err
            : err.message ?? 'Unable to load task list. Please try again later.';

          this.error = message;
          this.notificationService.showError(message);
        } else {
          this.error = null;
        }
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
    this.taskService.getTasks();
  }

  onDelete(id: number): void {
    this.confirmDialog.open('Are you sure you want to delete this task?').then(confirmed => {
      if (!confirmed) return;
      this.pendingDeleteId = id;
      this.taskService.deleteTask(id);
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
  }

  onFormCancelled(): void {
    this.showForm = false;
  }
}

