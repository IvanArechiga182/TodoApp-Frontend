import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { TodoItemList } from '../../components/todo-item-list/todo-item-list';
import { TodoForm } from '../../components/todo-form/todo-form';
import { TaskOperationsService } from '../../services/tasks/task';
import { TaskModel } from '../../interfaces/tasks/task-model';
@Component({
  selector: 'app-home',
  imports: [TodoItemList, TodoForm],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private auth: AuthService, private taskService: TaskOperationsService) {}

  showNewTaskModal = signal<boolean>(false);
  showEditTaskModal = signal<boolean>(false);
  formMode = signal<'create' | 'edit'>('create');
  get authUser() {
    return this.auth.authUser;
  }

  get logOutButtonText() {
    return this.auth.logOut;
  }

  get authUserId() {
    return this.auth.userId;
  }

  get authUserName() {
    return this.auth.username;
  }

  get taskToEdit() {
    return this.taskService.taskToEdit();
  }

  openFormModal() {
    this.formMode.set('create');
    this.showNewTaskModal.set(true);
  }

  openEditTaskModal() {
    this.formMode.set('edit');
    this.showEditTaskModal.set(true);
  }

  closeFormModal() {
    this.showNewTaskModal.set(false);
    this.showEditTaskModal.set(false);
  }
}
