import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register/request-otp', loadComponent: () => import('./register/request-otp.component').then(m => m.RequestOtpComponent) },
  { path: 'register/verify-otp', loadComponent: () => import('./register/verify-otp.component').then(m => m.VerifyOtpComponent) },
  { path: 'register/submit', loadComponent: () => import('./register/submit-register.component').then(m => m.SubmitRegisterComponent) },
  { path: 'password/request-otp', loadComponent: () => import('./password/request-otp.component').then(m => m.PasswordRequestOtpComponent) },
  { path: 'password/verify-otp', loadComponent: () => import('./password/verify-otp.component').then(m => m.PasswordVerifyOtpComponent) },
  { path: 'password/reset', loadComponent: () => import('./password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'change-password', loadComponent: () => import('./password/change-password.component').then(m => m.ChangePasswordComponent) }
];


