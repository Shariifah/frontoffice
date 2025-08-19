<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

// Données simulées de progression
const progressData = ref({
  overallProgress: 65,
  coursesCompleted: 3,
  totalCourses: 8,
  exercisesCompleted: 12,
  totalExercises: 20,
  certificatesEarned: 2,
  timeSpent: '24h 30m',
  currentStreak: 7,
})

const courseProgress = ref([
  {
    id: 1,
    title: 'Introduction à la programmation',
    progress: 100,
    status: 'Terminé',
    lastActivity: 'Il y a 2 jours',
  },
  {
    id: 2,
    title: 'Développement Web Frontend',
    progress: 75,
    status: 'En cours',
    lastActivity: 'Aujourd\'hui',
  },
  {
    id: 3,
    title: 'JavaScript Avancé',
    progress: 45,
    status: 'En cours',
    lastActivity: 'Il y a 3 jours',
  },
  {
    id: 4,
    title: 'Base de données SQL',
    progress: 0,
    status: 'Non commencé',
    lastActivity: '-',
  },
])
</script>

<template>
  <div class="progress-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>
              <h2>Ma progression</h2>
            </VCardTitle>
            <VCardText>
              <!-- Statistiques générales -->
              <VRow class="mb-8">
                <VCol
                  cols="12"
                  md="3"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-primary mb-2">
                        {{ progressData.overallProgress }}%
                      </h3>
                      <p class="text-body-2">
                        Progression globale
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="3"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-success mb-2">
                        {{ progressData.coursesCompleted }}/{{ progressData.totalCourses }}
                      </h3>
                      <p class="text-body-2">
                        Cours terminés
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="3"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-warning mb-2">
                        {{ progressData.exercisesCompleted }}/{{ progressData.totalExercises }}
                      </h3>
                      <p class="text-body-2">
                        Exercices complétés
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="3"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-info mb-2">
                        {{ progressData.certificatesEarned }}
                      </h3>
                      <p class="text-body-2">
                        Certificats obtenus
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Progression des cours -->
              <h3 class="text-h5 mb-4">
                Progression des cours
              </h3>
              
              <VRow>
                <VCol
                  v-for="course in courseProgress"
                  :key="course.id"
                  cols="12"
                  md="6"
                >
                  <VCard
                    variant="outlined"
                    class="course-progress-card"
                  >
                    <VCardText>
                      <div class="d-flex justify-space-between align-center mb-3">
                        <h4 class="text-h6">
                          {{ course.title }}
                        </h4>
                        <VChip
                          :color="course.status === 'Terminé' ? 'success' : course.status === 'En cours' ? 'warning' : 'default'"
                          size="small"
                        >
                          {{ course.status }}
                        </VChip>
                      </div>
                      
                      <div class="mb-3">
                        <div class="d-flex justify-space-between align-center mb-1">
                          <span class="text-caption">
                            Progression
                          </span>
                          <span class="text-caption">
                            {{ course.progress }}%
                          </span>
                        </div>
                        <VProgressLinear
                          :model-value="course.progress"
                          :color="course.progress === 100 ? 'success' : 'primary'"
                          height="8"
                          rounded
                        />
                      </div>
                      
                      <div class="d-flex justify-space-between align-center">
                        <span class="text-caption">
                          Dernière activité : {{ course.lastActivity }}
                        </span>
                        <VBtn
                          v-if="course.progress < 100"
                          size="small"
                          color="primary"
                          variant="tonal"
                          :to="`/course/${course.id}`"
                        >
                          Continuer
                        </VBtn>
                        <VBtn
                          v-else
                          size="small"
                          color="success"
                          variant="tonal"
                          :to="`/course/${course.id}`"
                        >
                          Revoir
                        </VBtn>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Statistiques supplémentaires -->
              <VRow class="mt-8">
                <VCol
                  cols="12"
                  md="6"
                >
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Temps d'apprentissage
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-clock"
                          size="24"
                          class="me-3"
                          color="primary"
                        />
                        <div>
                          <h3 class="text-h4">
                            {{ progressData.timeSpent }}
                          </h3>
                          <p class="text-body-2">
                            Temps total passé sur la plateforme
                          </p>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="6"
                >
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Série actuelle
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-flame"
                          size="24"
                          class="me-3"
                          color="warning"
                        />
                        <div>
                          <h3 class="text-h4">
                            {{ progressData.currentStreak }} jours
                          </h3>
                          <p class="text-body-2">
                            Jours consécutifs d'apprentissage
                          </p>
                        </div>
                      </div>
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
.progress-container {
  padding: 2rem 0;
}

.course-progress-card {
  height: 100%;
}
</style>
