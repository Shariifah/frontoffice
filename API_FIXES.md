# Corrections des Appels API - Bourgeon Learning Platform

## Problèmes Identifiés et Corrigés

### 1. **Imports Manquants dans les Composables**

#### **Problème :**
- `useSubjects.ts` : Import manquant de `API_CONFIG` et `useApiError`
- `useSubscription.ts` : Import manquant de `useApiError`

#### **Solution :**
```typescript
// ✅ Correct
import { API_CONFIG, ENDPOINTS } from '@/config/api'
import { useApiError } from './useApiError'
```

### 2. **Fonctions API Manquantes**

#### **Problème :**
- `useSubjects.ts` : Fonction `apiCall` non définie
- `useSubjects.ts` : Fonction `handleApiError` non importée

#### **Solution :**
```typescript
export const useSubjects = () => {
  const { handleApiError } = useApiError()

  // Fonction utilitaire pour les appels API
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`
    
    // Récupérer le token d'authentification
    const accessToken = useCookie('accessToken').value
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers,
      },
    }

    const response = await fetch(url, { ...defaultOptions, ...options })
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  }
}
```

### 3. **Configuration API Non Centralisée**

#### **Problème :**
- `useRegister.ts` : Utilisation de `process.env.VITE_API_BASE_URL` directement
- `usePasswordReset.ts` : Configuration API locale

#### **Solution :**
```typescript
// ✅ Utiliser la configuration centralisée
import { API_CONFIG, ENDPOINTS } from '@/config/api'

const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  // ...
}
```

### 4. **Endpoints Incohérents**

#### **Problème :**
- Endpoints avec et sans préfixe `/auth`
- Incohérence dans la structure des URLs

#### **Solution :**
```typescript
// ✅ Endpoints cohérents
const response = await apiCall<RequestOtpResponse>('/auth/request-otp', {
  method: 'POST',
  body: JSON.stringify({ phonenumber }),
})
```

## Bonnes Pratiques Implémentées

### 1. **Configuration Centralisée**

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  TIMEOUT: ENV_CONFIG.API_TIMEOUT,
  RETRY_ATTEMPTS: 3
}

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout'
  },
  // ...
}
```

### 2. **Gestion d'Erreurs Centralisée**

```typescript
// src/composables/useApiError.ts
export const useApiError = () => {
  const { logout } = useAuth()
  const { error } = useNotification()

  const handleApiError = (err: any) => {
    if (err.message === 'Session expirée. Veuillez vous reconnecter.') {
      error('Votre session a expiré. Veuillez vous reconnecter.')
      logout()
      return
    }
    // ...
  }
}
```

### 3. **Authentification Automatique**

```typescript
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const accessToken = useCookie('accessToken').value
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
  }
  // ...
}
```

### 4. **Gestion des Timeouts**

```typescript
const response = await fetch(url, { 
  ...defaultOptions, 
  ...options,
  signal: AbortSignal.timeout(30000) // 30 secondes
})
```

## Structure Recommandée pour les Nouveaux Composables

```typescript
import { ref, computed, readonly } from 'vue'
import { API_CONFIG, ENDPOINTS } from '@/config/api'
import { useApiError } from './useApiError'
import { useNotification } from './useNotification'

export const useExample = () => {
  const { handleApiError } = useApiError()
  const { success, error } = useNotification()

  // Fonction utilitaire pour les appels API
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`
    const accessToken = useCookie('accessToken').value
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers,
      },
    }

    const response = await fetch(url, { ...defaultOptions, ...options })
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  }

  // Fonctions métier
  const fetchData = async () => {
    try {
      const response = await apiCall<{ data: any[] }>(ENDPOINTS.EXAMPLE.ALL)
      return response.data
    } catch (err) {
      handleApiError(err)
      throw err
    }
  }

  return {
    fetchData,
    // ...
  }
}
```

## Vérification des Corrections

### ✅ Composables Corrigés :
- [x] `useSubjects.ts` - Imports et fonction apiCall ajoutés
- [x] `useSubscription.ts` - Import useApiError ajouté
- [x] `useRegister.ts` - Configuration centralisée et endpoints corrigés
- [x] `usePasswordReset.ts` - Configuration centralisée et endpoints corrigés

### ✅ Fonctionnalités Vérifiées :
- [x] Authentification automatique avec tokens
- [x] Gestion d'erreurs centralisée
- [x] Configuration API centralisée
- [x] Endpoints cohérents
- [x] Timeouts et gestion des erreurs réseau

## Prochaines Étapes

1. **Tests** : Ajouter des tests unitaires pour vérifier les appels API
2. **Monitoring** : Implémenter un système de logging des erreurs API
3. **Cache** : Ajouter un système de cache pour les données fréquemment utilisées
4. **Retry Logic** : Implémenter une logique de retry pour les appels échoués
5. **Validation** : Ajouter une validation des données reçues du backend
