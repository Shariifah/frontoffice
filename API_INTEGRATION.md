# Intégration des APIs - Bourgeon Learning Platform

## Vue d'ensemble

Ce document décrit l'intégration des APIs backend avec le frontend Vue.js pour la plateforme d'apprentissage Bourgeon.

## Composables créés

### 1. `useSubjects.ts`
Gère les sujets et cours avec les APIs suivantes :
- `GET /api/subjects/findAll` - Récupérer tous les sujets
- `GET /api/subjects/getByType/:type` - Récupérer les sujets par type (cours/examen)
- `GET /api/subjects/questions/:subjectId` - Récupérer les questions d'un sujet

**Types :**
```typescript
interface Subject {
  _id: string
  type: 'cours' | 'examen'
  title: string
  filePath: string
  mimeType: string
  createdAt: string
  updatedAt: string
}
```

### 2. `useSubscription.ts`
Gère les abonnements et paiements avec les APIs suivantes :
- `GET /api/subscriptions/tarifs/findAll` - Récupérer tous les tarifs
- `GET /api/subscriptions/findByUser/:userId` - Récupérer les abonnements d'un utilisateur
- `POST /api/subscriptions/create-subscription` - Créer un abonnement
- `POST /api/subscriptions/simulate` - Simuler un paiement
- `DELETE /api/subscriptions/delete-subscription:id` - Annuler un abonnement

**Types :**
```typescript
interface TarifSubscription {
  _id: string
  type: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel'
  price: number
  durationInMonths: number
}

interface Subscription {
  _id: string
  userId: string
  type: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel'
  price: number
  startDate: string
  endDate: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  transactionId?: string
  createdAt: string
  updatedAt: string
}
```

## Pages modifiées

### 1. `pages/subjects.vue`
- ✅ Suppression des données statiques
- ✅ Intégration avec `useSubjects` composable
- ✅ Filtrage par type (cours/examen) et recherche par titre
- ✅ Affichage des états de chargement
- ✅ Vérification de l'abonnement actif pour le téléchargement
- ✅ Gestion des cas où aucun sujet n'est trouvé

### 2. `pages/subscription.vue`
- ✅ Suppression des données statiques
- ✅ Intégration avec `useSubscription` composable
- ✅ Affichage dynamique des tarifs depuis l'API
- ✅ Gestion des abonnements actifs/inactifs
- ✅ Fonctionnalités de création et d'annulation d'abonnement
- ✅ Historique des abonnements
- ✅ États de chargement et gestion d'erreurs

## Configuration

### Variables d'environnement
Créer un fichier `.env` basé sur `env.example` :

```env
# Configuration API
VITE_API_BASE_URL=http://localhost:3000/api

# Configuration de l'application
VITE_APP_TITLE=Bourgeon Learning Platform
VITE_APP_VERSION=1.0.0
```

### Backend requis
Assurez-vous que le backend expose les routes suivantes :

#### Routes des sujets (`/api/subjects`)
- `GET /findAll` - Tous les sujets
- `GET /getByType/:type` - Sujets par type
- `GET /download/:id` - Téléchargement d'un sujet

#### Routes des abonnements (`/api/subscriptions`)
- `GET /tarifs/findAll` - Tous les tarifs
- `GET /findByUser/:userId` - Abonnements utilisateur
- `POST /create-subscription` - Créer un abonnement
- `POST /simulate` - Simuler un paiement
- `DELETE /delete-subscription:id` - Annuler un abonnement

## Fonctionnalités implémentées

### ✅ Sujets et Cours
- [x] Affichage dynamique des sujets depuis l'API
- [x] Filtrage par type (cours/examen)
- [x] Recherche par titre
- [x] Vérification de l'abonnement pour le téléchargement
- [x] États de chargement et gestion d'erreurs

### ✅ Abonnements et Paiements
- [x] Affichage des tarifs dynamiques
- [x] Création d'abonnements
- [x] Annulation d'abonnements
- [x] Historique des abonnements
- [x] Vérification du statut de paiement
- [x] Simulation de paiement

### ✅ Interface utilisateur
- [x] États de chargement avec skeleton loaders
- [x] Messages d'erreur appropriés
- [x] Confirmations pour les actions importantes
- [x] Design responsive et accessible

## Utilisation

### Chargement des données
```typescript
// Dans un composant
const { subjects, isLoading, fetchAllSubjects } = useSubjects()
const { subscriptions, tarifs, fetchUserSubscriptions } = useSubscription()

onMounted(async () => {
  await Promise.all([
    fetchAllSubjects(),
    fetchUserSubscriptions(userId)
  ])
})
```

### Vérification d'abonnement
```typescript
const { hasActiveSubscription, activeSubscription } = useSubscription()

// Vérifier si l'utilisateur peut télécharger
if (hasActiveSubscription.value) {
  // Autoriser le téléchargement
}
```

## Prochaines étapes

1. **Tests** : Ajouter des tests unitaires pour les composables
2. **Cache** : Implémenter un système de cache pour les données
3. **Optimisation** : Lazy loading des sujets et pagination
4. **Sécurité** : Ajouter des tokens d'authentification aux requêtes API
5. **Monitoring** : Ajouter des logs et monitoring des erreurs API
