import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from './useNotification'

// Types
interface User {
  id: string
  firstname: string
  lastname: string
  phonenumber: string
  status: string
  role: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

interface RequestOtpResponse {
  phonenumber: string
  expiresIn: string
  attemptsRemaining: number
}

interface VerifyOtpResponse {
  otpToken: string
  phonenumber: string
  expiresIn: number
}

interface ResendOtpResponse {
  phonenumber: string
  expiresIn: string
}

// État global
const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)
const isLoading = ref(false)

// Cookies pour les tokens
const accessTokenCookie = useCookie('accessToken')
const refreshTokenCookie = useCookie('refreshToken')

export const useAuth = () => {
  const router = useRouter()
  const { success, error } = useNotification()

  // Configuration API
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

  // Fonction utilitaire pour les appels API
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${API_BASE_URL}/auth${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const response = await fetch(url, { ...defaultOptions, ...options })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  }

  // LOGIN
  const login = async (phonenumber: string, password: string): Promise<LoginResponse> => {
    try {
      isLoading.value = true
      
      const response = await apiCall<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify({ phonenumber, password }),
      })

      // Stocker les tokens
      accessTokenCookie.value = response.accessToken
      refreshTokenCookie.value = response.refreshToken

      success('Connexion réussie !')
      
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la connexion'
      error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // LOGOUT
  const logout = () => {
    user.value = null
    accessTokenCookie.value = null
    refreshTokenCookie.value = null
    
    success('Déconnexion réussie')
    router.push('/login')
  }

  // Vérifier si l'utilisateur est connecté au démarrage
  const checkAuth = async () => {
    if (accessTokenCookie.value) {
      try {
        // Ici vous pouvez ajouter un appel API pour vérifier le token
        // et récupérer les informations utilisateur
        // Pour l'instant, on suppose que le token est valide
        return true
      } catch (err) {
        logout()
        return false
      }
    }
    return false
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  }
}
