<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

// Données simulées des performances
const performanceData = ref({
  totalCompositions: 8,
  completedCompositions: 6,
  averageScore: 78.5,
  bestScore: 95,
  worstScore: 45,
  totalTimeSpent: '18h 30m',
  subjectsAttempted: 4,
  currentStreak: 3,
})

const subjectPerformance = ref([
  {
    subject: 'Mathématiques',
    averageScore: 82,
    compositionsCount: 3,
    bestScore: 95,
    trend: 'up',
  },
  {
    subject: 'Physique-Chimie',
    averageScore: 75,
    compositionsCount: 2,
    bestScore: 88,
    trend: 'stable',
  },
  {
    subject: 'Français',
    averageScore: 70,
    compositionsCount: 2,
    bestScore: 85,
    trend: 'down',
  },
  {
    subject: 'Histoire-Géographie',
    averageScore: 68,
    compositionsCount: 1,
    bestScore: 68,
    trend: 'stable',
  },
])

const monthlyProgress = ref([
  { month: 'Oct', score: 65 },
  { month: 'Nov', score: 72 },
  { month: 'Déc', score: 78 },
  { month: 'Jan', score: 82 },
  { month: 'Fév', score: 79 },
  { month: 'Mar', score: 85 },
])

const recentCompositions = ref([
  {
    id: 1,
    subject: 'Mathématiques',
    date: '2024-03-15',
    score: 85,
    timeSpent: '2h 45m',
  },
  {
    id: 2,
    subject: 'Physique-Chimie',
    date: '2024-03-10',
    score: 72,
    timeSpent: '2h 30m',
  },
  {
    id: 3,
    subject: 'Français',
    date: '2024-03-05',
    score: 78,
    timeSpent: '3h 15m',
  },
])

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'tabler-trending-up'
    case 'down':
      return 'tabler-trending-down'
    default:
      return 'tabler-minus'
  }
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'success'
    case 'down':
      return 'error'
    default:
      return 'info'
  }
}
</script>

<template>
  <div class="performance-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>
              <h2>Mes performances</h2>
            </VCardTitle>
            <VCardText>
              <p class="text-body-1 mb-6">
                Analysez vos performances et suivez votre progression dans chaque matière.
              </p>
              
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
                        {{ performanceData.totalCompositions }}
                      </h3>
                      <p class="text-body-2">
                        Total compositions
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
                        {{ performanceData.averageScore }}%
                      </h3>
                      <p class="text-body-2">
                        Moyenne générale
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
                        {{ performanceData.bestScore }}%
                      </h3>
                      <p class="text-body-2">
                        Meilleure note
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
                        {{ performanceData.totalTimeSpent }}
                      </h3>
                      <p class="text-body-2">
                        Temps total passé
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Performance par matière -->
              <h3 class="text-h5 mb-4">
                Performance par matière
              </h3>
              
              <VRow class="mb-8">
                <VCol
                  v-for="subject in subjectPerformance"
                  :key="subject.subject"
                  cols="12"
                  md="6"
                  lg="3"
                >
                  <VCard
                    variant="outlined"
                    class="subject-performance-card"
                  >
                    <VCardText>
                      <div class="d-flex align-center justify-space-between mb-3">
                        <h4 class="text-h6">
                          {{ subject.subject }}
                        </h4>
                        <VIcon
                          :icon="getTrendIcon(subject.trend)"
                          :color="getTrendColor(subject.trend)"
                          size="20"
                        />
                      </div>
                      
                      <div class="mb-3">
                        <div class="d-flex justify-space-between mb-1">
                          <span class="text-caption">
                            Moyenne
                          </span>
                          <span class="text-caption font-weight-bold">
                            {{ subject.averageScore }}%
                          </span>
                        </div>
                        <VProgressLinear
                          :model-value="subject.averageScore"
                          :color="subject.averageScore >= 80 ? 'success' : subject.averageScore >= 60 ? 'warning' : 'error'"
                          height="8"
                          rounded
                        />
                      </div>
                      
                      <div class="d-flex justify-space-between text-caption">
                        <span>{{ subject.compositionsCount }} compositions</span>
                        <span>Meilleur: {{ subject.bestScore }}%</span>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Graphique de progression -->
              <VRow class="mb-8">
                <VCol cols="12">
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Évolution des performances
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <div class="d-flex align-center justify-space-between">
                        <div
                          v-for="(item, index) in monthlyProgress"
                          :key="index"
                          class="text-center"
                        >
                          <div class="mb-2">
                            <span class="text-caption">{{ item.month }}</span>
                          </div>
                          <div
                            class="progress-bar"
                            :style="{ height: `${item.score * 0.8}px`, backgroundColor: item.score >= 80 ? '#4CAF50' : item.score >= 60 ? '#FF9800' : '#F44336' }"
                          />
                          <div class="mt-1">
                            <span class="text-caption">{{ item.score }}%</span>
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Compositions récentes -->
              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Compositions récentes
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <div
                        v-for="composition in recentCompositions"
                        :key="composition.id"
                        class="d-flex align-center justify-space-between py-2 border-bottom"
                      >
                        <div>
                          <p class="text-body-2 font-weight-medium mb-0">
                            {{ composition.subject }}
                          </p>
                          <p class="text-caption text-medium-emphasis mb-0">
                            {{ new Date(composition.date).toLocaleDateString('fr-FR') }}
                          </p>
                        </div>
                        <div class="text-end">
                          <p class="text-body-2 font-weight-medium mb-0">
                            {{ composition.score }}%
                          </p>
                          <p class="text-caption text-medium-emphasis mb-0">
                            {{ composition.timeSpent }}
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
                        Objectifs et recommandations
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <div class="mb-4">
                        <h5 class="text-h6 mb-2">
                          Objectif mensuel
                        </h5>
                        <VProgressLinear
                          :model-value="75"
                          color="primary"
                          height="12"
                          rounded
                        />
                        <div class="d-flex justify-space-between mt-1">
                          <span class="text-caption">75% atteint</span>
                          <span class="text-caption">Objectif: 80%</span>
                        </div>
                      </div>
                      
                      <div class="mb-4">
                        <h5 class="text-h6 mb-2">
                          Recommandations
                        </h5>
                        <ul class="text-body-2">
                          <li>Continuez à pratiquer les mathématiques</li>
                          <li>Révisez les points faibles en français</li>
                          <li>Essayez de nouveaux sujets d'histoire-géo</li>
                        </ul>
                      </div>
                      
                      <VBtn
                        block
                        color="primary"
                        variant="outlined"
                        to="/subjects"
                      >
                        Nouvelle composition
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
.performance-container {
  padding: 2rem 0;
}

.subject-performance-card {
  height: 100%;
}

.progress-bar {
  width: 30px;
  min-height: 20px;
  border-radius: 4px;
  transition: height 0.3s ease;
}

.border-bottom {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.border-bottom:last-child {
  border-bottom: none;
}
</style>
