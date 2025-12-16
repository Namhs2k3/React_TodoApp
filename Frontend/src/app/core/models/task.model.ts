export interface Task {
  id: number;
  title: string;
  description: string;
  status: number;
  statusName: string;
  dueDate?: string;
  priority: number;
  createdAt: string;
  updatedAt?: string;
}
