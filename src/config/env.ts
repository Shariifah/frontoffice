// Configuration des variables d'environnement
export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // App Configuration
  BASE_URL: process.env.BASE_URL || '/',
  APP_NAME: process.env.VITE_APP_NAME || 'Bourgeon Learning Platform',
  APP_VERSION: process.env.VITE_APP_VERSION || '1.0.0',
  
  // Development Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.VITE_ENABLE_DEBUG === 'true',
  
  // Timeouts
  API_TIMEOUT: parseInt(process.env.VITE_API_TIMEOUT || '10000'),
  SESSION_TIMEOUT: parseInt(process.env.VITE_SESSION_TIMEOUT || '3600000'), // 1 hour
}

// Validation des variables d'environnement requises
export function validateEnvConfig() {
  const requiredVars = [
    'VITE_API_BASE_URL'
  ]
  
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn('Variables d\'environnement manquantes:', missingVars)
  }
  
  return missingVars.length === 0
}

// Export par défaut pour compatibilité
export default ENV_CONFIG
