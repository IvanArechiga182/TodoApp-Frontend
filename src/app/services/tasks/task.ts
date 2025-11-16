import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddNewTaskRequest } from '../../interfaces/tasks/AddNewTasks/add-new-task-request';
import { TaskOperationResponse } from '../../interfaces/tasks/task-operation-response';
@Injectable({
  providedIn: 'root',
})
export class TaskOperationsService {
  constructor(private httpClient: HttpClient) {}
  private baseUrl = 'https://localhost:7198/api';

  addNewTask(
    request: AddNewTaskRequest,
    userId: number,
    token: string
  ): Observable<TaskOperationResponse> {
    return this.httpClient.post<TaskOperationResponse>(
      `${this.baseUrl}/CreateNewTask/${userId}`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
