import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AddNewTaskRequest } from '../../interfaces/tasks/AddNewTasks/add-new-task-request';
import { TaskOperationResponse } from '../../interfaces/tasks/task-operation-response';
import { TaskModel } from '../../interfaces/tasks/task-model';
@Injectable({
  providedIn: 'root',
})
export class TaskOperationsService {
  constructor(private httpClient: HttpClient) {}
  private baseUrl = 'https://localhost:7198/api';

  tasks = signal<TaskModel[]>([]);
  taskToEdit = signal<TaskModel | null>(null);

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

  getUserTasks(userId: number, token: string): Observable<TaskOperationResponse> {
    return this.httpClient.get<TaskOperationResponse>(`${this.baseUrl}/GetTasksList/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  editTask(
    userId: number,
    taskId: number,
    token: string,
    request: AddNewTaskRequest
  ): Observable<TaskOperationResponse> {
    return this.httpClient.put<TaskOperationResponse>(
      `${this.baseUrl}/EditTaskById/${userId}/${taskId}`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  deleteTask(userId: number, taskId: number, token: string): Observable<TaskOperationResponse> {
    return this.httpClient.delete<TaskOperationResponse>(
      `${this.baseUrl}/DeleteTaskById/${userId}/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  setTasks(newTasks: TaskModel[]) {
    this.tasks.set(newTasks);
  }

  addTasks(task: TaskModel[]) {
    this.tasks.update((t) => [...t, ...task]);
  }

  updateTasks(task: TaskModel) {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)));
  }

  setTaskToEdit(task: TaskModel) {
    this.taskToEdit.set(task);
  }

  removeTask(taskId: number) {
    this.tasks.update((t) => t.filter((task) => task.id != taskId));
  }
}
