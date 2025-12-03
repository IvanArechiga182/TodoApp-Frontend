export interface AddNewTaskRequest {
  title: string;
  description: string;
  priority: string;
  updatedAt?: string;
  dueAt: string;
}
