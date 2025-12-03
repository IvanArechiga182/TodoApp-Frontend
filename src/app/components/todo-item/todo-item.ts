import { Component, input } from '@angular/core';
import { TaskModel } from '../../interfaces/tasks/task-model';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {
  tasksList = input<TaskModel[]>();
}
