import { Component, input, Output, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth-service';
import { getErrorClass as UtilsGetErrorClass } from '../../utils/form-utils';
import { CommonModule } from '@angular/common';
import { TaskOperationsService } from '../../services/tasks/task';
import { TaskOperationResponse } from '../../interfaces/tasks/task-operation-response';
import { AddNewTaskRequest } from '../../interfaces/tasks/AddNewTasks/add-new-task-request';
import { TaskModel } from '../../interfaces/tasks/task-model';
import { format } from 'path';
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
    private fb: FormBuilder
  ) {}

  get authUserId() {
    return this.auth.userId;
  }

  loading = signal<boolean>(false);
  success = signal<boolean>(false);
  formMode = input<string>('create');
  taskToEdit = input<TaskModel | null>(null);

  tasksStatus: string[] = ['JustCreated', 'InProgress', 'WithDependency', 'Closed', 'Cancelled'];
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
    status: new FormControl<string | null>(''),
    dueAt: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnChanges() {
    const statusControl = this.newTaskForm.get('status') as FormControl;

    if (this.formMode() === 'edit') {
      statusControl.addValidators(Validators.required);

      if (this.taskToEdit()) {
        this.newTaskForm.patchValue({
          title: this.taskToEdit()!.title,
          description: this.taskToEdit()!.description,
          priority: this.taskToEdit()!.priority,
          dueAt: this.formatDateForInput(this.taskToEdit()!.dueAt),
          status: this.taskToEdit()!.status,
        });
      }
    } else {
      statusControl.clearValidators();
      statusControl.setValue(null); // opcional
    }

    statusControl.updateValueAndValidity();
  }

  getErrorClass(controlName: string): string {
    return UtilsGetErrorClass(this.newTaskForm, controlName);
  }

  formatDateForInput(dateString: string): string {
    return dateString.split('T')[0];
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

  editTask() {
    if (this.newTaskForm.invalid) {
      this.newTaskForm.markAllAsTouched();
      return;
    }
    const { title, description, priority, status, dueAt } = this.newTaskForm.value;

    const request: AddNewTaskRequest = {
      title: title?.trim()!,
      description: description?.trim()!,
      priority: priority?.trim()!,
      status: status?.trim()!,
      dueAt: dueAt?.trim()!,
    };

    console.log(request);

    const token = this.auth.getUserToken();
    const userId = this.auth.userId()!;
    if (!token?.trim()) {
      return;
    }

    this.taskService.editTask(userId, this.taskToEdit()?.id!, token, request).subscribe({
      next: (response: TaskOperationResponse) => {
        this.taskService.updateTasks(response.taskData);
        this.cancel();
      },
      error: (error) => {
        console.log('Task was not added!');
        console.log(error.error.message);
      },
    });
  }

  submit() {
    if (this.formMode() === 'create') {
      this.addNewTask();
    } else {
      this.editTask();
    }
  }

  cancel() {
    this.close.emit();
  }
}
