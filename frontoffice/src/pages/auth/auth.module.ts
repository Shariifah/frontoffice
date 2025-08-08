import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

import { RequestOtp } from './components/request-otp/request-otp';
import { VerifyOtp } from './components/verify-otp/verify-otp';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { ResendOtp } from './components/resend-otp/resend-otp';

// PrimeNG modules
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    InputTextModule,
    ButtonModule,
    ToastModule,

    Register,
    Login,
    ResendOtp,
    VerifyOtp,
    RequestOtp
  ]
})
export class AuthModule {}
