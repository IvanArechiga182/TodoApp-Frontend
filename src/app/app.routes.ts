import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { CreateTask } from './pages/create-task/create-task';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './guards/auth-guard';
export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'home',
    component: Home,
    // canActivate: [authGuard],
  },
  {
    path: 'createNewTask',
    component: CreateTask,
    // canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFound,
  },
];
