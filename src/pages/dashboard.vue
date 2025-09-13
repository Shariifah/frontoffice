<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useSubjects } from '@/composables/useSubjects'
import { useSubscription } from '@/composables/useSubscription'

definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
  },
})

const { user, isAuthenticated } = useAuth()
const { subjects, coursSubjects, examSubjects, fetchAllSubjects } = useSubjects()
const { subscriptions, activeSubscription, hasActiveSubscription, fetchUserSubscriptions } = useSubscription()

// État local
const isLoading = ref(false)
const selectedPeriod = ref('month') // week, month, year

// Charger les données au montage du composant
onMounted(async () => {
  try {
    isLoading.value = true
    if (user.value?.id) {
      await Promise.all([
        fetchAllSubjects(),
        fetchUserSubscriptions(user.value.id)
      ])
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    isLoading.value = false
  }
})

// Données simulées pour les performances (à remplacer par de vraies APIs)
const performanceData = ref({
  totalDownloads: 24,
  averageScore: 78.5,
  subjectsCompleted: 12,
  timeSpent: 45, // heures
  weeklyProgress: [65, 72, 68, 85, 78, 82, 90],
  monthlyProgress: [70, 75, 80, 78, 85, 82, 88, 90, 85, 92, 88, 95],
  subjectPerformance: [
    { name: 'Mathématiques', score: 85, downloads: 8 },
    { name: 'Physique-Chimie', score: 78, downloads: 6 },
    { name: 'Français', score: 92, downloads: 5 },
    { name: 'Histoire-Géo', score: 75, downloads: 3 },
    { name: 'Anglais', score: 88, downloads: 4 }
  ]
})

// KPI Computed
const kpis = computed(() => ({
  totalDownloads: performanceData.value.totalDownloads,
  averageScore: performanceData.value.averageScore,
  subjectsCompleted: performanceData.value.subjectsCompleted,
  timeSpent: performanceData.value.timeSpent,
  improvement: 12.5, // % d'amélioration
  rank: 'Top 15%', // Classement
  streak: 7 // Jours consécutifs
}))

// Données pour les graphiques ApexCharts
const chartData = computed(() => {
  const progressData = selectedPeriod.value === 'week' 
    ? performanceData.value.weeklyProgress 
    : performanceData.value.monthlyProgress

  return {
    progressChart: {
      series: [{
        name: 'Score moyen',
        data: progressData
      }],
      categories: selectedPeriod.value === 'week' 
        ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        : ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    },
    subjectChart: {
      series: performanceData.value.subjectPerformance.map(s => s.score),
      labels: performanceData.value.subjectPerformance.map(s => s.name)
    },
    downloadsChart: {
      series: [{
        name: 'Téléchargements',
        data: performanceData.value.subjectPerformance.map(s => s.downloads)
      }],
      categories: performanceData.value.subjectPerformance.map(s => s.name)
    }
  }
})

// Options pour les graphiques ApexCharts
const lineChartOptions = {
  chart: {
    type: 'area',
    height: 300,
    toolbar: {
      show: false
    }
  },
  colors: ['#4CAF50'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 90, 100]
    }
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: chartData.value.progressChart.categories
  },
  yaxis: {
    min: 0,
    max: 100,
    labels: {
      formatter: function(value: number) {
        return value + '%'
      }
    }
  },
  legend: {
    show: false
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        height: 200
      }
    }
  }]
}

const barChartOptions = {
  chart: {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false
    }
  },
  colors: ['#2196F3'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    }
  },
  xaxis: {
    categories: chartData.value.downloadsChart.categories
  },
  yaxis: {
    labels: {
      formatter: function(value: number) {
        return value
      }
    }
  },
  legend: {
    show: false
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        height: 200
      }
    }
  }]
}

const donutChartOptions = {
  chart: {
    type: 'donut',
    height: 300
  },
  colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'],
  labels: chartData.value.subjectChart.labels,
  legend: {
    position: 'bottom'
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        height: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}

// Fonction pour obtenir la couleur selon le score
const getScoreColor = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 70) return 'warning'
  return 'error'
}

// Fonction pour obtenir l'icône selon le score
const getScoreIcon = (score: number) => {
  if (score >= 90) return 'tabler-trophy'
  if (score >= 80) return 'tabler-star'
  if (score >= 70) return 'tabler-trending-up'
  return 'tabler-trending-down'
}
</script>

<template>
  <div class="performance-container">
    <VContainer>
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-h4 font-weight-bold mb-2">
          Mes performances
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Suivez votre progression et vos résultats
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="mb-6">
        <VSkeletonLoader
          type="card"
          class="mb-4"
        />
      </div>

      <!-- KPI Cards -->
      <div v-else class="kpi-grid mb-8">
        <div class="kpi-card">
          <div class="kpi-icon success">
            <VIcon icon="tabler-download" size="24" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-value">{{ kpis.totalDownloads }}</h3>
            <p class="kpi-label">Téléchargements</p>
            <div class="kpi-trend positive">
              <VIcon icon="tabler-trending-up" size="16" />
              <span>+15% ce mois</span>
            </div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon primary">
            <VIcon icon="tabler-chart-line" size="24" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-value">{{ kpis.averageScore }}%</h3>
            <p class="kpi-label">Score moyen</p>
            <div class="kpi-trend positive">
              <VIcon icon="tabler-trending-up" size="16" />
              <span>+{{ kpis.improvement }}%</span>
            </div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon warning">
            <VIcon icon="tabler-book-check" size="24" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-value">{{ kpis.subjectsCompleted }}</h3>
            <p class="kpi-label">Sujets complétés</p>
            <div class="kpi-trend positive">
              <VIcon icon="tabler-trending-up" size="16" />
              <span>+3 cette semaine</span>
            </div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon info">
            <VIcon icon="tabler-clock" size="24" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-value">{{ kpis.timeSpent }}h</h3>
            <p class="kpi-label">Temps d'étude</p>
            <div class="kpi-trend positive">
              <VIcon icon="tabler-trending-up" size="16" />
              <span>+5h ce mois</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Chart -->
      <div class="chart-section mb-8">
        <div class="chart-header">
          <h4 class="text-h6">Évolution des scores</h4>
          <div class="chart-controls">
            <VBtnToggle
              v-model="selectedPeriod"
              mandatory
              size="small"
            >
              <VBtn value="week">Semaine</VBtn>
              <VBtn value="month">Mois</VBtn>
            </VBtnToggle>
          </div>
        </div>
        <div class="chart-card">
          <VueApexCharts
            type="area"
            :options="lineChartOptions"
            :series="chartData.progressChart.series"
            height="300"
          />
        </div>
      </div>

      <!-- Performance by Subject -->
      <div class="performance-grid mb-8">
        <div class="chart-card">
          <h4 class="text-h6 mb-4">Performance par matière</h4>
          <VueApexCharts
            type="donut"
            :options="donutChartOptions"
            :series="chartData.subjectChart.series"
            height="300"
          />
        </div>

        <div class="chart-card">
          <h4 class="text-h6 mb-4">Téléchargements par matière</h4>
          <VueApexCharts
            type="bar"
            :options="barChartOptions"
            :series="chartData.downloadsChart.series"
            height="300"
          />
        </div>
      </div>

      <!-- Subject Performance Details -->
      <div class="subjects-performance mb-8">
        <h4 class="text-h6 mb-4">Détails par matière</h4>
        <div class="subjects-grid">
          <div
            v-for="subject in performanceData.subjectPerformance"
            :key="subject.name"
            class="subject-performance-card"
          >
            <div class="subject-header">
              <h5 class="text-h6">{{ subject.name }}</h5>
              <VChip
                :color="getScoreColor(subject.score)"
                size="small"
              >
                <VIcon
                  :icon="getScoreIcon(subject.score)"
                  size="16"
                  class="me-1"
                />
                {{ subject.score }}%
              </VChip>
            </div>
            <div class="subject-stats">
              <div class="stat-item">
                <span class="label">Téléchargements</span>
                <span class="value">{{ subject.downloads }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Temps moyen</span>
                <span class="value">{{ Math.round(subject.score / 10) }}h</span>
              </div>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: subject.score + '%', backgroundColor: getScoreColor(subject.score) === 'success' ? '#4CAF50' : getScoreColor(subject.score) === 'primary' ? '#2196F3' : getScoreColor(subject.score) === 'warning' ? '#FF9800' : '#F44336' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="achievements-section">
        <h4 class="text-h6 mb-4">Réalisations</h4>
        <div class="achievements-grid">
          <div class="achievement-card">
            <div class="achievement-icon success">
              <VIcon icon="tabler-trophy" size="32" />
            </div>
            <div class="achievement-content">
              <h5 class="text-h6">Excellent étudiant</h5>
              <p class="text-body-2">Score moyen supérieur à 85%</p>
            </div>
          </div>

          <div class="achievement-card">
            <div class="achievement-icon primary">
              <VIcon icon="tabler-flame" size="32" />
            </div>
            <div class="achievement-content">
              <h5 class="text-h6">Série consécutive</h5>
              <p class="text-body-2">{{ kpis.streak }} jours d'étude consécutifs</p>
            </div>
          </div>

          <div class="achievement-card">
            <div class="achievement-icon warning">
              <VIcon icon="tabler-target" size="32" />
            </div>
            <div class="achievement-content">
              <h5 class="text-h6">Objectif atteint</h5>
              <p class="text-body-2">{{ kpis.subjectsCompleted }} sujets complétés</p>
            </div>
          </div>

          <div class="achievement-card">
            <div class="achievement-icon info">
              <VIcon icon="tabler-medal" size="32" />
            </div>
            <div class="achievement-content">
              <h5 class="text-h6">Classement</h5>
              <p class="text-body-2">{{ kpis.rank }} des utilisateurs</p>
            </div>
          </div>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style scoped>
.performance-container {
  padding: 2rem 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease-in-out;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.kpi-icon.success {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.kpi-icon.primary {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.kpi-icon.warning {
  background: linear-gradient(135deg, #FF9800, #F57C00);
}

.kpi-icon.info {
  background: linear-gradient(135deg, #00BCD4, #0097A7);
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.kpi-label {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 0.5rem 0 0 0;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.kpi-trend.positive {
  color: #4CAF50;
}

.kpi-trend.negative {
  color: #F44336;
}

.chart-section {
  margin-top: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-card {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.subjects-performance {
  margin-top: 2rem;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.subject-performance-card {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.2s ease-in-out;
}

.subject-performance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.subject-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.value {
  font-weight: 600;
  font-size: 1.1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.achievements-section {
  margin-top: 2rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease-in-out;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.achievement-icon.success {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.achievement-icon.primary {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.achievement-icon.warning {
  background: linear-gradient(135deg, #FF9800, #F57C00);
}

.achievement-icon.info {
  background: linear-gradient(135deg, #00BCD4, #0097A7);
}

.achievement-content {
  flex: 1;
}

.achievement-content h5 {
  margin: 0 0 0.5rem 0;
}

.achievement-content p {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .performance-grid {
    grid-template-columns: 1fr;
  }
  
  .subjects-grid {
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .subject-stats {
    grid-template-columns: 1fr;
  }
}
</style>
