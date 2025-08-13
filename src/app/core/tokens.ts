import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  factory: () => 'http://localhost:3000/api'
});

export const STORAGE_KEYS = {
  accessToken: 'bourgeon_access_token',
  refreshToken: 'bourgeon_refresh_token',
  user: 'bourgeon_user'
} as const;


