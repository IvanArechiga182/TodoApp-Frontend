import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { TodoItemList } from '../../components/todo-item-list/todo-item-list';
import { TodoForm } from '../../components/todo-form/todo-form';
@Component({
  selector: 'app-home',
  imports: [TodoItemList, TodoForm],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private auth: AuthService) {}

  showNewTaskModal = signal<boolean>(false);

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

  openFormModal() {
    this.showNewTaskModal.set(true);
  }

  closeFormModal() {
    this.showNewTaskModal.set(false);
  }
}
