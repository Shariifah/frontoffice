import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from './useNotification'
import { API_CONFIG, ENDPOINTS } from '@/config/api'

// Types pour l'inscription
interface RegisterStep1Data {
  phonenumber: string
}

interface RegisterStep2Data {
  phonenumber: string
  otp: string
}

interface RegisterStep3Data {
  phonenumber: string
  otpToken: string
  firstname: string
  lastname: string
  password: string
  confirmPassword: string
}

interface RequestOtpResponse {
  message: string
  data: {
    phonenumber: string
    expiresIn: string
  }
}

interface VerifyOtpResponse {
  message: string
  data: {
    otpToken: string
    phonenumber: string
    expiresIn: number
  }
}

interface RegisterResponse {
  message: string
  data: {
    user: {
      id: string
      firstname: string
      lastname: string
      phonenumber: string
      status: string
      role: string
    }
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: string
  }
}

interface ResendOtpResponse {
  message: string
  data: {
    phonenumber: string
    expiresIn: string
  }
}

// État du processus d'inscription
const currentStep = ref(0)
const isLoading = ref(false)
const otpToken = ref<string | null>(null)
const registrationData = ref<Partial<RegisterStep3Data>>({})

// Cookies pour les tokens
const accessTokenCookie = useCookie('accessToken')
const refreshTokenCookie = useCookie('refreshToken')

export const useRegister = () => {
  const router = useRouter()
  const { success, error, info } = useNotification()

  // Fonction utilitaire pour les appels API
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`
    console.log('URL de l\'API:', url) // Debug
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    let response: Response
    let data: any = {}
    
    try {
      response = await fetch(url, { 
        ...defaultOptions, 
        ...options,
        // Ajouter un timeout
        signal: AbortSignal.timeout(30000) // 30 secondes
      })
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion.')
      }
      throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.')
    }
    
    // Vérifier si la réponse a du contenu
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text()
        console.log('Réponse API brute:', text) // Debug
        if (text.trim()) {
          data = JSON.parse(text)
        }
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError)
        throw new Error('Réponse invalide du serveur')
      }
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || `Erreur ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return data
  }

  // ÉTAPE 1 : Demande d'OTP pour inscription
  const requestOtp = async (phonenumber: string): Promise<RequestOtpResponse> => {
    try {
      isLoading.value = true
      
      const response = await apiCall<RequestOtpResponse>(ENDPOINTS.AUTH.REQUEST_OTP, {
        method: 'POST',
        body: JSON.stringify({ phonenumber }),
      })

      // Sauvegarder le numéro de téléphone
      registrationData.value.phonenumber = phonenumber
      
      success(`Code de vérification envoyé au ${phonenumber}`)
      currentStep.value = 1
      
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi du code'
      error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ÉTAPE 2 : Vérification de l'OTP
  const verifyOtp = async (otp: string): Promise<VerifyOtpResponse> => {
    try {
      isLoading.value = true
      
      const phonenumber = registrationData.value.phonenumber
      if (!phonenumber) {
        throw new Error('Numéro de téléphone manquant')
      }

      const response = await apiCall<VerifyOtpResponse>(ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify({ phonenumber, otp }),
      })

      // Sauvegarder le token OTP
      otpToken.value = response.data.otpToken
      
      success('Code de vérification validé !')
      currentStep.value = 2
      
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la vérification du code'
      error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ÉTAPE 3 : Inscription finale avec token OTP
  const register = async (userData: Omit<RegisterStep3Data, 'otpToken' | 'phonenumber'>): Promise<RegisterResponse> => {
    try {
      isLoading.value = true
      
      if (!otpToken.value) {
        throw new Error('Token OTP manquant')
      }

      const phonenumber = registrationData.value.phonenumber
      if (!phonenumber) {
        throw new Error('Numéro de téléphone manquant')
      }

      const response = await apiCall<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          otpToken: otpToken.value,
          phonenumber,
          ...userData,
        }),
      })

      // Stocker les tokens
      accessTokenCookie.value = response.data.accessToken
      refreshTokenCookie.value = response.data.refreshToken

      success('Inscription réussie ! Bienvenue !')
      
      // Rediriger vers le dashboard
      router.push('/dashboard')
      
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
      error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Renvoi d'OTP
  const resendOtp = async (): Promise<ResendOtpResponse> => {
    try {
      isLoading.value = true
      
      const phonenumber = registrationData.value.phonenumber
      if (!phonenumber) {
        throw new Error('Numéro de téléphone manquant')
      }

      const response = await apiCall<ResendOtpResponse>(ENDPOINTS.AUTH.RESEND_OTP, {
        method: 'POST',
        body: JSON.stringify({ phonenumber }),
      })

      info('Nouveau code de vérification envoyé')
      
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du renvoi du code'
      error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Réinitialiser le processus d'inscription
  const resetRegistration = () => {
    currentStep.value = 0
    otpToken.value = null
    registrationData.value = {}
  }

  // Retourner à l'étape précédente
  const goToPreviousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  return {
    // État
    currentStep,
    isLoading,
    otpToken,
    registrationData,
    
    // Méthodes
    requestOtp,
    verifyOtp,
    register,
    resendOtp,
    resetRegistration,
    goToPreviousStep,
  }
}
