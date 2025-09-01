<script setup lang="ts">
import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'
import { useConfigStore } from '@core/stores/config'
import { useSubscription } from '@/composables/useSubscription'
import { useAuth } from '@/composables/useAuth'
import laptopGirl from '@images/illustrations/laptop-girl.png'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const store = useConfigStore()
const { tarifs, isLoading, fetchTarifs, createSubscription } = useSubscription()
const { user } = useAuth()

store.skin = 'default'

// Charger les tarifs du backend
onMounted(async () => {
  try {
    await fetchTarifs()
  } catch (error) {
    console.error('Erreur lors du chargement des tarifs:', error)
  }
})

// Fonction pour obtenir les fonctionnalités selon le type
const getPlanFeatures = (type: string) => {
  const features = {
    gratuit: [
      'Accès à 3 sujets par mois',
      'Consultation des cours',
      'Support communautaire',
      'Accès limité aux exercices',
    ],
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
  return features[type as keyof typeof features] || features.gratuit
}

// Computed pour les plans disponibles
const availablePlans = computed(() => {
  // Plan gratuit
  const freePlan = {
    name: 'Gratuit',
    price: 0,
    period: 'gratuit',
    durationInMonths: 1,
    features: getPlanFeatures('gratuit'),
    type: 'gratuit',
    popular: false,
    isFree: true
  }
  
  // Plans payants du backend
  const paidPlans = tarifs.value.map(tarif => ({
    name: tarif.type.charAt(0).toUpperCase() + tarif.type.slice(1),
    price: tarif.price,
    period: tarif.type,
    durationInMonths: tarif.durationInMonths,
    features: getPlanFeatures(tarif.type),
    type: tarif.type,
    popular: tarif.type === 'trimestriel', // Marquer le plan trimestriel comme populaire
    isFree: false
  }))
  
  return [freePlan, ...paidPlans]
})

// Fonction pour créer un abonnement
const handleCreateSubscription = async (type: string) => {
  try {
    // Si c'est le plan gratuit, rediriger directement vers le dashboard
    if (type === 'gratuit') {
      if (!user.value?.id) {
        // Rediriger vers la page de connexion si pas connecté
        window.location.href = '/login'
        return
      }
      // Rediriger vers le dashboard pour le plan gratuit
      window.location.href = '/dashboard'
      return
    }
    
    if (!user.value?.id || !user.value?.phonenumber) {
      // Rediriger vers la page de connexion si pas connecté
      window.location.href = '/login'
      return
    }
    
    await createSubscription(user.value.id, type, user.value.phonenumber)
    // Rediriger vers la page d'abonnement après création
    window.location.href = '/subscription'
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement:', error)
  }
}

</script>

<template>
  <div class="pricing-page">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <VContainer class="hero-section">
      <div class="text-center py-16">
        <h1 class="text-h2 font-weight-bold mb-4">
          Nos Plans d'Abonnement
        </h1>
        <p class="text-h6 text-medium-emphasis mb-8">
          Choisissez le plan qui vous convient le mieux pour accéder à tous nos contenus
        </p>
        <p class="text-body-1">
          Garantie de remboursement de 48 heures • Support 24/7 • Accès immédiat
        </p>
      </div>
    </VContainer>

    <!-- Plans Section -->
    <VContainer class="plans-section">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-16">
        <VProgressCircular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="text-h6 mt-4">Chargement des plans...</p>
      </div>

      <!-- Plans Grid -->
      <div v-else class="plans-grid">
        <div
          v-for="plan in availablePlans"
          :key="plan.type"
          class="plan-card"
          :class="{ 'popular': plan.popular }"
        >
          <!-- Badge populaire -->
          <div v-if="plan.popular" class="popular-badge">
            <VChip
              color="primary"
              size="small"
              class="popular-chip"
            >
              <VIcon icon="tabler-star" size="16" class="me-1" />
              Populaire
            </VChip>
          </div>

          <!-- Plan Header -->
          <div class="plan-header">
            <h3 class="text-h5 font-weight-bold mb-2">
              {{ plan.name }}
            </h3>
            <div class="price-section">
              <span v-if="plan.isFree" class="price free">Gratuit</span>
              <span v-else class="price">{{ plan.price.toLocaleString('fr-FR') }}</span>
              <span v-if="!plan.isFree" class="currency">FCFA</span>
            </div>
            <p class="text-body-2 text-medium-emphasis">
              {{ plan.durationInMonths }} mois d'accès
            </p>
          </div>

          <!-- Features List -->
          <div class="features-section">
            <ul class="features-list">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="feature-item"
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
          </div>

          <!-- CTA Button -->
          <div class="plan-footer">
            <VBtn
              block
              :color="plan.isFree ? 'success' : (plan.popular ? 'primary' : 'primary')"
              :variant="plan.isFree ? 'flat' : (plan.popular ? 'flat' : 'outlined')"
              size="large"
              :loading="isLoading"
              @click="handleCreateSubscription(plan.type)"
            >
              {{ plan.isFree ? 'Commencer gratuitement' : 'Choisir ce plan' }}
            </VBtn>
          </div>
        </div>
      </div>

      <!-- Message si aucun plan -->
      <div v-if="!isLoading && availablePlans.length === 0" class="text-center py-16">
        <VIcon
          icon="tabler-package-off"
          size="64"
          color="warning"
          class="mb-4"
        />
        <h3 class="text-h5 mb-2">Aucun plan disponible</h3>
        <p class="text-body-1 text-medium-emphasis">
          Les plans d'abonnement ne sont pas disponibles pour le moment.
        </p>
      </div>
    </VContainer>

    <!-- FAQ Section -->
    <VContainer class="faq-section">
      <div class="text-center mb-12">
        <h2 class="text-h4 font-weight-bold mb-4">
          Questions Fréquentes
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          Trouvez les réponses aux questions les plus courantes
        </p>
      </div>

      <VRow>
        <VCol cols="12" md="6">
          <div class="faq-item">
            <h4 class="text-h6 mb-2">Comment puis-je changer de plan ?</h4>
            <p class="text-body-2">
              Vous pouvez changer de plan à tout moment depuis votre espace abonnement.
            </p>
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <div class="faq-item">
            <h4 class="text-h6 mb-2">Puis-je annuler mon abonnement ?</h4>
            <p class="text-body-2">
              Oui, vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires.
            </p>
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <div class="faq-item">
            <h4 class="text-h6 mb-2">Y a-t-il une garantie de remboursement ?</h4>
            <p class="text-body-2">
              Nous offrons une garantie de remboursement de 48 heures sur tous nos plans.
            </p>
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <div class="faq-item">
            <h4 class="text-h6 mb-2">Quels moyens de paiement acceptez-vous ?</h4>
            <p class="text-body-2">
              Nous acceptons les paiements par mobile money et carte bancaire.
            </p>
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <div class="faq-item">
            <h4 class="text-h6 mb-2">Le plan gratuit est-il vraiment gratuit ?</h4>
            <p class="text-body-2">
              Oui, le plan gratuit vous donne accès à 3 sujets par mois sans aucun coût. Aucune carte bancaire requise.
            </p>
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <div class="faq-item">
            <h4 class="text-h6 mb-2">Puis-je passer du plan gratuit au plan payant ?</h4>
            <p class="text-body-2">
              Absolument ! Vous pouvez à tout moment passer à un plan payant pour accéder à plus de contenu.
            </p>
          </div>
        </VCol>
      </VRow>
    </VContainer>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.pricing-page {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.02) 0%, rgba(var(--v-theme-surface), 1) 100%);
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border-radius: 0 0 2rem 2rem;
}

.plans-section {
  padding: 4rem 0;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.plan-card {
  position: relative;
  padding: 2.5rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.plan-card.popular {
  border-color: rgb(var(--v-theme-primary));
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  transform: scale(1.05);
}

.plan-card.popular:hover {
  transform: scale(1.05) translateY(-8px);
}

.popular-badge {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.popular-chip {
  border-radius: 0 0 8px 8px;
}

.plan-header {
  text-align: center;
}

.price-section {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.price {
  font-size: 3rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1;
  
  &.free {
    color: rgb(var(--v-theme-success));
  }
}

.currency {
  font-size: 1.2rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.features-section {
  flex: 1;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: rgb(var(--v-theme-on-surface));
}

.plan-footer {
  margin-top: auto;
}

.faq-section {
  padding: 4rem 0;
  background: rgba(var(--v-theme-surface), 0.5);
}

.faq-item {
  padding: 1.5rem;
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .plan-card.popular {
    transform: none;
  }
  
  .plan-card.popular:hover {
    transform: translateY(-4px);
  }
  
  .price {
    font-size: 2.5rem;
  }
}
</style>

<style lang="scss">
.pricing-page {
  @media (min-width: 600px) and (max-width: 960px) {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>
