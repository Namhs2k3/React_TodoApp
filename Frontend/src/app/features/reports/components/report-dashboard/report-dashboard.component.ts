import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class ReportDashboardComponent implements OnInit {
  statistics = {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0
  };
  loading = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    
    forkJoin({
      tasks: this.taskService.getTasks()
    }).subscribe({
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

