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

// KPI Computed
const kpis = computed(() => ({
  totalSubjects: subjects.value.length,
  totalCourses: coursSubjects.value.length,
  totalExams: examSubjects.value.length,
  activeSubscription: hasActiveSubscription.value,
  subscriptionType: activeSubscription.value?.type || 'Aucun',
  daysUntilExpiry: activeSubscription.value 
    ? Math.max(0, Math.ceil((new Date(activeSubscription.value.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0,
  totalSubscriptions: subscriptions.value.length,
  completedSubscriptions: subscriptions.value.filter(sub => sub.paymentStatus === 'paid').length
}))

// Données pour les graphiques ApexCharts
const chartData = computed(() => ({
  subjectsByType: {
    series: [kpis.value.totalCourses, kpis.value.totalExams],
    labels: ['Cours', 'Examens']
  },
  subscriptionStatus: {
    series: [kpis.value.activeSubscription ? 1 : 0, kpis.value.activeSubscription ? 0 : 1],
    labels: ['Actif', 'Inactif']
  }
}))

// Options pour les graphiques ApexCharts
const chartOptions = {
  chart: {
    type: 'donut',
    height: 200
  },
  colors: ['#4CAF50', '#2196F3'],
  labels: ['Cours', 'Examens'],
  legend: {
    show: false
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}

const subscriptionChartOptions = {
  chart: {
    type: 'donut',
    height: 200
  },
  colors: ['#4CAF50', '#FF9800'],
  labels: ['Actif', 'Inactif'],
  legend: {
    show: false
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}

// Fonction pour obtenir l'icône selon le type
const getSubjectIcon = (type: string) => {
  return type === 'cours' ? 'tabler-book' : 'tabler-file-text'
}

// Fonction pour obtenir la couleur selon le type
const getSubjectColor = (type: string) => {
  return type === 'cours' ? 'success' : 'primary'
}

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="dashboard-container">
    <VContainer>
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-h4 font-weight-bold mb-2">
          Tableau de bord
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Bienvenue {{ user?.firstname }}, voici un aperçu de votre activité
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
            <VIcon icon="tabler-book" size="24" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-value">{{ kpis.totalSubjects }}</h3>
            <p class="kpi-label">Total des sujets</p>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon primary">
            <VIcon icon="tabler-file-text" size="24" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-value">{{ kpis.totalCourses }}</h3>
            <p class="kpi-label">Cours disponibles</p>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon warning">
            <VIcon icon="tabler-clipboard-check" size="24" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-value">{{ kpis.totalExams }}</h3>
            <p class="kpi-label">Examens disponibles</p>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" :class="kpis.activeSubscription ? 'success' : 'error'">
            <VIcon icon="tabler-crown" size="24" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-value">{{ kpis.subscriptionType.charAt(0).toUpperCase() + kpis.subscriptionType.slice(1) }}</h3>
            <p class="kpi-label">Abonnement actuel</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section mb-8">
        <div class="charts-grid">
          <div class="chart-card">
            <h4 class="text-h6 mb-4">Répartition des sujets</h4>
            <div class="chart-container">
              <VueApexCharts
                type="donut"
                :options="chartOptions"
                :series="chartData.subjectsByType.series"
                height="200"
              />
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color success"></div>
                <span>Cours ({{ kpis.totalCourses }})</span>
              </div>
              <div class="legend-item">
                <div class="legend-color primary"></div>
                <span>Examens ({{ kpis.totalExams }})</span>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h4 class="text-h6 mb-4">Statut de l'abonnement</h4>
            <div class="chart-container">
              <VueApexCharts
                type="donut"
                :options="subscriptionChartOptions"
                :series="chartData.subscriptionStatus.series"
                height="200"
              />
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color" :class="kpis.activeSubscription ? 'success' : 'warning'"></div>
                <span>{{ kpis.activeSubscription ? 'Actif' : 'Inactif' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Status -->
      <div v-if="hasActiveSubscription && activeSubscription" class="subscription-status-card mb-8">
        <div class="status-header">
          <h4 class="text-h6">Statut de votre abonnement</h4>
          <VChip
            :color="kpis.daysUntilExpiry > 7 ? 'success' : kpis.daysUntilExpiry > 0 ? 'warning' : 'error'"
            size="small"
          >
            {{ kpis.daysUntilExpiry > 0 ? `${kpis.daysUntilExpiry} jours restants` : 'Expiré' }}
          </VChip>
        </div>
        <div class="status-details">
          <div class="status-item">
            <span class="label">Type:</span>
            <span class="value">{{ activeSubscription.type.charAt(0).toUpperCase() + activeSubscription.type.slice(1) }}</span>
          </div>
          <div class="status-item">
            <span class="label">Prix:</span>
            <span class="value">{{ activeSubscription.price.toLocaleString('fr-FR') }} FCFA</span>
          </div>
          <div class="status-item">
            <span class="label">Expire le:</span>
            <span class="value">{{ formatDate(activeSubscription.endDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Subjects -->
      <div class="recent-subjects mb-8">
        <h4 class="text-h6 mb-4">Sujets récents</h4>
        <div class="subjects-list">
          <div
            v-for="subject in subjects.slice(0, 5)"
            :key="subject._id"
            class="subject-item"
          >
            <div class="subject-info">
              <VChip
                :color="getSubjectColor(subject.type)"
                size="small"
                class="me-3"
              >
                <VIcon
                  :icon="getSubjectIcon(subject.type)"
                  size="16"
                  class="me-1"
                />
                {{ subject.type === 'cours' ? 'Cours' : 'Examen' }}
              </VChip>
              <span class="subject-title">{{ subject.title }}</span>
            </div>
            <span class="subject-date">{{ formatDate(subject.createdAt) }}</span>
          </div>
        </div>
        <VBtn
          variant="text"
          color="primary"
          to="/subjects"
          class="mt-3"
        >
          Voir tous les sujets
        </VBtn>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h4 class="text-h6 mb-4">Actions rapides</h4>
        <div class="actions-grid">
          <VBtn
            color="primary"
            variant="outlined"
            to="/subjects"
            class="action-btn"
          >
            <VIcon icon="tabler-book" class="me-2" />
            Consulter les sujets
          </VBtn>
          
          <VBtn
            color="success"
            variant="outlined"
            to="/subscription"
            class="action-btn"
          >
            <VIcon icon="tabler-crown" class="me-2" />
            Gérer l'abonnement
          </VBtn>
          
          <VBtn
            color="info"
            variant="outlined"
            to="/profile"
            class="action-btn"
          >
            <VIcon icon="tabler-user" class="me-2" />
            Mon profil
          </VBtn>
          
          <VBtn
            color="warning"
            variant="outlined"
            to="/support"
            class="action-btn"
          >
            <VIcon icon="tabler-help" class="me-2" />
            Support
          </VBtn>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style scoped>
.dashboard-container {
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

.kpi-icon.error {
  background: linear-gradient(135deg, #F44336, #D32F2F);
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

.charts-section {
  margin-top: 2rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.chart-card {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-color.success {
  background: #4CAF50;
}

.legend-color.primary {
  background: #2196F3;
}

.legend-color.warning {
  background: #FF9800;
}

.subscription-status-card {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border-color: rgb(var(--v-theme-primary));
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.value {
  font-weight: 500;
}

.recent-subjects {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.subjects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subject-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.5);
}

.subject-info {
  display: flex;
  align-items: center;
}

.subject-title {
  font-weight: 500;
}

.subject-date {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.quick-actions {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  height: 48px;
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .status-details {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .subject-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
