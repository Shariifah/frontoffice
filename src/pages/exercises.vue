<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

// Données simulées des exercices
const exercises = ref([
  {
    id: 1,
    title: 'Exercices de programmation de base',
    description: 'Pratiquez les concepts fondamentaux de la programmation',
    category: 'Programmation',
    difficulty: 'Facile',
    duration: '30 min',
    completed: false,
    questions: 10,
  },
  {
    id: 2,
    title: 'Quiz HTML et CSS',
    description: 'Testez vos connaissances en développement frontend',
    category: 'Web',
    difficulty: 'Moyen',
    duration: '45 min',
    completed: true,
    questions: 15,
  },
  {
    id: 3,
    title: 'Problèmes JavaScript',
    description: 'Résolvez des problèmes pratiques avec JavaScript',
    category: 'JavaScript',
    difficulty: 'Difficile',
    duration: '60 min',
    completed: false,
    questions: 20,
  },
  {
    id: 4,
    title: 'Exercices de base de données',
    description: 'Pratiquez les requêtes SQL et la conception de BDD',
    category: 'Base de données',
    difficulty: 'Moyen',
    duration: '40 min',
    completed: false,
    questions: 12,
  },
])
</script>

<template>
  <div class="exercises-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <h2>Exercices pratiques</h2>
              <VBtn
                color="primary"
                variant="outlined"
                to="/courses"
              >
                Voir les cours
              </VBtn>
            </VCardTitle>
            <VCardText>
              <p class="text-body-1 mb-6">
                Renforcez vos connaissances avec nos exercices interactifs et nos quiz.
              </p>
              
              <VRow>
                <VCol
                  v-for="exercise in exercises"
                  :key="exercise.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <VCard
                    variant="outlined"
                    class="exercise-card"
                  >
                    <VCardText>
                      <div class="d-flex align-center justify-space-between mb-4">
                        <VChip
                          :color="exercise.difficulty === 'Facile' ? 'success' : exercise.difficulty === 'Moyen' ? 'warning' : 'error'"
                          size="small"
                        >
                          {{ exercise.difficulty }}
                        </VChip>
                        <VChip
                          v-if="exercise.completed"
                          color="success"
                          size="small"
                        >
                          <VIcon
                            icon="tabler-check"
                            size="12"
                            class="me-1"
                          />
                          Terminé
                        </VChip>
                      </div>
                      
                      <h4 class="text-h6 mb-2">
                        {{ exercise.title }}
                      </h4>
                      
                      <p class="text-body-2 mb-4">
                        {{ exercise.description }}
                      </p>
                      
                      <div class="d-flex align-center justify-space-between mb-4">
                        <div class="d-flex align-center">
                          <VIcon
                            icon="tabler-clock"
                            size="16"
                            class="me-1"
                          />
                          <span class="text-caption">{{ exercise.duration }}</span>
                        </div>
                        
                        <div class="d-flex align-center">
                          <VIcon
                            icon="tabler-help"
                            size="16"
                            class="me-1"
                          />
                          <span class="text-caption">{{ exercise.questions }} questions</span>
                        </div>
                      </div>
                      
                      <VBtn
                        block
                        :color="exercise.completed ? 'success' : 'primary'"
                        variant="tonal"
                        :to="`/exercise/${exercise.id}`"
                      >
                        {{ exercise.completed ? 'Revoir' : 'Commencer' }}
                      </VBtn>
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
.exercises-container {
  padding: 2rem 0;
}

.exercise-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.exercise-card:hover {
  transform: translateY(-4px);
}
</style>
