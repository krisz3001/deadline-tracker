import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { LandingComponent } from './components/landing/landing.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard], pathMatch: 'full', title: 'Deadline Tracker' },
  {
    path: 'login',
    component: LandingComponent,
    canActivate: [LoginGuard],
    title: 'Login',
  },
];
