# Composables d'Authentification

Ce dossier contient les composables pour gérer l'authentification dans l'application Vue.js de la plateforme Bourgeon.

## Composables disponibles

### 1. useNotification

Gère l'affichage des notifications avec Vuetify Snackbar.

```typescript
import { useNotification } from '@/composables/useNotification'

const { success, error, warning, info } = useNotification()

// Exemples d'utilisation
success('Opération réussie !')
error('Une erreur est survenue')
warning('Attention !')
info('Information importante')
```

### 2. useAuth

Gère l'authentification (connexion/déconnexion).

```typescript
import { useAuth } from '@/composables/useAuth'

const { login, logout, isAuthenticated, isLoading, user } = useAuth()

// Connexion
await login('+33612345678', 'password123')

// Déconnexion
logout()

// Vérifier si connecté
if (isAuthenticated.value) {
  // Utilisateur connecté
}
```

### 3. useRegister

Gère le processus d'inscription en 3 étapes avec OTP.

```typescript
import { useRegister } from '@/composables/useRegister'

const {
  currentStep,
  isLoading,
  registrationData,
  requestOtp,
  verifyOtp,
  register,
  resendOtp,
  goToPreviousStep,
  resetRegistration
} = useRegister()

// Étape 1: Demander OTP
await requestOtp('+33612345678')

// Étape 2: Vérifier OTP
await verifyOtp('123456')

// Étape 3: Finaliser l'inscription
await register({
  firstname: 'John',
  lastname: 'Doe',
  password: 'password123',
  verifyPassword: 'password123'
})
```

### 4. usePasswordReset

Gère la réinitialisation de mot de passe en 3 étapes avec OTP.

```typescript
import { usePasswordReset } from '@/composables/usePasswordReset'

const {
  currentStep,
  isLoading,
  resetData,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  resendPasswordResetOtp,
  goToPreviousStep,
  resetProcess
} = usePasswordReset()

// Étape 1: Demander OTP de réinitialisation
await requestPasswordResetOtp('+33612345678')

// Étape 2: Vérifier OTP
await verifyPasswordResetOtp('123456')

// Étape 3: Réinitialiser le mot de passe
await resetPassword('newPassword123', 'newPassword123')
```

## Configuration

### Variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Routes API

Les composables s'attendent à ce que votre backend expose les routes suivantes :

#### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion

#### Inscription
- `POST /auth/request-otp` - Demande d'OTP pour inscription
- `POST /auth/verify-otp` - Vérification OTP
- `POST /auth/register` - Inscription finale
- `POST /auth/resend-otp` - Renvoi d'OTP

#### Réinitialisation de mot de passe
- `POST /auth/request-password-reset-otp` - Demande d'OTP pour réinitialisation
- `POST /auth/verify-password-reset-otp` - Vérification OTP de réinitialisation
- `POST /auth/reset-password` - Réinitialisation du mot de passe
- `POST /auth/resend-password-reset-otp` - Renvoi d'OTP de réinitialisation

## Utilisation dans les composants

### Page de connexion

```vue
<template>
  <VForm @submit.prevent="handleLogin">
    <VTextField v-model="form.phonenumber" label="Téléphone" />
    <VTextField v-model="form.password" type="password" label="Mot de passe" />
    <VBtn type="submit" :loading="isLoading">Se connecter</VBtn>
  </VForm>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { login, isLoading } = useAuth()
const form = ref({ phonenumber: '', password: '' })

const handleLogin = async () => {
  await login(form.value.phonenumber, form.value.password)
}
</script>
```

### Page d'inscription

```vue
<template>
  <!-- Étape 1 -->
  <div v-if="currentStep === 1">
    <VTextField v-model="phonenumber" label="Téléphone" />
    <VBtn @click="handleRequestOtp">Envoyer le code</VBtn>
  </div>

  <!-- Étape 2 -->
  <div v-if="currentStep === 2">
    <VTextField v-model="otp" label="Code OTP" />
    <VBtn @click="handleVerifyOtp">Vérifier</VBtn>
  </div>

  <!-- Étape 3 -->
  <div v-if="currentStep === 3">
    <VTextField v-model="userData.firstname" label="Prénom" />
    <VTextField v-model="userData.lastname" label="Nom" />
    <VTextField v-model="userData.password" type="password" label="Mot de passe" />
    <VBtn @click="handleRegister">S'inscrire</VBtn>
  </div>
</template>

<script setup>
import { useRegister } from '@/composables/useRegister'

const {
  currentStep,
  requestOtp,
  verifyOtp,
  register
} = useRegister()

// Gestion des étapes...
</script>
```

## Gestion des erreurs

Tous les composables gèrent automatiquement l'affichage des erreurs via le système de notifications. Les erreurs sont affichées avec des messages en français et un style d'erreur approprié.

## Stockage des tokens

Les tokens d'authentification sont automatiquement stockés dans les cookies et gérés par le composable `useCookie` de VueUse.

## Sécurité

- Les tokens sont stockés de manière sécurisée dans les cookies
- Validation côté client des formulaires
- Gestion des erreurs réseau
- Protection contre les soumissions multiples
