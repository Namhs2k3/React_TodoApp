import { Routes } from "@angular/router";

export const TASKS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/task-list/task-list.component").then(
        (m) => m.TaskListComponent,
      ),
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./components/task-detail/task-detail.component").then(
        (m) => m.TaskDetailComponent,
      ),
  },
];
