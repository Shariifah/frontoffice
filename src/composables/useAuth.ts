import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from './useNotification'
import { API_CONFIG, ENDPOINTS } from '@/config/api'

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

  // Fonction utilitaire pour les appels API
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`
    
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
      
      const response = await apiCall<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
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
        // Appel API pour vérifier le token et récupérer les infos utilisateur
        const response = await apiCall<{ user: User }>(ENDPOINTS.AUTH.ME, {
          headers: {
            'Authorization': `Bearer ${accessTokenCookie.value}`
          }
        })
        
        user.value = response.user
        return true
      } catch (err) {
        // Si le token est invalide, essayer avec le refresh token
        if (refreshTokenCookie.value) {
          try {
            const refreshResponse = await apiCall<LoginResponse>(ENDPOINTS.AUTH.REFRESH, {
              method: 'POST',
              body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
            })
            
            accessTokenCookie.value = refreshResponse.accessToken
            refreshTokenCookie.value = refreshResponse.refreshToken
            
            // Récupérer les infos utilisateur avec le nouveau token
            const userResponse = await apiCall<{ user: User }>(ENDPOINTS.AUTH.ME, {
              headers: {
                'Authorization': `Bearer ${accessTokenCookie.value}`
              }
            })
            
            user.value = userResponse.user
            return true
          } catch (refreshErr) {
            logout()
            return false
          }
        } else {
          logout()
          return false
        }
      }
    }
    return false
  }

  // Initialiser l'utilisateur au démarrage
  const initAuth = async () => {
    await checkAuth()
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    initAuth,
  }
}


