import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from '../../../../core/services/task.service';
import { TaskStateService } from '../../services/task-state.service';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../../../core/models/task.model';

class TaskServiceMock {
  getTaskById = jasmine.createSpy().and.returnValue(of());
}

class TaskStateServiceMock {
  private subject = new BehaviorSubject<Task | null>(null);
  selectedTask$ = this.subject.asObservable();
  setSelectedTask = jasmine
    .createSpy('setSelectedTask', (task: Task) => this.subject.next(task))
    .and.callThrough();
}

describe('TaskDetailComponent', () => {
  let fixture: ComponentFixture<TaskDetailComponent>;
  let component: TaskDetailComponent;
  let taskService: TaskServiceMock;
  let taskState: TaskStateServiceMock;

  const mockTask: Task = {
    id: 5,
    title: 'Detail Task',
    description: 'Detail Desc',
    status: 2,
    statusName: 'In Progress',
    dueDate: new Date().toISOString(),
    priority: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    taskService = new TaskServiceMock();
    taskState = new TaskStateServiceMock();

    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: TaskStateService, useValue: taskState },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => mockTask.id.toString() } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
  });

  it('loads task on init using route id', () => {
    taskService.getTaskById.and.returnValue(of(mockTask));

    fixture.detectChanges(); // triggers ngOnInit

    expect(taskService.getTaskById).toHaveBeenCalledWith(mockTask.id);
    expect(component.task?.title).toBe('Detail Task');
    expect(taskState.setSelectedTask).toHaveBeenCalledWith(mockTask);
  });

  it('should set loading to true when loading task', () => {
    component.loadTask(mockTask.id);

    expect(component.loading).toBe(true);
  });
});


