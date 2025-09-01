# Système d'Authentification - Bourgeon Learning Platform

## Vue d'ensemble

Ce document décrit le système d'authentification JWT et la protection des routes implémentés dans l'application.

## Architecture d'Authentification

### 1. **Composables d'Authentification**

#### `useAuth.ts`
Gère l'authentification utilisateur avec les fonctionnalités suivantes :
- **Login/Logout** : Connexion et déconnexion
- **Token Management** : Gestion des access tokens et refresh tokens
- **Session Validation** : Vérification automatique de la validité des tokens
- **Auto-refresh** : Renouvellement automatique des tokens expirés

**APIs utilisées :**
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Renouvellement de token
- `GET /api/auth/me` - Récupération des infos utilisateur

### 2. **Protection des Routes**

#### Protection par Meta et Composables
Protège les routes avec `unplugin-vue-router` :
- **Meta `requiresAuth: true`** : Marque les pages nécessitant une authentification
- **Vérification dans `onMounted`** : Contrôle l'authentification au chargement de la page
- **Redirection automatique** : Vers `/login` si non authentifié

#### Routes Protégées
- `/dashboard` - Tableau de bord
- `/subjects` - Liste des sujets
- `/subscription` - Gestion des abonnements
- `/performance` - Mesures de performance
- `/profile` - Profil utilisateur
- `/payment` - Paiements

#### Routes Publiques
- `/` - Landing page
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/forgot-password` - Mot de passe oublié

### 3. **Gestion des Erreurs**

#### `useApiError.ts`
Gestion centralisée des erreurs d'API :
- Détection des erreurs 401 (non autorisé)
- Gestion automatique des sessions expirées
- Logout automatique en cas de token invalide

## Configuration des Routes

### Routes Protégées (nécessitent une authentification)
```typescript
definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
  },
})
```

**Pages concernées :**
- `/dashboard` - Tableau de bord
- `/subjects` - Liste des sujets
- `/subscription` - Gestion des abonnements
- `/performance` - Mesures de performance
- `/profile` - Profil utilisateur
- `/payment` - Paiements

### Routes Publiques (redirigent si connecté)
```typescript
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})
```

**Pages concernées :**
- `/` - Landing page
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/forgot-password` - Mot de passe oublié

**Note :** La protection des routes est maintenant gérée par les meta et la vérification dans `onMounted`

## Flux d'Authentification

### 1. **Connexion**
```
1. Utilisateur saisit credentials
2. POST /api/auth/login
3. Stockage des tokens dans les cookies
4. Récupération des infos utilisateur
5. Redirection vers /dashboard
```

### 2. **Vérification de Session**
```
1. Au chargement de l'app
2. Vérification du token dans les cookies
3. Si token présent → GET /api/auth/me
4. Si token expiré → POST /api/auth/refresh
5. Si refresh échoue → Logout
```

### 3. **Protection des Routes**
```
1. Navigation vers une route protégée
2. Vérification dans onMounted de la page
3. Si non authentifié → Redirection /login
4. Si authentifié → Accès autorisé
```

## Sécurité

### **Tokens JWT**
- **Access Token** : Court terme (15-30 min)
- **Refresh Token** : Long terme (7-30 jours)
- Stockage sécurisé dans les cookies HTTP-only
- Validation côté serveur à chaque requête

### **Headers d'Authentification**
```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

### **Gestion des Erreurs**
- **401 Unauthorized** : Token invalide/expiré
- **403 Forbidden** : Permissions insuffisantes
- **500 Server Error** : Erreur serveur

## APIs Backend Requises

### **Endpoints d'Authentification**
```typescript
// Connexion
POST /api/auth/login
Body: { phonenumber: string, password: string }
Response: { accessToken: string, refreshToken: string, user: User }

// Renouvellement de token
POST /api/auth/refresh
Body: { refreshToken: string }
Response: { accessToken: string, refreshToken: string }

// Informations utilisateur
GET /api/auth/me
Headers: { Authorization: 'Bearer <token>' }
Response: { user: User }
```

### **Endpoints Protégés**
Tous les endpoints suivants nécessitent le header `Authorization: Bearer <token>` :

```typescript
// Sujets
GET /api/subjects/findAll
GET /api/subjects/getByType/:type
GET /api/subjects/download/:id

// Abonnements
GET /api/subscriptions/tarifs/findAll
GET /api/subscriptions/findByUser/:userId
POST /api/subscriptions/create-subscription
POST /api/subscriptions/simulate
DELETE /api/subscriptions/delete-subscription/:id
```

## Utilisation

### **Dans un composant**
```typescript
// Vérifier l'authentification
const { isAuthenticated, user } = useAuth()

// Appeler une API protégée
const { fetchAllSubjects } = useSubjects()
const { fetchUserSubscriptions } = useSubscription()

// Gestion d'erreur automatique
const { handleApiError } = useApiError()
```

### **Protection manuelle**
```typescript
// Vérifier avant une action
if (!isAuthenticated.value) {
  router.push('/login')
  return
}

// Appeler l'API
try {
  await fetchData()
} catch (err) {
  handleApiError(err)
}
```

## Tests

### **Scénarios de Test**
1. **Connexion réussie** : Redirection vers dashboard
2. **Token expiré** : Auto-refresh automatique
3. **Refresh échoué** : Logout automatique
4. **Accès route protégée sans auth** : Redirection login
5. **Accès route publique avec auth** : Redirection dashboard

### **Tests de Sécurité**
- Validation des tokens côté serveur
- Protection contre les attaques CSRF
- Gestion sécurisée des cookies
- Logout automatique en cas d'erreur

## Déploiement

### **Variables d'Environnement**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### **Configuration Backend**
- Middleware JWT sur toutes les routes protégées
- Validation des tokens à chaque requête
- Gestion des CORS pour les requêtes cross-origin
- Rate limiting pour prévenir les attaques

## Maintenance

### **Monitoring**
- Logs des tentatives de connexion
- Surveillance des erreurs 401/403
- Métriques de performance des APIs
- Alertes en cas d'anomalies

### **Mises à Jour**
- Rotation des clés JWT
- Mise à jour des politiques de sécurité
- Amélioration de la gestion des erreurs
- Optimisation des performances
