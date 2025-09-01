# Comparaison des Routes Backend vs Frontend

## 🔍 **Analyse des Incohérences**

### **1. Routes d'Authentification**

#### **Backend (`/api/auth`)**
```typescript
// Inscription
POST /api/auth/request-otp
POST /api/auth/verify-otp  
POST /api/auth/register
POST /api/auth/resend-otp

// Connexion
POST /api/auth/login

// Mot de passe oublié
POST /api/auth/forgotPassword/request-otp
POST /api/auth/forgotPassword/verify-otp
POST /api/auth/forgotPassword/reset
POST /api/auth/forgotPassword/resend-otp

// Changement de mot de passe
POST /api/auth/change-password
```

#### **Frontend (ENDPOINTS.AUTH)**
```typescript
AUTH: {
  LOGIN: '/auth/login',           // ✅ CORRECT
  REFRESH: '/auth/refresh',       // ❌ MANQUANT dans backend
  ME: '/auth/me',                 // ❌ MANQUANT dans backend
  LOGOUT: '/auth/logout'          // ❌ MANQUANT dans backend
}
```

#### **❌ Problèmes Identifiés :**
- `REFRESH`, `ME`, `LOGOUT` n'existent pas dans le backend
- Les routes de mot de passe oublié ne sont pas dans la config frontend

### **2. Routes des Sujets**

#### **Backend (`/api/subject`)**
```typescript
GET /api/subject/findAll
GET /api/subject/getByType/:type
POST /api/subject/create-subject
```

#### **Frontend (ENDPOINTS.SUBJECTS)**
```typescript
SUBJECTS: {
  ALL: '/subjects/findAll',           // ❌ MAUVAIS PATH
  BY_TYPE: '/subjects/getByType',     // ❌ MAUVAIS PATH
  DOWNLOAD: '/subjects/download'      // ❌ N'EXISTE PAS
}
```

#### **❌ Problèmes Identifiés :**
- Backend utilise `/api/subject` (singulier)
- Frontend utilise `/subjects` (pluriel)
- Route `DOWNLOAD` n'existe pas dans le backend

### **3. Routes des Abonnements**

#### **Backend (`/api/subscription`)**
```typescript
POST /api/subscription/create-subscription
GET /api/subscription/findByUser/:userId
GET /api/subscription/findById/:id
DELETE /api/subscription/delete-subscription:id
PATCH /api/subscription/:subscriptionId/status
POST /api/subscription/simulate
```

#### **Frontend (ENDPOINTS.SUBSCRIPTIONS)**
```typescript
SUBSCRIPTIONS: {
  TARIFS: '/subscriptions/tarifs/findAll',      // ❌ MAUVAIS PATH
  USER: '/subscriptions/findByUser',            // ❌ MAUVAIS PATH
  CREATE: '/subscriptions/create-subscription', // ❌ MAUVAIS PATH
  SIMULATE: '/subscriptions/simulate',          // ❌ MAUVAIS PATH
  CANCEL: '/subscriptions/delete-subscription'  // ❌ MAUVAIS PATH
}
```

#### **❌ Problèmes Identifiés :**
- Backend utilise `/api/subscription` (singulier)
- Frontend utilise `/subscriptions` (pluriel)
- Route `TARIFS` pointe vers `/subscriptions/tarifs/findAll` mais les tarifs sont dans `/api/tarifSubscription`

### **4. Routes des Tarifs**

#### **Backend (`/api/tarifSubscription`)**
```typescript
GET /api/tarifSubscription/findAll
GET /api/tarifSubscription/findByType/:type
POST /api/tarifSubscription/create-tarif
PATCH /api/tarifSubscription/update-tarif/:id
DELETE /api/tarifSubscription/delete-tarif/:id
```

#### **Frontend**
```typescript
// ❌ PAS DE CONFIGURATION POUR LES TARIFS
// Utilise SUBSCRIPTIONS.TARIFS qui pointe vers le mauvais endpoint
```

## 🔧 **Corrections Nécessaires**

### **1. Configuration API Frontend Corrigée**

```typescript
// src/config/api.ts
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
    ALL: '/subject/findAll',           // ✅ CORRIGÉ
    BY_TYPE: '/subject/getByType',     // ✅ CORRIGÉ
    CREATE: '/subject/create-subject'  // ✅ AJOUTÉ
  },
  SUBSCRIPTIONS: {
    CREATE: '/subscription/create-subscription',     // ✅ CORRIGÉ
    USER: '/subscription/findByUser',               // ✅ CORRIGÉ
    BY_ID: '/subscription/findById',                // ✅ AJOUTÉ
    CANCEL: '/subscription/delete-subscription',    // ✅ CORRIGÉ
    UPDATE_STATUS: '/subscription/:subscriptionId/status', // ✅ AJOUTÉ
    SIMULATE: '/subscription/simulate'              // ✅ CORRIGÉ
  },
  TARIFS: {
    ALL: '/tarifSubscription/findAll',              // ✅ NOUVEAU
    BY_TYPE: '/tarifSubscription/findByType',       // ✅ NOUVEAU
    CREATE: '/tarifSubscription/create-tarif',      // ✅ NOUVEAU
    UPDATE: '/tarifSubscription/update-tarif',      // ✅ NOUVEAU
    DELETE: '/tarifSubscription/delete-tarif'       // ✅ NOUVEAU
  }
}
```

### **2. Routes Backend Manquantes**

#### **Routes à Ajouter dans le Backend :**
```typescript
// auth.routes.ts - Routes manquantes
router.get("/me", authenticateToken, authController.getMe.bind(authController));
router.post("/refresh", authController.refreshToken.bind(authController));
router.post("/logout", authenticateToken, authController.logout.bind(authController));

// subject.routes.ts - Route manquante
router.get("/download/:id", authenticateToken, subjectController.downloadSubject.bind(subjectController));
```

### **3. Corrections dans les Composables**

#### **useAuth.ts**
```typescript
// Utiliser les nouveaux endpoints
const response = await apiCall<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  body: JSON.stringify({ phonenumber, password }),
})
```

#### **useSubjects.ts**
```typescript
// Utiliser les endpoints corrigés
const response = await apiCall<{ data: Subject[] }>(ENDPOINTS.SUBJECTS.ALL)
const response = await apiCall<{ data: Subject[] }>(`${ENDPOINTS.SUBJECTS.BY_TYPE}/${type}`)
```

#### **useSubscription.ts**
```typescript
// Utiliser les endpoints corrigés
const response = await apiCall<{ data: TarifSubscription[] }>(ENDPOINTS.TARIFS.ALL)
const response = await apiCall<{ data: Subscription[] }>(`${ENDPOINTS.SUBSCRIPTIONS.USER}/${userId}`)
```

## 📋 **Plan de Correction**

### **Étape 1 : Corriger la Configuration Frontend**
1. ✅ Mettre à jour `src/config/api.ts` avec les bons endpoints
2. ✅ Ajouter la section `TARIFS` manquante

### **Étape 2 : Ajouter les Routes Backend Manquantes**
1. ✅ Ajouter `/auth/me`, `/auth/refresh`, `/auth/logout`
2. ✅ Ajouter `/subject/download/:id`

### **Étape 3 : Mettre à Jour les Composables**
1. ✅ Corriger `useAuth.ts` pour utiliser les bons endpoints
2. ✅ Corriger `useSubjects.ts` pour utiliser `/subject/` au lieu de `/subjects/`
3. ✅ Corriger `useSubscription.ts` pour utiliser `/subscription/` au lieu de `/subscriptions/`
4. ✅ Créer `useTarifs.ts` pour gérer les tarifs séparément

### **Étape 4 : Tests**
1. ✅ Tester toutes les routes d'authentification
2. ✅ Tester la récupération des sujets
3. ✅ Tester la gestion des abonnements
4. ✅ Tester la gestion des tarifs

## 🎯 **Résultat Attendu**

Après ces corrections, toutes les routes frontend correspondront exactement aux routes backend, éliminant les erreurs 404 et les problèmes de communication API.
