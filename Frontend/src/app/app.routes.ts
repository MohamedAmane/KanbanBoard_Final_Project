import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { BoardComponent } from './components/board/board';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'boards', component: DashboardComponent },
  { path: 'board/:id', component: BoardComponent }, // :id est un paramètre dynamique
];
