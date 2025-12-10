import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { TaskListComponent } from './task-list.component';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { TaskStateService } from '../../services/task-state.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { Task } from '../../../../core/models/task.model';

class TaskServiceMock {
  getTasks = jasmine.createSpy().and.returnValue(of([]));
  deleteTask = jasmine.createSpy().and.returnValue(of(void 0));
}

class TaskStateServiceMock {
  private subject = new BehaviorSubject<Task | null>(null);
  selectedTask$ = this.subject.asObservable();
  setSelectedTask = jasmine.createSpy();
}

class NotificationServiceMock {
  showSuccess = jasmine.createSpy();
  showError = jasmine.createSpy();
}

class ConfirmDialogServiceMock {
  open = jasmine.createSpy().and.returnValue(Promise.resolve(true));
}

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  let taskService: TaskServiceMock;
  let taskStateService: TaskStateServiceMock;
  let confirmDialog: ConfirmDialogServiceMock;

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
    taskService = new TaskServiceMock();
    confirmDialog = new ConfirmDialogServiceMock();
    taskStateService = new TaskStateServiceMock();
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: TaskStateService, useValue: taskStateService },
        { provide: NotificationService, useClass: NotificationServiceMock },
        { provide: ConfirmDialogService, useValue: confirmDialog },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
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
    tick(); // wait for confirm promise (force the execution of the promise)

    expect(confirmDialog.open).toHaveBeenCalled();
    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
  }));

  it('calls onSelectTask when a task is selected', () => {
    component.onSelectTask(mockTasks[0]);
    expect(taskStateService.setSelectedTask).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('onFormSaved calls setSelectedTask and loads tasks', () => {
    spyOn(component, 'loadTasks').and.callThrough();
    component.onFormSaved(mockTasks[0]);
    expect(taskStateService.setSelectedTask).toHaveBeenCalledWith(mockTasks[0]);
    expect(component.loadTasks).toHaveBeenCalled();
    expect(taskService.getTasks).toHaveBeenCalled();
  });

});


