import { AddNewTaskRequest } from './AddNewTasks/add-new-task-request';

export interface TaskOperationResponse {
  status: number;
  message: string;
  trackId: string;
  tasksList: AddNewTaskRequest[];
}
