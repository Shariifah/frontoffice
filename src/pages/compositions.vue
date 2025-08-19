<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

// Données simulées des compositions
const compositions = ref([
  {
    id: 1,
    subjectTitle: 'Mathématiques - Niveau Terminale',
    subject: 'Mathématiques',
    level: 'Terminale',
    date: '2024-01-15',
    duration: '3 heures',
    score: 85,
    maxScore: 100,
    status: 'Terminé',
    timeSpent: '2h 45m',
    questionsAnswered: 23,
    totalQuestions: 25,
  },
  {
    id: 2,
    subjectTitle: 'Physique-Chimie - Niveau Terminale',
    subject: 'Physique-Chimie',
    level: 'Terminale',
    date: '2024-01-20',
    duration: '3 heures',
    score: 72,
    maxScore: 100,
    status: 'Terminé',
    timeSpent: '2h 30m',
    questionsAnswered: 18,
    totalQuestions: 20,
  },
  {
    id: 3,
    subjectTitle: 'Français - Niveau Terminale',
    subject: 'Français',
    level: 'Terminale',
    date: '2024-01-25',
    duration: '4 heures',
    score: 0,
    maxScore: 100,
    status: 'En cours',
    timeSpent: '1h 15m',
    questionsAnswered: 5,
    totalQuestions: 15,
  },
])

const selectedStatus = ref('')
const selectedSubject = ref('')

const compositionsFilter = computed(() => {
  let filtered = compositions.value

  if (selectedStatus.value) {
    filtered = filtered.filter(c => c.status === selectedStatus.value)
  }

  if (selectedSubject.value) {
    filtered = filtered.filter(c => c.subject === selectedSubject.value)
  }

  return filtered
})

const availableStatuses = computed(() => compositions.value.map(c => c.status).filter((v, i, a) => a.indexOf(v) === i))
const availableSubjects = computed(() => compositions.value.map(c => c.subject).filter((v, i, a) => a.indexOf(v) === i))

const getScoreColor = (score: number) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'error'
}

const getScoreText = (score: number) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Bon'
  if (score > 0) return 'À améliorer'
  return 'Non évalué'
}
</script>

<template>
  <div class="compositions-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <h2>Mes compositions</h2>
              <VBtn
                color="primary"
                variant="outlined"
                to="/subjects"
              >
                Nouvelle composition
              </VBtn>
            </VCardTitle>
            <VCardText>
              <p class="text-body-1 mb-6">
                Consultez l'historique de vos compositions et leurs résultats.
              </p>
              
              <!-- Filtres -->
              <VRow class="mb-6">
                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="selectedStatus"
                    label="Filtrer par statut"
                    :items="availableStatuses"
                    clearable
                    variant="outlined"
                    prepend-inner-icon="tabler-filter"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="selectedSubject"
                    label="Filtrer par matière"
                    :items="availableSubjects"
                    clearable
                    variant="outlined"
                    prepend-inner-icon="tabler-book"
                  />
                </VCol>
              </VRow>
              
              <!-- Liste des compositions -->
              <VRow>
                <VCol
                  v-for="composition in compositionsFilter"
                  :key="composition.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <VCard
                    variant="outlined"
                    class="composition-card"
                  >
                    <VCardText>
                      <div class="d-flex align-center justify-space-between mb-4">
                        <VChip
                          :color="composition.status === 'Terminé' ? 'success' : 'warning'"
                          size="small"
                        >
                          {{ composition.status }}
                        </VChip>
                        <VChip
                          color="primary"
                          size="small"
                        >
                          {{ composition.subject }}
                        </VChip>
                      </div>
                      
                      <h4 class="text-h6 mb-2">
                        {{ composition.subjectTitle }}
                      </h4>
                      
                      <!-- Score -->
                      <div
                        v-if="composition.status === 'Terminé'"
                        class="mb-4"
                      >
                        <div class="d-flex align-center justify-space-between mb-2">
                          <span class="text-caption">
                            Note obtenue
                          </span>
                          <span class="text-caption">
                            {{ composition.score }}/{{ composition.maxScore }}
                          </span>
                        </div>
                        <VProgressLinear
                          :model-value="(composition.score / composition.maxScore) * 100"
                          :color="getScoreColor(composition.score)"
                          height="8"
                          rounded
                        />
                        <div class="d-flex justify-space-between mt-1">
                          <span class="text-caption">
                            {{ getScoreText(composition.score) }}
                          </span>
                          <span class="text-caption font-weight-bold">
                            {{ composition.score }}%
                          </span>
                        </div>
                      </div>
                      
                      <!-- Progression pour les compositions en cours -->
                      <div
                        v-else
                        class="mb-4"
                      >
                        <div class="d-flex align-center justify-space-between mb-2">
                          <span class="text-caption">
                            Progression
                          </span>
                          <span class="text-caption">
                            {{ composition.questionsAnswered }}/{{ composition.totalQuestions }}
                          </span>
                        </div>
                        <VProgressLinear
                          :model-value="(composition.questionsAnswered / composition.totalQuestions) * 100"
                          color="warning"
                          height="8"
                          rounded
                        />
                      </div>
                      
                      <div class="mb-4">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-calendar"
                              size="16"
                              class="me-1"
                            />
                            <span class="text-caption">{{ new Date(composition.date).toLocaleDateString('fr-FR') }}</span>
                          </div>
                          
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-clock"
                              size="16"
                              class="me-1"
                            />
                            <span class="text-caption">{{ composition.timeSpent }}</span>
                          </div>
                        </div>
                        
                        <div class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-school"
                              size="16"
                              class="me-1"
                            />
                            <span class="text-caption">{{ composition.level }}</span>
                          </div>
                          
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-timer"
                              size="16"
                              class="me-1"
                            />
                            <span class="text-caption">{{ composition.duration }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <VBtn
                        v-if="composition.status === 'Terminé'"
                        block
                        color="primary"
                        variant="tonal"
                        :to="`/composition/${composition.id}/result`"
                      >
                        <VIcon
                          icon="tabler-eye"
                          size="16"
                          class="me-2"
                        />
                        Voir les résultats
                      </VBtn>
                      
                      <VBtn
                        v-else
                        block
                        color="warning"
                        variant="tonal"
                        :to="`/composition/${composition.id}`"
                      >
                        <VIcon
                          icon="tabler-pencil"
                          size="16"
                          class="me-2"
                        />
                        Continuer la composition
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Statistiques -->
              <VRow class="mt-8">
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-primary mb-2">
                        {{ compositions.filter(c => c.status === 'Terminé').length }}
                      </h3>
                      <p class="text-body-2">
                        Compositions terminées
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-warning mb-2">
                        {{ compositions.filter(c => c.status === 'En cours').length }}
                      </h3>
                      <p class="text-body-2">
                        Compositions en cours
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-success mb-2">
                        {{ compositions.filter(c => c.status === 'Terminé').reduce((acc, c) => acc + c.score, 0) / compositions.filter(c => c.status === 'Terminé').length || 0 }}%
                      </h3>
                      <p class="text-body-2">
                        Moyenne générale
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped>
.compositions-container {
  padding: 2rem 0;
}

.composition-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.composition-card:hover {
  transform: translateY(-4px);
}
</style>
