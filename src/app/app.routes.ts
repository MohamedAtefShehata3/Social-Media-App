import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { FeedComponent } from './features/feed/feed.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { DetailsComponent } from './features/details/details.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { guestGuard } from './core/auth/guards/guest-guard';
import { authGuard } from './core/auth/guards/auth-guard';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { SavedComponent } from './features/saved/saved.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' },
      { path: 'forget-password', component: ForgetPasswordComponent, title: 'Forget Password' },
    ],
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'feed', component: FeedComponent, title: 'Feed' },
      { path: 'profile', component: ProfileComponent, title: 'My Profile' },
      { path: 'profile/:id', component: ProfileComponent, title: 'Profile' },
      { path: 'notifications', component: NotificationsComponent, title: 'Notifications' },
      { path: 'change-password', component: ChangePasswordComponent, title: 'Change Password' },
      { path: 'details/:id', component: DetailsComponent, title: 'Details' },
      { path: 'saved', component: SavedComponent, title: 'Saved' },
    ],
  },
  { path: '**', component: PageNotFoundComponent, title: ' Not Found Page' },
];
