<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useSubjects } from '@/composables/useSubjects'
import { useSubscription } from '@/composables/useSubscription'
import { API_CONFIG } from '@/config/api'

definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
  },
})

const { user, isAuthenticated } = useAuth()
const { subjects, coursSubjects, examSubjects, isLoading, fetchAllSubjects, fetchSubjectsByType } = useSubjects()
const { hasActiveSubscription } = useSubscription()

// Filtres
const selectedType = ref<'cours' | 'examen'>('cours')
const selectedSubject = ref('')

// Charger les données au montage du composant
onMounted(async () => {
  try {
    await fetchAllSubjects()
  } catch (error) {
    console.error('Erreur lors du chargement des sujets:', error)
  }
})

// Computed pour filtrer les sujets
const subjectsFilter = computed(() => {
  let filtered = selectedType.value === 'cours' ? coursSubjects.value : examSubjects.value

  if (selectedSubject.value) {
    filtered = filtered.filter(s => s.title.toLowerCase().includes(selectedSubject.value.toLowerCase()))
  }

  return filtered
})

// Computed pour les types disponibles
const availableTypes = computed(() => [
  { value: 'cours', label: 'Cours' },
  { value: 'examen', label: 'Examens' }
])

// Computed pour les matières disponibles
const availableSubjects = computed(() => {
  const currentSubjects = selectedType.value === 'cours' ? coursSubjects.value : examSubjects.value
  return [...new Set(currentSubjects.map(s => s.title.split(' - ')[0]))]
})

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  })
}

// Fonction pour obtenir l'icône selon le type
const getSubjectIcon = (type: string) => {
  return type === 'cours' ? 'tabler-book' : 'tabler-file-text'
}

// Fonction pour obtenir la couleur selon le type
const getSubjectColor = (type: string) => {
  return type === 'cours' ? 'primary' : 'success'
}
</script>

<template>
  <div class="subjects-container">
    <VContainer>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">
            Sujets disponibles
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Consultez les sujets disponibles selon votre abonnement
          </p>
        </div>
        <VBtn
          color="primary"
          variant="outlined"
          to="/subscription"
        >
          Vérifier mon abonnement
        </VBtn>
      </div>
              
              <!-- Filtres -->
              <div class="d-flex gap-4 mb-6">
                <VSelect
                  v-model="selectedType"
                  label="Type de contenu"
                  :items="availableTypes"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  prepend-inner-icon="tabler-category"
                  style="min-width: 200px;"
                />
                <VTextField
                  v-model="selectedSubject"
                  label="Rechercher par titre"
                  placeholder="Ex: Mathématiques, Physique..."
                  variant="outlined"
                  prepend-inner-icon="tabler-search"
                  clearable
                  style="flex: 1;"
                />
              </div>
              
              <!-- Loading state -->
              <div v-if="isLoading" class="d-flex flex-wrap gap-4">
                <VSkeletonLoader
                  v-for="i in 6"
                  :key="i"
                  type="card"
                  class="subject-card"
                  style="width: 300px; height: 200px;"
                />
              </div>

              <!-- Liste des sujets -->
              <div v-else>
                <div
                  v-if="subjectsFilter.length === 0"
                  class="text-center py-12"
                >
                  <VIcon
                    icon="tabler-file-off"
                    size="64"
                    color="disabled"
                    class="mb-4"
                  />
                  <h4 class="text-h6 text-medium-emphasis">
                    Aucun sujet trouvé
                  </h4>
                  <p class="text-body-2 text-medium-emphasis">
                    Aucun {{ selectedType }} ne correspond à votre recherche.
                  </p>
                </div>

                <div class="d-flex flex-wrap gap-4">
                  <div
                    v-for="subject in subjectsFilter"
                    :key="subject._id"
                    class="subject-card"
                  >
                    <div class="subject-header">
                      <VChip
                        :color="getSubjectColor(subject.type)"
                        size="small"
                      >
                        <VIcon
                          :icon="getSubjectIcon(subject.type)"
                          size="16"
                          class="me-1"
                        />
                        {{ subject.type === 'cours' ? 'Cours' : 'Examen' }}
                      </VChip>
                      <span class="text-caption text-medium-emphasis">
                        {{ formatDate(subject.createdAt) }}
                      </span>
                    </div>
                    
                    <h4 class="subject-title">
                      {{ subject.title }}
                    </h4>
                    
                    <div class="subject-actions">
                      <VBtn
                        v-if="hasActiveSubscription"
                        color="primary"
                        variant="tonal"
                        size="small"
                        :href="`${API_CONFIG.BASE_URL}/subjects/download/${subject._id}`"
                        target="_blank"
                      >
                        <VIcon
                          icon="tabler-download"
                          size="16"
                          class="me-2"
                        />
                        Télécharger
                      </VBtn>
                      
                      <VBtn
                        v-else
                        color="warning"
                        variant="tonal"
                        size="small"
                        to="/subscription"
                      >
                        <VIcon
                          icon="tabler-crown"
                          size="16"
                          class="me-2"
                        />
                        Abonnement requis
                      </VBtn>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Informations importantes -->
              <div class="mt-8 p-4 bg-info-lighten-5 rounded-lg border border-info-lighten-3">
                <div class="d-flex align-center">
                  <VIcon
                    icon="tabler-info-circle"
                    size="24"
                    color="info"
                    class="me-3"
                  />
                  <div>
                    <h5 class="text-h6 mb-2">
                      Informations importantes
                    </h5>
                    <ul class="text-body-2 mb-0">
                      <li>Les sujets sont disponibles au format PDF</li>
                      <li>Un abonnement actif est requis pour télécharger les documents</li>
                      <li>Les cours et examens sont mis à jour régulièrement</li>
                      <li>Assurez-vous que votre abonnement est actif</li>
                    </ul>
                  </div>
                </div>
              </div>


    </VContainer>
  </div>
</template>

<style scoped>
.subjects-container {
  padding: 2rem 0;
}

.subject-card {
  width: 300px;
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subject-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgb(var(--v-theme-primary));
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subject-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  flex: 1;
}

.subject-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .subject-card {
    width: 100%;
  }
  
  .d-flex.gap-4 {
    flex-direction: column;
  }
}
</style>
