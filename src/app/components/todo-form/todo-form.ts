import { Component, Output, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service';
import { getErrorClass as UtilsGetErrorClass } from '../../utils/form-utils';
import { CommonModule } from '@angular/common';
import { TaskOperationsService } from '../../services/tasks/task';
import { AddNewTaskRequest } from '../../interfaces/tasks/AddNewTasks/add-new-task-request';
import { TaskOperationResponse } from '../../interfaces/tasks/task-operation-response';
import { Router } from '@angular/router';
@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
})
export class TodoForm {
  constructor(
    private auth: AuthService,
    private taskService: TaskOperationsService,
    private router: Router
  ) {}

  get authUserId() {
    return this.auth.userId;
  }

  loading = signal<boolean>(false);
  success = signal<boolean>(false);

  status: string[] = ['Just Created', 'In Progress', 'With Dependency', 'Paused', 'Cancelled'];
  priorityLevels: string[] = ['Low', 'Medium', 'High'];

  close = output<void>();

  newTaskForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)],
    }),
    priority: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dueAt: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  getErrorClass(controlName: string): string {
    return UtilsGetErrorClass(this.newTaskForm, controlName);
  }

  addNewTask() {
    if (this.newTaskForm.invalid) {
      this.newTaskForm.markAllAsTouched();
      return;
    }

    const { title, description, priority, dueAt } = this.newTaskForm.value;

    const request: AddNewTaskRequest = {
      title: title?.trim()!,
      description: description?.trim()!,
      priority: priority?.trim()!,
      dueAt: dueAt?.trim()!,
    };

    const token = this.auth.getUserToken();

    if (!token?.trim()) {
      return;
    }

    this.taskService.addNewTask(request, this.auth.userId()!, token).subscribe({
      next: (response: TaskOperationResponse) => {
        this.taskService.addTasks(response.tasksList);
        this.cancel();
      },
      error: (error) => {
        console.log('Task was not added!');
        console.log(error.error.message);
      },
    });
  }

  cancel() {
    this.close.emit();
  }
}
