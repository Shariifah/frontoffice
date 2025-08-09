export type OtpType = 'registration' | 'password_reset';

export interface UserDto {
  id: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'user' | 'admin';
}

export interface RequestOtpRequest {
  phonenumber: string;
}

export interface RequestOtpResponse {
  phonenumber: string;
  expiresIn: string | Date;
  attemptsRemaining: number;
}

export interface VerifyOtpRequest {
  phonenumber: string;
  otp: string;
}

export interface VerifyOtpResponse {
  otpToken: string;
  phonenumber: string;
  expiresIn: string | Date;
}

export interface RegisterRequest {
  otpToken: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  password: string;
  verifyPassword: string;
}

export interface RegisterResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  expiresIn: number | string;
  tokenType: string;
}

export interface ResendOtpRequest {
  phonenumber: string;
}

export interface ResendOtpResponse {
  phonenumber: string;
  expiresIn: string | Date;
}

export interface LoginRequest {
  phonenumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number | string;
  tokenType: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequestOtpRequest {
  phonenumber: string;
}

export interface PasswordResetVerifyOtpRequest {
  phonenumber: string;
  otp: string;
}

export interface PasswordResetVerifyOtpResponse {
  otpToken: string;
  phonenumber: string;
  expiresIn: string | Date;
}

export interface PasswordResetSubmitRequest {
  otpToken: string;
  phonenumber: string;
  newPassword: string;
  confirmPassword: string;
}


