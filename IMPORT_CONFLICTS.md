# Résolution des Conflits d'Imports - Bourgeon Learning Platform

## Problème Identifié

L'application utilise le framework Vuexy qui fournit déjà des composables avec les mêmes noms que ceux que nous avons créés :

- `useAuth` - Conflit entre Vuexy et notre implémentation
- `useNotification` - Conflit entre Vuexy et notre implémentation
- `useRegister` - Conflit entre Vuexy et notre implémentation
- `usePasswordReset` - Conflit entre Vuexy et notre implémentation

## Solution Implémentée

### 1. **Composables Personnalisés Renommés**

Nous avons créé des alias pour nos composables personnalisés :

```typescript
// Dans les fichiers composables eux-mêmes
export const useCustomAuth = useAuth // dans useAuth.ts
export const useCustomNotification = useNotification // dans useNotification.ts

// Dans src/composables/custom.ts
export { useCustomAuth } from './useAuth'
export { useCustomNotification } from './useNotification'
export { useSubjects } from './useSubjects'
export { useSubscription } from './useSubscription'
export { useApiError } from './useApiError'
```

### 2. **Imports Recommandés**

#### **Pour nos composables personnalisés :**
```typescript
// ✅ CORRECT - Utiliser les alias
import { useCustomAuth as useAuth } from '@/composables/useAuth'
import { useCustomNotification as useNotification } from '@/composables/useNotification'
import { useSubjects } from '@/composables/useSubjects'
import { useSubscription } from '@/composables/useSubscription'
import { useApiError } from '@/composables/useApiError'
```

#### **Pour les composables Vuexy :**
```typescript
// ✅ CORRECT - Utiliser les composables Vuexy directement
import { useAuth } from '@/composables' // Vuexy useAuth
import { useNotification } from '@/composables' // Vuexy useNotification
import { useRegister } from '@/composables' // Vuexy useRegister
import { usePasswordReset } from '@/composables' // Vuexy usePasswordReset
```

### 3. **Structure des Fichiers**

```
src/composables/
├── index.ts              # Exports Vuexy + nos composables
├── custom.ts             # Nos composables personnalisés
├── useAuth.ts            # Notre implémentation d'auth
├── useNotification.ts    # Notre implémentation de notification
├── useSubjects.ts        # Gestion des sujets
├── useSubscription.ts    # Gestion des abonnements
└── useApiError.ts        # Gestion des erreurs API
```

## Règles d'Import

### **✅ À FAIRE**

1. **Utiliser les alias pour nos composables :**
   ```typescript
   import { useCustomAuth as useAuth } from '@/composables/useAuth'
   ```

2. **Importer depuis le fichier spécifique :**
   ```typescript
   import { useSubjects } from '@/composables/useSubjects'
   ```

3. **Utiliser les composables Vuexy pour l'UI :**
   ```typescript
   import { useNotification } from '@/composables' // Vuexy
   ```

### **❌ À ÉVITER**

1. **Imports directs sans alias :**
   ```typescript
   // ❌ INCORRECT - Crée des conflits
   import { useAuth } from '@/composables/useAuth'
   ```

2. **Imports depuis l'index sans distinction :**
   ```typescript
   // ❌ INCORRECT - Ambiguïté
   import { useAuth } from '@/composables'
   ```

## Exemples d'Utilisation

### **Dans un Middleware :**
```typescript
import { useCustomAuth as useAuth } from '@/composables/useAuth'
import { useCustomNotification as useNotification } from '@/composables/useNotification'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, initAuth } = useAuth()
  const { error } = useNotification()
  
  // ... logique du middleware
})
```

### **Dans une Page :**
```typescript
<script setup lang="ts">
import { useCustomAuth as useAuth } from '@/composables/useAuth'
import { useSubjects } from '@/composables/useSubjects'
import { useSubscription } from '@/composables/useSubscription'

const { user, isAuthenticated } = useAuth()
const { fetchAllSubjects } = useSubjects()
const { fetchUserSubscriptions } = useSubscription()
</script>
```

### **Dans un Composant :**
```typescript
<script setup lang="ts">
import { useCustomNotification as useNotification } from '@/composables/useNotification'
import { useApiError } from '@/composables/useApiError'

const { success, error } = useNotification()
const { handleApiError } = useApiError()
</script>
```

## Migration des Imports Existants

### **Avant (Problématique) :**
```typescript
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'
```

### **Après (Corrigé) :**
```typescript
import { useCustomAuth as useAuth } from '@/composables/useAuth'
import { useCustomNotification as useNotification } from '@/composables/useNotification'
```

## Vérification

Pour vérifier qu'il n'y a plus de conflits :

1. **Redémarrer le serveur de développement**
2. **Vérifier la console** - Plus d'erreurs de conflits d'imports
3. **Tester les fonctionnalités** - Auth, notifications, etc.

## Maintenance

### **Ajout de Nouveaux Composables**

1. **Créer le fichier** dans `src/composables/`
2. **Ajouter l'export** dans `src/composables/custom.ts`
3. **Utiliser des noms uniques** pour éviter les conflits

### **Mise à Jour des Imports**

1. **Identifier les conflits** dans la console
2. **Utiliser les alias appropriés**
3. **Tester les fonctionnalités**

## Avantages de cette Approche

1. **✅ Pas de conflits** - Chaque composable a un nom unique
2. **✅ Compatibilité** - Fonctionne avec Vuexy et nos composables
3. **✅ Maintenabilité** - Structure claire et organisée
4. **✅ Extensibilité** - Facile d'ajouter de nouveaux composables
5. **✅ Performance** - Pas de duplication de code

## Conclusion

Cette solution permet d'utiliser à la fois les composables Vuexy pour l'interface utilisateur et nos composables personnalisés pour la logique métier, sans conflits d'imports.
