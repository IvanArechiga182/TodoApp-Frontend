import { Component, output, Output, signal } from '@angular/core';
import { TaskModel } from '../../interfaces/tasks/task-model';
import { TaskOperationsService } from '../../services/tasks/task';
import { AuthService } from '../../services/auth/auth-service';
import { TaskOperationResponse } from '../../interfaces/tasks/task-operation-response';
@Component({
  selector: 'app-todo-item-list',
  imports: [],
  templateUrl: './todo-item-list.html',
  styleUrl: './todo-item-list.scss',
})
export class TodoItemList {
  constructor(public taskService: TaskOperationsService, private auth: AuthService) {}

  placeholder = "You don't have any tasks yet!";
  newTask = output<void>();

  ngOnInit() {
    this.fetchUserTasks();
  }

  openNewTaskModal() {
    this.newTask.emit();
  }

  fetchUserTasks() {
    const userId = this.auth.userId()!;
    const token = this.auth.getUserToken()!;
    this.taskService.getUserTasks(userId, token).subscribe({
      next: (response: TaskOperationResponse) => {
        this.taskService.setTasks(response.tasksList);
      },
      error: (error) => {
        console.log(error.error.message);
        console.log('Fail');
      },
    });
  }

  // editTask(task: TaskModel) {
  //   console.log(task);
  // }

  deleteTask(taskId: number) {
    const userId = this.auth.userId()!;
    const token = this.auth.getUserToken()!;
    this.taskService.deleteTask(userId, taskId, token).subscribe({
      next: () => {
        this.taskService.removeTask(taskId);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}
