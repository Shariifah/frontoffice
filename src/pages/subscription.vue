<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

// Données simulées de l'abonnement
const subscriptionData = ref({
  currentPlan: 'Premium',
  status: 'Actif',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  autoRenewal: true,
  price: '19 000 FCFA',
  billingCycle: 'Mensuel',
  nextBilling: '2024-04-01',
  subjectsAccess: 'Illimité',
  compositionsLimit: 'Illimité',
})

const billingHistory = ref([
  {
    id: 1,
    date: '2024-03-01',
    amount: '19 000 FCFA',
    status: 'Payé',
    method: 'Orange Money',
    invoice: 'INV-2024-001',
  },
  {
    id: 2,
    date: '2024-02-01',
    amount: '19 000 FCFA',
    status: 'Payé',
    method: 'Orange Money',
    invoice: 'INV-2024-002',
  },
  {
    id: 3,
    date: '2024-01-01',
    amount: '19 000 FCFA',
    status: 'Payé',
    method: 'Orange Money',
    invoice: 'INV-2024-003',
  },
])

const availablePlans = ref([
  {
    name: 'Gratuit',
    price: '0 FCFA',
    period: 'Mensuel',
    features: [
      'Accès limité aux sujets',
      '3 compositions par mois',
      'Support par email',
      'Résultats basiques',
    ],
    current: false,
  },
  {
    name: 'Premium',
    price: '19 000 FCFA',
    period: 'Mensuel',
    features: [
      'Accès illimité aux sujets',
      'Compositions illimitées',
      'Support prioritaire',
      'Résultats détaillés',
      'Analyses de performance',
    ],
    current: true,
  },
  {
    name: 'Entreprise',
    price: '65 000 FCFA',
    period: 'Mensuel',
    features: [
      'Tout du plan Premium',
      'Support dédié 24/7',
      'Formation sur mesure',
      'API d\'intégration',
      'Rapports personnalisés',
    ],
    current: false,
  },
])

const isChangingPlan = ref(false)
const selectedNewPlan = ref('')
</script>

<template>
  <div class="subscription-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <h2>Mon abonnement</h2>
              <VBtn
                color="primary"
                variant="outlined"
                to="/pricing"
              >
                Voir tous les plans
              </VBtn>
            </VCardTitle>
            <VCardText>
              <!-- Statut de l'abonnement -->
              <VRow class="mb-8">
                <VCol
                  cols="12"
                  md="8"
                >
                  <VCard
                    variant="outlined"
                    color="primary"
                  >
                    <VCardText>
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <h3 class="text-h5 mb-2">
                            Plan {{ subscriptionData.currentPlan }}
                          </h3>
                          <div class="d-flex align-center gap-4">
                            <VChip
                              :color="subscriptionData.status === 'Actif' ? 'success' : 'warning'"
                              size="small"
                            >
                              {{ subscriptionData.status }}
                            </VChip>
                            <span class="text-body-2">
                              {{ subscriptionData.price }} / {{ subscriptionData.billingCycle }}
                            </span>
                          </div>
                        </div>
                        <VIcon
                          icon="tabler-crown"
                          size="48"
                          color="primary"
                        />
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                  >
                    <VCardText>
                      <h4 class="text-h6 mb-3">
                        Prochain paiement
                      </h4>
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-2">
                          {{ new Date(subscriptionData.nextBilling).toLocaleDateString('fr-FR') }}
                        </span>
                        <span class="text-body-1 font-weight-medium">
                          {{ subscriptionData.price }}
                        </span>
                      </div>
                      <VSwitch
                        v-model="subscriptionData.autoRenewal"
                        label="Renouvellement automatique"
                        class="mt-3"
                      />
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Détails de l'abonnement -->
              <VRow class="mb-8">
                <VCol
                  cols="12"
                  md="6"
                >
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Détails de l'abonnement
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <div class="d-flex justify-space-between py-2">
                        <span class="text-body-2">Date de début</span>
                        <span class="text-body-1">{{ new Date(subscriptionData.startDate).toLocaleDateString('fr-FR') }}</span>
                      </div>
                      <VDivider />
                      <div class="d-flex justify-space-between py-2">
                        <span class="text-body-2">Date de fin</span>
                        <span class="text-body-1">{{ new Date(subscriptionData.endDate).toLocaleDateString('fr-FR') }}</span>
                      </div>
                      <VDivider />
                      <div class="d-flex justify-space-between py-2">
                        <span class="text-body-2">Accès aux sujets</span>
                        <span class="text-body-1">{{ subscriptionData.subjectsAccess }}</span>
                      </div>
                      <VDivider />
                      <div class="d-flex justify-space-between py-2">
                        <span class="text-body-2">Limite de compositions</span>
                        <span class="text-body-1">{{ subscriptionData.compositionsLimit }}</span>
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
                        Historique des paiements
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <div
                        v-for="payment in billingHistory.slice(0, 3)"
                        :key="payment.id"
                        class="d-flex justify-space-between align-center py-2 border-bottom"
                      >
                        <div>
                          <p class="text-body-2 font-weight-medium mb-0">
                            {{ new Date(payment.date).toLocaleDateString('fr-FR') }}
                          </p>
                          <p class="text-caption text-medium-emphasis mb-0">
                            {{ payment.method }}
                          </p>
                        </div>
                        <div class="text-end">
                          <p class="text-body-2 font-weight-medium mb-0">
                            {{ payment.amount }}
                          </p>
                          <VChip
                            :color="payment.status === 'Payé' ? 'success' : 'warning'"
                            size="x-small"
                          >
                            {{ payment.status }}
                          </VChip>
                        </div>
                      </div>
                      <VBtn
                        block
                        variant="text"
                        color="primary"
                        class="mt-2"
                      >
                        Voir tout l'historique
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Changer de plan -->
              <VRow class="mb-8">
                <VCol cols="12">
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Changer de plan
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <VRow>
                        <VCol
                          v-for="plan in availablePlans"
                          :key="plan.name"
                          cols="12"
                          md="4"
                        >
                          <VCard
                            variant="outlined"
                            :class="{ 'border-primary': plan.current }"
                          >
                            <VCardText>
                              <div class="text-center mb-4">
                                <h5 class="text-h6 mb-2">
                                  {{ plan.name }}
                                </h5>
                                <h3 class="text-h4 text-primary mb-1">
                                  {{ plan.price }}
                                </h3>
                                <p class="text-caption">
                                  {{ plan.period }}
                                </p>
                              </div>
                              
                              <ul class="text-body-2 mb-4">
                                <li
                                  v-for="feature in plan.features"
                                  :key="feature"
                                  class="mb-1"
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
                                @click="isChangingPlan = true; selectedNewPlan = plan.name"
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
                            </VCardText>
                          </VCard>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Actions -->
              <VRow>
                <VCol cols="12">
                  <VCard
                    variant="outlined"
                    color="warning"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Actions
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <VRow>
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VBtn
                            block
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
                        </VCol>
                        
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VBtn
                            block
                            color="warning"
                            variant="outlined"
                          >
                            <VIcon
                              icon="tabler-pause"
                              class="me-2"
                            />
                            Suspendre l'abonnement
                          </VBtn>
                        </VCol>
                        
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VBtn
                            block
                            color="error"
                            variant="outlined"
                          >
                            <VIcon
                              icon="tabler-x"
                              class="me-2"
                            />
                            Annuler l'abonnement
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
    
    <!-- Dialog de changement de plan -->
    <VDialog
      v-model="isChangingPlan"
      max-width="500"
    >
      <VCard>
        <VCardTitle>
          Changer vers le plan {{ selectedNewPlan }}
        </VCardTitle>
        <VCardText>
          <p class="text-body-1 mb-4">
            Êtes-vous sûr de vouloir changer vers le plan {{ selectedNewPlan }} ? 
            Ce changement prendra effet immédiatement.
          </p>
          
          <VAlert
            type="info"
            variant="tonal"
          >
            <template #prepend>
              <VIcon icon="tabler-info-circle" />
            </template>
            Le changement de plan peut affecter votre accès aux fonctionnalités.
          </VAlert>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="outlined"
            @click="isChangingPlan = false"
          >
            Annuler
          </VBtn>
          <VBtn
            color="primary"
            @click="isChangingPlan = false"
          >
            Confirmer
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

.border-bottom {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.border-bottom:last-child {
  border-bottom: none;
}
</style>
