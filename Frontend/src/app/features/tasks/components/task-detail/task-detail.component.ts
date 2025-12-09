import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { TaskStateService } from '../../services/task-state.service';
import { PriorityStyleDirective } from "../../../../shared/directives/priority-style.directive";
import { PriorityPipe } from '../../../../shared/pipes/priority.pipe';
import { HighlightOverdueDirective } from "../../../../shared/directives/highlight-overdue.directive";

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PriorityStyleDirective, PriorityPipe, HighlightOverdueDirective],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private taskStateService: TaskStateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTask(+id);
    }
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.taskStateService.setSelectedTask(task);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

