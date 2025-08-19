import { useAuth } from '@/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
  if (!isAuthenticated.value && to.path !== '/login' && to.path !== '/register' && to.path !== '/forgot-password') {
    // Rediriger vers la page de connexion
    return navigateTo('/login')
  }
  
  // Si l'utilisateur est authentifié et essaie d'accéder aux pages d'auth
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register' || to.path === '/forgot-password')) {
    // Rediriger vers le dashboard
    return navigateTo('/dashboard')
  }
})
