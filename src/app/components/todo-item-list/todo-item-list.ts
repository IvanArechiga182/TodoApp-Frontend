import { Component, output, Output } from '@angular/core';
@Component({
  selector: 'app-todo-item-list',
  imports: [],
  templateUrl: './todo-item-list.html',
  styleUrl: './todo-item-list.scss',
})
export class TodoItemList {
  placeholder = "You don't have any tasks yet!";
  newTask = output<void>();

  openNewTaskModal() {
    this.newTask.emit();
  }

  openModal() {
    console.log('Hola mundo');
  }
}
