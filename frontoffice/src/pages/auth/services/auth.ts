import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RequestOtp,
  VerifyOtp,
  RegisterUser,
  ResendOtp,
  LoginData,
  AuthResponse,
} from '../models/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  requestOtp(data: RequestOtp): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-otp`, data);
  }

  verifyOtp(data: VerifyOtp): Observable<{ otpToken: string; expiresIn: string }> {
    return this.http.post(`${this.apiUrl}/verify-otp`, data);
  }

  register(data: RegisterUser): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  resendOtp(data: ResendOtp): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-otp`, data);
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }
}
