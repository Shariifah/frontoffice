<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useSubscription } from '@/composables/useSubscription'

definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
  },
})

const { user, isAuthenticated } = useAuth()
const { 
  subscriptions, 
  tarifs, 
  activeSubscription, 
  hasActiveSubscription, 
  isLoading,
  fetchUserSubscriptions, 
  fetchTarifs,
  createSubscription,
  cancelSubscription 
} = useSubscription()

// État local
const isChangingPlan = ref(false)
const selectedNewPlan = ref('')
const showCancelDialog = ref(false)

// Charger les données au montage du composant
onMounted(async () => {
  try {
    if (user.value?.id) {
      await Promise.all([
        fetchUserSubscriptions(user.value.id),
        fetchTarifs()
      ])
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})

// Computed pour les plans disponibles
const availablePlans = computed(() => {
  return tarifs.value.map(tarif => ({
    name: tarif.type.charAt(0).toUpperCase() + tarif.type.slice(1),
    price: `${tarif.price.toLocaleString('fr-FR')} FCFA`,
    period: tarif.type,
    durationInMonths: tarif.durationInMonths,
    features: getPlanFeatures(tarif.type),
    current: activeSubscription.value?.type === tarif.type,
    type: tarif.type
  }))
})

// Fonction pour obtenir les fonctionnalités selon le type
const getPlanFeatures = (type: string) => {
  const features = {
    mensuel: [
      'Accès illimité aux sujets',
      'Téléchargement des PDF',
      'Support par email',
      'Résultats détaillés',
    ],
    trimestriel: [
      'Tout du plan mensuel',
      'Support prioritaire',
      'Analyses de performance',
      'Remise de 10%',
    ],
    semestriel: [
      'Tout du plan trimestriel',
      'Support téléphonique',
      'Rapports personnalisés',
      'Remise de 15%',
    ],
    annuel: [
      'Tout du plan semestriel',
      'Support dédié 24/7',
      'Formation sur mesure',
      'Remise de 25%',
    ]
  }
  return features[type as keyof typeof features] || features.mensuel
}

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Fonction pour obtenir le statut de paiement
const getPaymentStatusColor = (status: string) => {
  const colors = {
    paid: 'success',
    pending: 'warning',
    failed: 'error'
  }
  return colors[status as keyof typeof colors] || 'warning'
}

// Fonction pour obtenir le statut de paiement en français
const getPaymentStatusText = (status: string) => {
  const texts = {
    paid: 'Payé',
    pending: 'En attente',
    failed: 'Échoué'
  }
  return texts[status as keyof typeof texts] || status
}

// Fonction pour créer un nouvel abonnement
const handleCreateSubscription = async (type: string) => {
  try {
    if (!user.value?.id || !user.value?.phonenumber) {
      throw new Error('Informations utilisateur manquantes')
    }
    
    await createSubscription(user.value.id, type, user.value.phonenumber)
    isChangingPlan.value = false
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement:', error)
  }
}

// Fonction pour annuler un abonnement
const handleCancelSubscription = async () => {
  try {
    if (activeSubscription.value?._id) {
      await cancelSubscription(activeSubscription.value._id)
      showCancelDialog.value = false
    }
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'abonnement:', error)
  }
}
</script>

<template>
  <div class="subscription-container">
    <VContainer>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">
            Mon abonnement
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Gérez votre abonnement et vos paiements
          </p>
        </div>
        <VBtn
          color="primary"
          variant="outlined"
          to="/pricing"
        >
          Voir tous les plans
        </VBtn>
      </div>
              <!-- Loading state -->
              <div v-if="isLoading" class="mb-6">
                <VSkeletonLoader
                  type="card"
                  class="mb-4"
                />
              </div>

              <!-- Statut de l'abonnement -->
              <div v-else class="mb-8">
                <div
                  v-if="hasActiveSubscription && activeSubscription"
                  class="subscription-status active"
                >
                  <div class="status-content">
                    <div class="status-info">
                      <h3 class="text-h5 mb-2">
                        Plan {{ activeSubscription.type.charAt(0).toUpperCase() + activeSubscription.type.slice(1) }}
                      </h3>
                      <div class="d-flex align-center gap-4">
                        <VChip
                          :color="getPaymentStatusColor(activeSubscription.paymentStatus)"
                          size="small"
                        >
                          {{ getPaymentStatusText(activeSubscription.paymentStatus) }}
                        </VChip>
                        <span class="text-body-2">
                          {{ activeSubscription.price.toLocaleString('fr-FR') }} FCFA
                        </span>
                      </div>
                      <div class="mt-3">
                        <span class="text-caption text-medium-emphasis">
                          Expire le {{ formatDate(activeSubscription.endDate) }}
                        </span>
                        <VChip
                          :color="new Date(activeSubscription.endDate) > new Date() ? 'success' : 'error'"
                          size="small"
                          class="ms-2"
                        >
                          {{ new Date(activeSubscription.endDate) > new Date() ? 'Actif' : 'Expiré' }}
                        </VChip>
                      </div>
                    </div>
                    <VIcon
                      icon="tabler-crown"
                      size="48"
                      color="primary"
                    />
                  </div>
                </div>
                
                <div
                  v-else
                  class="subscription-status inactive"
                >
                  <div class="status-content">
                    <div class="status-info">
                      <h3 class="text-h5 mb-2">
                        Aucun abonnement actif
                      </h3>
                      <p class="text-body-2 text-medium-emphasis">
                        Vous n'avez pas d'abonnement actif. Choisissez un plan pour commencer.
                      </p>
                    </div>
                    <VIcon
                      icon="tabler-alert-circle"
                      size="48"
                      color="warning"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Détails de l'abonnement -->
              <div v-if="hasActiveSubscription && activeSubscription" class="mb-8">
                <div class="subscription-details">
                  <div class="details-section">
                    <h4 class="text-h6 mb-3">
                      Détails de l'abonnement
                    </h4>
                    <div class="details-grid">
                      <div class="detail-item">
                        <span class="label">Date de début</span>
                        <span class="value">{{ formatDate(activeSubscription.startDate) }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Date de fin</span>
                        <span class="value">{{ formatDate(activeSubscription.endDate) }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Prix</span>
                        <span class="value">{{ activeSubscription.price.toLocaleString('fr-FR') }} FCFA</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Statut</span>
                        <VChip
                          :color="getPaymentStatusColor(activeSubscription.paymentStatus)"
                          size="small"
                        >
                          {{ getPaymentStatusText(activeSubscription.paymentStatus) }}
                        </VChip>
                      </div>
                      <div v-if="activeSubscription.transactionId" class="detail-item">
                        <span class="label">Transaction ID</span>
                        <span class="value text-monospace">{{ activeSubscription.transactionId }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="details-section">
                    <h4 class="text-h6 mb-3">
                      Historique des abonnements
                    </h4>
                    <div class="history-list">
                      <div
                        v-for="subscription in subscriptions.slice(0, 3)"
                        :key="subscription._id"
                        class="history-item"
                      >
                        <div class="history-info">
                          <p class="text-body-2 font-weight-medium mb-0">
                            {{ formatDate(subscription.createdAt) }}
                          </p>
                          <p class="text-caption text-medium-emphasis mb-0">
                            {{ subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1) }}
                          </p>
                        </div>
                        <div class="history-amount">
                          <p class="text-body-2 font-weight-medium mb-0">
                            {{ subscription.price.toLocaleString('fr-FR') }} FCFA
                          </p>
                          <VChip
                            :color="getPaymentStatusColor(subscription.paymentStatus)"
                            size="x-small"
                          >
                            {{ getPaymentStatusText(subscription.paymentStatus) }}
                          </VChip>
                        </div>
                      </div>
                      <VBtn
                        v-if="subscriptions.length > 3"
                        variant="text"
                        color="primary"
                        class="mt-2"
                      >
                        Voir tout l'historique
                      </VBtn>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Plans disponibles -->
              <div class="mb-8">
                <h4 class="text-h6 mb-4">
                  Plans disponibles
                </h4>
                <div class="plans-grid">
                  <div
                    v-for="plan in availablePlans"
                    :key="plan.name"
                    class="plan-card"
                    :class="{ 'current': plan.current }"
                  >
                    <div class="plan-header">
                      <h5 class="text-h6 mb-2">
                        {{ plan.name }}
                      </h5>
                      <h3 class="text-h4 text-primary mb-1">
                        {{ plan.price }}
                      </h3>
                      <p class="text-caption">
                        {{ plan.durationInMonths }} mois
                      </p>
                    </div>
                    
                    <ul class="plan-features">
                      <li
                        v-for="feature in plan.features"
                        :key="feature"
                      >
                        <VIcon
                          icon="tabler-check"
                          size="16"
                          color="success"
                          class="me-2"
                        />
                        {{ feature }}
                      </li>
                    </ul>
                    
                    <VBtn
                      v-if="!plan.current"
                      block
                      color="primary"
                      variant="outlined"
                      :loading="isLoading"
                      @click="handleCreateSubscription(plan.type)"
                    >
                      Choisir ce plan
                    </VBtn>
                    
                    <VBtn
                      v-else
                      block
                      color="success"
                      variant="tonal"
                      disabled
                    >
                      Plan actuel
                    </VBtn>
                  </div>
                </div>
              </div>
              
              <!-- Actions -->
              <div v-if="hasActiveSubscription" class="actions-section">
                <h4 class="text-h6 mb-4">
                  Actions
                </h4>
                <div class="actions-grid">
                  <VBtn
                    color="primary"
                    variant="outlined"
                    to="/payment"
                  >
                    <VIcon
                      icon="tabler-credit-card"
                      class="me-2"
                    />
                    Mettre à jour le paiement
                  </VBtn>
                  
                  <VBtn
                    color="error"
                    variant="outlined"
                    :loading="isLoading"
                    @click="showCancelDialog = true"
                  >
                    <VIcon
                      icon="tabler-x"
                      class="me-2"
                    />
                    Annuler l'abonnement
                  </VBtn>
                </div>
              </div>
    </VContainer>
    
    <!-- Dialog d'annulation d'abonnement -->
    <VDialog
      v-model="showCancelDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle>
          Annuler l'abonnement
        </VCardTitle>
        <VCardText>
          <p class="text-body-1 mb-4">
            Êtes-vous sûr de vouloir annuler votre abonnement ? 
            Cette action est irréversible.
          </p>
          
          <VAlert
            type="warning"
            variant="tonal"
          >
            <template #prepend>
              <VIcon icon="tabler-alert-triangle" />
            </template>
            L'annulation de votre abonnement vous privera de l'accès aux sujets et fonctionnalités premium.
          </VAlert>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="outlined"
            @click="showCancelDialog = false"
          >
            Annuler
          </VBtn>
          <VBtn
            color="error"
            :loading="isLoading"
            @click="handleCancelSubscription"
          >
            Confirmer l'annulation
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.subscription-container {
  padding: 2rem 0;
}

.subscription-status {
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
  margin-bottom: 2rem;
}

.subscription-status.active {
  border-color: rgb(var(--v-theme-primary));
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.subscription-status.inactive {
  border-color: rgb(var(--v-theme-warning));
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.05) 0%, rgba(var(--v-theme-warning), 0.02) 100%);
}

.status-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  flex: 1;
}

.subscription-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.details-section {
  padding: 1.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.value {
  font-weight: 500;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.5);
}

.history-amount {
  text-align: right;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.plan-card {
  padding: 2rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.plan-card.current {
  border-color: rgb(var(--v-theme-primary));
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.plan-header {
  text-align: center;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.plan-features li {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.actions-section {
  margin-top: 2rem;
}

.actions-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .subscription-details {
    grid-template-columns: 1fr;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    flex-direction: column;
  }
  
  .status-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
