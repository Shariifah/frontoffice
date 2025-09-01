import { ref, computed, readonly } from 'vue'
import { useNotification } from './useNotification'
import { API_CONFIG, ENDPOINTS } from '@/config/api'

// Types
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

interface PaymentResult {
  success: boolean
  transactionId?: string
  message?: string
}

// État global
const subscriptions = ref<Subscription[]>([])
const tarifs = ref<TarifSubscription[]>([])
const isLoading = ref(false)

export const useSubscription = () => {
  const { success } = useNotification()
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
        // Token expiré ou invalide
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  }

  // Récupérer les tarifs d'abonnement
  const fetchTarifs = async () => {
    try {
      isLoading.value = true
      const response = await apiCall<{ data: TarifSubscription[] }>(ENDPOINTS.TARIFS.ALL)
      tarifs.value = response.data
      return response.data
    } catch (err) {
      handleApiError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Récupérer les abonnements d'un utilisateur
  const fetchUserSubscriptions = async (userId: string) => {
    try {
      isLoading.value = true
      const response = await apiCall<{ data: Subscription[] }>(`${ENDPOINTS.SUBSCRIPTIONS.USER}/${userId}`)
      subscriptions.value = response.data
      return response.data
    } catch (err) {
      handleApiError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Créer un abonnement
  const createSubscription = async (userId: string, type: string, phoneNumber: string) => {
    try {
      isLoading.value = true
      const response = await apiCall<{ data: Subscription }>(ENDPOINTS.SUBSCRIPTIONS.CREATE, {
        method: 'POST',
        body: JSON.stringify({ userId, type, phoneNumber }),
      })
      
      // Ajouter le nouvel abonnement à la liste
      subscriptions.value.push(response.data)
      
      success('Abonnement créé avec succès !')
      return response.data
    } catch (err) {
      handleApiError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Simuler un paiement
  const simulatePayment = async (amount: number, phoneNumber: string): Promise<PaymentResult> => {
    try {
      isLoading.value = true
      const response = await apiCall<{ data: PaymentResult }>(ENDPOINTS.SUBSCRIPTIONS.SIMULATE, {
        method: 'POST',
        body: JSON.stringify({ amount, phoneNumber }),
      })
      return response.data
    } catch (err) {
      handleApiError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Annuler un abonnement
  const cancelSubscription = async (subscriptionId: string) => {
    try {
      isLoading.value = true
      await apiCall(`${ENDPOINTS.SUBSCRIPTIONS.CANCEL}/${subscriptionId}`, {
        method: 'DELETE',
      })
      
      // Retirer l'abonnement de la liste
      subscriptions.value = subscriptions.value.filter(sub => sub._id !== subscriptionId)
      
      success('Abonnement annulé avec succès !')
    } catch (err) {
      handleApiError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Computed pour l'abonnement actif
  const activeSubscription = computed(() => {
    const now = new Date()
    return subscriptions.value.find(sub => {
      const endDate = new Date(sub.endDate)
      return sub.paymentStatus === 'paid' && endDate > now
    })
  })

  // Computed pour vérifier si l'utilisateur a un abonnement actif
  const hasActiveSubscription = computed(() => !!activeSubscription.value)

  // Computed pour obtenir le type d'abonnement actif
  const activeSubscriptionType = computed(() => activeSubscription.value?.type)

  return {
    subscriptions: readonly(subscriptions),
    tarifs: readonly(tarifs),
    isLoading,
    activeSubscription,
    hasActiveSubscription,
    activeSubscriptionType,
    fetchTarifs,
    fetchUserSubscriptions,
    createSubscription,
    simulatePayment,
    cancelSubscription,
  }
}
