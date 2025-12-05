export interface AddNewTaskRequest {
  title: string;
  description: string;
  priority: string;
  status?: string;
  updatedAt?: string;
  dueAt: string;
}
