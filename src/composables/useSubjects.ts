import { ref, computed, readonly } from 'vue'
import { API_CONFIG, ENDPOINTS } from '@/config/api'
import { useApiError } from './useApiError'

// Types
interface Subject {
  _id: string
  type: 'cours' | 'examen'
  title: string
  filePath: string
  mimeType: string
  createdAt: string
  updatedAt: string
}

interface Question {
  _id: string
  subjectId: string
  text: string
  options: string[]
  correctAnswers: number[]
  createdAt: string
}

// État global
const subjects = ref<Subject[]>([])
const questions = ref<Question[]>([])
const isLoading = ref(false)

export const useSubjects = () => {
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

  // Récupérer tous les sujets
  const fetchAllSubjects = async () => {
    try {
      isLoading.value = true
      const response = await apiCall<{ data: Subject[] }>(ENDPOINTS.SUBJECTS.ALL)
      subjects.value = response.data
      return response.data
    } catch (err) {
      handleApiError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Récupérer les sujets par type
  const fetchSubjectsByType = async (type: 'cours' | 'examen') => {
    try {
      isLoading.value = true
      const response = await apiCall<{ data: Subject[] }>(`${ENDPOINTS.SUBJECTS.BY_TYPE}/${type}`)
      subjects.value = response.data
      return response.data
    } catch (err) {
      handleApiError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Récupérer les questions d'un sujet
  const fetchQuestionsBySubject = async (subjectId: string) => {
    try {
      isLoading.value = true
      const response = await apiCall<{ data: Question[] }>(`/question/questions/${subjectId}`)
      questions.value = response.data
      return response.data
    } catch (err) {
      handleApiError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Computed pour filtrer les sujets
  const coursSubjects = computed(() => 
    subjects.value.filter(subject => subject.type === 'cours')
  )

  const examSubjects = computed(() => 
    subjects.value.filter(subject => subject.type === 'examen')
  )

  return {
    subjects: readonly(subjects),
    questions: readonly(questions),
    isLoading,
    coursSubjects,
    examSubjects,
    fetchAllSubjects,
    fetchSubjectsByType,
    fetchQuestionsBySubject,
  }
}
