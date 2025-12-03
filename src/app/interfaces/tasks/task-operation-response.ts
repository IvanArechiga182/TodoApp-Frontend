import { TaskModel } from './task-model';

export interface TaskOperationResponse {
  status: number;
  message: string;
  trackId: string;
  tasksList: TaskModel[];
}
