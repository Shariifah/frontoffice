import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestOtp } from './components/request-otp/request-otp';
import { VerifyOtp } from './components/verify-otp/verify-otp';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { ResendOtp } from './components/resend-otp/resend-otp';

const routes: Routes = [
  { path: 'request-otp', component: RequestOtp },
  { path: 'verify-otp', component: VerifyOtp },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'resend-otp', component: ResendOtp },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
