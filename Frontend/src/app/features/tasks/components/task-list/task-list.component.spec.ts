import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { TaskStateService } from '../../services/task-state.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { Task } from '../../../../core/models/task.model';

class TaskServiceStub {
  getTasks = jasmine.createSpy().and.returnValue(of([]));
  deleteTask = jasmine.createSpy().and.returnValue(of(void 0));
}

class TaskStateServiceStub {
  private subject = new BehaviorSubject<Task | null>(null);
  selectedTask$ = this.subject.asObservable();
  setSelectedTask = jasmine.createSpy();
}

class NotificationServiceStub {
  showSuccess = jasmine.createSpy();
  showError = jasmine.createSpy();
}

class ConfirmDialogServiceStub {
  open = jasmine.createSpy().and.returnValue(Promise.resolve(true));
}

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  let taskService: TaskServiceStub;
  let confirmDialog: ConfirmDialogServiceStub;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task A',
      description: 'Desc A',
      status: 1,
      statusName: 'Todo',
      dueDate: new Date().toISOString(),
      priority: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    taskService = new TaskServiceStub();
    confirmDialog = new ConfirmDialogServiceStub();

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: TaskStateService, useClass: TaskStateServiceStub },
        { provide: NotificationService, useClass: NotificationServiceStub },
        { provide: ConfirmDialogService, useValue: confirmDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('loads tasks on init', () => {
    taskService.getTasks.and.returnValue(of(mockTasks));

    fixture.detectChanges(); // triggers ngOnInit

    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].title).toBe('Task A');
  });

  it('calls delete when confirmed', fakeAsync(() => {
    taskService.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges(); // init

    component.onDelete(1);
    tick(); // wait for confirm promise

    expect(confirmDialog.open).toHaveBeenCalled();
    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
  }));
});


