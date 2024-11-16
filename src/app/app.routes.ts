import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard], pathMatch: 'full', title: 'Login' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
    title: 'Login',
  },
];
