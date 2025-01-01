import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'register', component: RegisterFormComponent}
];
