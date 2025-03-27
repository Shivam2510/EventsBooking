import { Routes } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { AdminGuard } from './auth/admin.guard';
import { EventListComponent } from './events/event-list/event-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'events', component: EventsComponent, canActivate: [AuthGuard, AdminGuard] }, // Admin only
    { path: 'event-list', component: EventListComponent, canActivate: [AuthGuard] }, // Normal user
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];

