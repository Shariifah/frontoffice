import { useAuth } from './useAuth'
import { useNotification } from './useNotification'

export const useApiError = () => {
  const { logout } = useAuth()
  const { error } = useNotification()

  const handleApiError = (err: any) => {
    if (err.message === 'Session expirée. Veuillez vous reconnecter.') {
      error('Votre session a expiré. Veuillez vous reconnecter.')
      logout()
      return
    }

    if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
      error('Vous devez être connecté pour effectuer cette action.')
      logout()
      return
    }

    // Afficher l'erreur générique
    error(err.message || 'Une erreur est survenue')
  }

  return {
    handleApiError
  }
}
