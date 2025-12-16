import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { forkJoin } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.scss']
})
export class ReportDashboardComponent implements OnInit, OnDestroy {
  statistics = {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0
  };
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStatistics(): void {
    this.loading = true;
    
    forkJoin({
      tasks: this.taskService.tasks$
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          const tasks = result.tasks;
          this.statistics.total = tasks.length;
          this.statistics.todo = tasks.filter(t => t.status === 1).length;
          this.statistics.inProgress = tasks.filter(t => t.status === 2).length;
          this.statistics.done = tasks.filter(t => t.status === 3).length;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}

