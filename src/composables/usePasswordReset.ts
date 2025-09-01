import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from './useNotification'
import { API_CONFIG, ENDPOINTS } from '@/config/api'

// Types pour la réinitialisation de mot de passe
interface PasswordResetStep1Data {
  phonenumber: string
}

interface PasswordResetStep2Data {
  phonenumber: string
  otp: string
}

interface PasswordResetStep3Data {
  otpToken: string
  phonenumber: string
  newPassword: string
  confirmPassword: string
}

interface RequestPasswordResetOtpResponse {
  phonenumber: string
  expiresIn: string
  attemptsRemaining: number
}

interface VerifyPasswordResetOtpResponse {
  otpToken: string
  phonenumber: string
  expiresIn: number
}

interface ResetPasswordResponse {
  message: string
}

interface ResendPasswordResetOtpResponse {
  phonenumber: string
  expiresIn: string
}

// État du processus de réinitialisation
const currentStep = ref(1)
const isLoading = ref(false)
const otpToken = ref<string | null>(null)
const resetData = ref<Partial<PasswordResetStep3Data>>({})

export const usePasswordReset = () => {
  const router = useRouter()
  const { success, error, info } = useNotification()

  // Configuration API
  const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

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

  // ÉTAPE 1 : Demande d'OTP pour réinitialisation
  const requestPasswordResetOtp = async (phonenumber: string): Promise<RequestPasswordResetOtpResponse> => {
    try {
      isLoading.value = true
      
      const response = await apiCall<RequestPasswordResetOtpResponse>('/request-password-reset-otp', {
        method: 'POST',
        body: JSON.stringify({ phonenumber }),
      })

      // Sauvegarder le numéro de téléphone
      resetData.value.phonenumber = phonenumber
      
      success(`Code de réinitialisation envoyé au ${phonenumber}`)
      currentStep.value = 2
      
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
  const verifyPasswordResetOtp = async (otp: string): Promise<VerifyPasswordResetOtpResponse> => {
    try {
      isLoading.value = true
      
      const phonenumber = resetData.value.phonenumber
      if (!phonenumber) {
        throw new Error('Numéro de téléphone manquant')
      }

      const response = await apiCall<VerifyPasswordResetOtpResponse>('/verify-password-reset-otp', {
        method: 'POST',
        body: JSON.stringify({ phonenumber, otp }),
      })

      // Sauvegarder le token OTP
      otpToken.value = response.otpToken
      
      success('Code vérifié avec succès !')
      currentStep.value = 3
      
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Code de vérification incorrect'
      error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ÉTAPE 3 : Réinitialisation du mot de passe
  const resetPassword = async (newPassword: string, confirmPassword: string): Promise<ResetPasswordResponse> => {
    try {
      isLoading.value = true
      
      if (!otpToken.value) {
        throw new Error('Token OTP manquant')
      }

      const phonenumber = resetData.value.phonenumber
      if (!phonenumber) {
        throw new Error('Numéro de téléphone manquant')
      }

      const response = await apiCall<ResetPasswordResponse>('/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          otpToken: otpToken.value,
          phonenumber,
          newPassword,
          confirmPassword,
        }),
      })

      success('Mot de passe réinitialisé avec succès !')
      
      // Rediriger vers la page de connexion
      router.push('/login')
      
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la réinitialisation'
      error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Renvoi d'OTP pour réinitialisation
  const resendPasswordResetOtp = async (): Promise<ResendPasswordResetOtpResponse> => {
    try {
      isLoading.value = true
      
      const phonenumber = resetData.value.phonenumber
      if (!phonenumber) {
        throw new Error('Numéro de téléphone manquant')
      }

      const response = await apiCall<ResendPasswordResetOtpResponse>('/resend-password-reset-otp', {
        method: 'POST',
        body: JSON.stringify({ phonenumber }),
      })

      info('Nouveau code de réinitialisation envoyé')
      
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du renvoi du code'
      error(message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Réinitialiser le processus
  const resetProcess = () => {
    currentStep.value = 1
    otpToken.value = null
    resetData.value = {}
  }

  // Retourner à l'étape précédente
  const goToPreviousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  return {
    // État
    currentStep,
    isLoading,
    otpToken,
    resetData,
    
    // Méthodes
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
    resendPasswordResetOtp,
    resetProcess,
    goToPreviousStep,
  }
}
