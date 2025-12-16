import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Task } from "../models/task.model";
import { environment } from "../../../environments/environment";
import { EzCache } from "ez-state";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  private taskCache = new EzCache<Task[]>([]);

  tasks$ = this.taskCache.value$;
  loading$ = this.taskCache.loading$;
  saving$ = this.taskCache.saving$;
  updating$ = this.taskCache.updating$;
  deleting$ = this.taskCache.deleting$;
  error$ = this.taskCache.error$;

  constructor(private http: HttpClient) {}

  getTasks(): void {
    if (this.taskCache.value.length === 0) {
      this.taskCache.load(
        this.http.get<Task[]>(this.apiUrl).pipe(catchError(this.handleError)),
      );
    }
  }

  getTaskById(id: number): Observable<Task> {
    return this.http
      .get<Task>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createTask(task: Partial<Task>): void {
    this.taskCache.save(
      this.http.post<Task>(this.apiUrl, task).pipe(
        map((newTask) => [...this.taskCache.value, newTask]),
        catchError(this.handleError),
      ),
    );
  }

  updateTask(id: number, task: Partial<Task>): void {
    this.taskCache.update(
      this.http.put<Task>(`${this.apiUrl}/${id}`, { ...task, id }).pipe(
        map((updated) =>
          this.taskCache.value.map((t) => (t.id === id ? updated : t)),
        ),
        catchError(this.handleError),
      ),
    );
  }

  deleteTask(id: number): void {
    this.taskCache.delete(
      this.http.delete(`${this.apiUrl}/${id}`).pipe(
        map(() => this.taskCache.value.filter((t) => t.id !== id)),
        catchError(this.handleError),
      ),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "An unknown error occurred";

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
