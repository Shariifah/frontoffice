import { ENV_CONFIG } from './env'

// Configuration API
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  TIMEOUT: ENV_CONFIG.API_TIMEOUT,
  RETRY_ATTEMPTS: 3
}

// Headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REQUEST_OTP: '/auth/request-otp',
    VERIFY_OTP: '/auth/verify-otp',
    REGISTER: '/auth/register',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD_REQUEST_OTP: '/auth/forgotPassword/request-otp',
    FORGOT_PASSWORD_VERIFY_OTP: '/auth/forgotPassword/verify-otp',
    FORGOT_PASSWORD_RESET: '/auth/forgotPassword/reset',
    FORGOT_PASSWORD_RESEND_OTP: '/auth/forgotPassword/resend-otp',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  SUBJECTS: {
    ALL: '/subject/findAll',
    BY_TYPE: '/subject/getByType',
    CREATE: '/subject/create-subject'
  },
  SUBSCRIPTIONS: {
    CREATE: '/subscription/create-subscription',
    USER: '/subscription/findByUser',
    BY_ID: '/subscription/findById',
    CANCEL: '/subscription/delete-subscription',
    UPDATE_STATUS: '/subscription/:subscriptionId/status',
    SIMULATE: '/subscription/simulate'
  },
  TARIFS: {
    ALL: '/tarifSubscription/findAll',
    BY_TYPE: '/tarifSubscription/findByType',
    CREATE: '/tarifSubscription/create-tarif',
    UPDATE: '/tarifSubscription/update-tarif',
    DELETE: '/tarifSubscription/delete-tarif'
  }
}
