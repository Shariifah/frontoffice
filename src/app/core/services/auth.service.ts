import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { API_BASE_URL, STORAGE_KEYS } from '../tokens';
import {
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  PasswordResetRequestOtpRequest,
  PasswordResetSubmitRequest,
  PasswordResetVerifyOtpRequest,
  PasswordResetVerifyOtpResponse,
  RegisterRequest,
  RegisterResponse,
  RequestOtpRequest,
  RequestOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  UserDto
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly messageService = inject(MessageService);

  private readonly userSignal = signal<UserDto | null>(this.getStoredUser());
  private readonly accessTokenSignal = signal<string | null>(localStorage.getItem(STORAGE_KEYS.accessToken));
  private readonly refreshTokenSignal = signal<string | null>(localStorage.getItem(STORAGE_KEYS.refreshToken));

  readonly isAuthenticated = computed(() => !!this.accessTokenSignal());
  readonly user = computed(() => this.userSignal());

  requestOtp(payload: RequestOtpRequest) {
    return this.http.post<RequestOtpResponse>(`${this.apiBaseUrl}/auth/request-otp`, payload);
  }

  verifyOtp(payload: VerifyOtpRequest) {
    return this.http.post<VerifyOtpResponse>(`${this.apiBaseUrl}/auth/verify-otp`, payload);
  }

  register(payload: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.apiBaseUrl}/auth/register`, payload);
  }

  resendOtp(payload: ResendOtpRequest) {
    return this.http.post<ResendOtpResponse>(`${this.apiBaseUrl}/auth/resend-otp`, payload);
  }

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, payload);
  }

  changePassword(payload: ChangePasswordRequest) {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/change-password`, payload);
  }

  requestPasswordResetOtp(payload: PasswordResetRequestOtpRequest) {
    return this.http.post<RequestOtpResponse>(`${this.apiBaseUrl}/auth/request-password-reset-otp`, payload);
  }

  verifyPasswordResetOtp(payload: PasswordResetVerifyOtpRequest) {
    return this.http.post<PasswordResetVerifyOtpResponse>(`${this.apiBaseUrl}/auth/verify-password-reset-otp`, payload);
  }

  resetPassword(payload: PasswordResetSubmitRequest) {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/reset-password`, payload);
  }

  storeAuth(user: UserDto | null, tokens?: { accessToken: string; refreshToken: string }) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
    this.userSignal.set(user);

    if (tokens) {
      localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
      this.accessTokenSignal.set(tokens.accessToken);
      this.refreshTokenSignal.set(tokens.refreshToken);
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.userSignal.set(null);
    this.messageService.add({ severity: 'info', summary: 'Déconnexion', detail: 'Vous êtes déconnecté.' });
  }

  private getStoredUser(): UserDto | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.user);
      return raw ? (JSON.parse(raw) as UserDto) : null;
    } catch {
      return null;
    }
  }
}


