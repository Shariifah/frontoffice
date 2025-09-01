import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'
import type { App } from 'vue'

export default function (app: App) {
  // Initialiser l'authentification au démarrage de l'application
  const { initAuth } = useAuth()
  const { error } = useNotification()
  
  // Appeler initAuth de manière asynchrone
  initAuth()
  
  // Ajouter une méthode globale pour vérifier l'authentification
  app.config.globalProperties.$checkAuth = () => {
    const { isAuthenticated } = useAuth()
    return isAuthenticated.value
  }
  
  // Ajouter une méthode globale pour rediriger
  app.config.globalProperties.$redirectToLogin = () => {
    error('Vous devez être connecté pour accéder à cette page')
    window.location.href = '/login'
  }
}
