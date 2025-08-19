<script setup lang="ts">
import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'

import paypalDark from '@images/icons/payments/img/paypal-dark.png'
import paypalLight from '@images/icons/payments/img/paypal-light.png'
import visaDark from '@images/icons/payments/img/visa-dark.png'
import visaLight from '@images/icons/payments/img/visa-light.png'

import { useConfigStore } from '@core/stores/config'
import type { CustomInputContent } from '@core/types'

const visa = useGenerateImageVariant(visaLight, visaDark)
const paypal = useGenerateImageVariant(paypalLight, paypalDark)
const store = useConfigStore()

store.skin = 'default'
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const radioContent: CustomInputContent[] = [
  {
    title: 'Orange Money',
    value: 'orange-money',
    images: '/src/assets/images/payments/orange-money-logo.svg',
  },
  {
    title: 'Moov Money',
    value: 'moov-money',
    images: '/src/assets/images/payments/moov-money-logo.svg',
  },
  {
    title: 'PayPal',
    value: 'paypal',
    images: paypal.value,
  },
  {
    title: 'Carte Bancaire',
    value: 'credit card',
    images: visa.value,
  },
]

const selectedRadio = ref('orange-money')
const selectedCountry = ref('Burkina Faso')
const isPricingPlanDialogVisible = ref(false)

// Variables pour les paiements mobiles
const mobilePaymentStep = ref(1)
const mobilePhoneNumber = ref('')
const mobileOtp = ref('')
const isOtpSent = ref(false)
const isProcessingPayment = ref(false)

// Méthodes pour les paiements mobiles
const sendOtp = async () => {
  if (!mobilePhoneNumber.value || mobilePhoneNumber.value.length < 8) {
    return
  }
  
  isOtpSent.value = true
  // Simulation d'envoi d'OTP
  setTimeout(() => {
    mobilePaymentStep.value = 2
  }, 1000)
}

const verifyOtp = async () => {
  if (!mobileOtp.value || mobileOtp.value.length !== 4) {
    return
  }
  
  isProcessingPayment.value = true
  // Simulation de vérification OTP et paiement
  setTimeout(() => {
    isProcessingPayment.value = false
    // Redirection vers le dashboard après paiement réussi
    window.location.href = '/dashboard'
  }, 2000)
}

const resetMobilePayment = () => {
  mobilePaymentStep.value = 1
  mobilePhoneNumber.value = ''
  mobileOtp.value = ''
  isOtpSent.value = false
  isProcessingPayment.value = false
}

// Reset quand on change de moyen de paiement
watch(selectedRadio, () => {
  resetMobilePayment()
})
</script>

<template>
  <!-- eslint-disable vue/attribute-hyphenation -->

  <div class="payment-page">


    <!-- 👉 Payment card  -->
    <VContainer>
      <div class="d-flex justify-center align-center payment-card">
        <VCard width="100%">
          <VRow>
            <VCol
              cols="12"
              md="7"
              :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'"
            >
              <VCardText class="pa-8 pe-5">
                <!-- Checkout header -->
                <div>
                  <h4 class="text-h4 mb-2">
                    Paiement
                  </h4>
                  <div class="text-body-1">
                    Tous les plans incluent 40+ outils et fonctionnalités avancées pour booster votre apprentissage. Choisissez le meilleur plan qui correspond à vos besoins.
                  </div>
                </div>

                <div class="mb-8">
                  <h4 class="text-h4 mb-6">
                    Moyen de paiement
                  </h4>
                  <CustomRadios
                    v-model:selected-radio="selectedRadio"
                    :radio-content="radioContent"
                    :grid-column="{ cols: '12', sm: '6' }"
                    class="my-8"
                  >
                    <template #default="{ item }">
                      <div class="d-flex align-center gap-x-4 ms-3">
                        <img
                          :src="item.images"
                          height="34"
                        >
                        <h6 class="text-h6">
                          {{ item.title }}
                        </h6>
                      </div>
                    </template>
                  </CustomRadios>
                  
                  <!-- Informations sur les moyens de paiement -->
                  <div class="mt-4">
                    <VAlert
                      v-if="selectedRadio === 'orange-money'"
                      type="info"
                      variant="tonal"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-info-circle" />
                      </template>
                      Orange Money vous permet de payer en toute sécurité avec votre compte mobile. Service disponible 24h/24.
                    </VAlert>
                    
                    <VAlert
                      v-else-if="selectedRadio === 'moov-money'"
                      type="info"
                      variant="tonal"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-info-circle" />
                      </template>
                      Moov Money offre des paiements rapides et sécurisés. Compatible avec tous les appareils mobiles.
                    </VAlert>
                    
                    <VAlert
                      v-else-if="selectedRadio === 'paypal'"
                      type="info"
                      variant="tonal"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-info-circle" />
                      </template>
                      Paiement sécurisé via PayPal. Connectez-vous à votre compte PayPal pour finaliser le paiement.
                    </VAlert>
                    
                    <VAlert
                      v-else-if="selectedRadio === 'credit card'"
                      type="info"
                      variant="tonal"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-info-circle" />
                      </template>
                      Paiement par carte bancaire sécurisé. Nous acceptons Visa, MasterCard et les cartes locales.
                    </VAlert>
                  </div>
                </div>

                <!-- Détails de facturation -->
<!--                <div class="mb-8">-->
<!--                  <h4 class="text-h4 mb-6">-->
<!--                    Détails de facturation-->
<!--                  </h4>-->
<!--                  <VForm>-->
<!--                    <VRow>-->
<!--                      <VCol-->
<!--                        cols="12"-->
<!--                        md="6"-->
<!--                      >-->
<!--                        <AppTextField-->
<!--                          label="Adresse email"-->
<!--                          type="email"-->
<!--                          placeholder="jean.dupont@email.com"-->
<!--                        />-->
<!--                      </VCol>-->
<!--                      <VCol-->
<!--                        cols="12"-->
<!--                        md="6"-->
<!--                      >-->
<!--                        <AppTextField-->
<!--                          label="Numéro de téléphone"-->
<!--                          type="tel"-->
<!--                          placeholder="+226 70 12 34 56"-->
<!--                        />-->
<!--                      </VCol>-->
<!--                      <VCol-->
<!--                        cols="12"-->
<!--                        md="6"-->
<!--                      >-->
<!--                        <AppSelect-->
<!--                          v-model="selectedCountry"-->
<!--                          label="Pays de facturation"-->
<!--                          :items="['Burkina Faso', 'Mali', 'Sénégal', 'Côte d\'Ivoire', 'Ghana', 'Togo', 'Bénin', 'Niger']"-->
<!--                        />-->
<!--                      </VCol>-->
<!--                      <VCol-->
<!--                        cols="12"-->
<!--                        md="6"-->
<!--                      >-->
<!--                        <AppTextField-->
<!--                          label="Code postal"-->
<!--                          type="text"-->
<!--                          placeholder="01 BP 1234"-->
<!--                        />-->
<!--                      </VCol>-->
<!--                    </VRow>-->
<!--                  </VForm>-->
<!--                </div>-->

                <!-- Étapes de paiement mobile -->
                <div
                  v-if="selectedRadio === 'orange-money' || selectedRadio === 'moov-money'"
                  class="mb-8"
                >
                  <h4 class="text-h4 mb-6">
                    Paiement {{ selectedRadio === 'orange-money' ? 'Orange Money' : 'Moov Money' }}
                  </h4>
                  
                  <!-- Étape 1: Numéro de téléphone -->
                  <div
                    v-if="mobilePaymentStep === 1"
                    class="mobile-payment-step"
                  >
                    <VAlert
                      type="info"
                      variant="tonal"
                      class="mb-4"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-phone" />
                      </template>
                      Étape 1: Entrez votre numéro de téléphone {{ selectedRadio === 'orange-money' ? 'Orange' : 'Moov' }}
                    </VAlert>
                    
                    <VTextField
                      v-model="mobilePhoneNumber"
                      label="Numéro de téléphone"
                      placeholder="+226 70 12 34 56"
                      variant="outlined"
                      class="mb-4"
                      :rules="[v => !!v || 'Numéro requis', v => v.length >= 8 || 'Numéro invalide']"
                    />
                    
                    <VBtn
                      block
                      color="primary"
                      :loading="isOtpSent"
                      :disabled="!mobilePhoneNumber || mobilePhoneNumber.length < 8"
                      @click="sendOtp"
                    >
                      <VIcon
                        icon="tabler-send"
                        class="me-2"
                      />
                      Envoyer le code de confirmation
                    </VBtn>
                  </div>
                  
                  <!-- Étape 2: Code OTP -->
                  <div
                    v-if="mobilePaymentStep === 2"
                    class="mobile-payment-step"
                  >
                    <VAlert
                      type="success"
                      variant="tonal"
                      class="mb-4"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-check" />
                      </template>
                      Étape 2: Code de confirmation envoyé au {{ mobilePhoneNumber }}
                    </VAlert>
                    
                    <VTextField
                      v-model="mobileOtp"
                      label="Code de confirmation (4 chiffres)"
                      placeholder="1234"
                      variant="outlined"
                      class="mb-4"
                      maxlength="4"
                      :rules="[v => !!v || 'Code requis', v => v.length === 4 || 'Code invalide']"
                    />
                    
                    <div class="d-flex gap-2">
                      <VBtn
                        variant="outlined"
                        @click="resetMobilePayment"
                      >
                        <VIcon
                          icon="tabler-arrow-left"
                          class="me-2"
                        />
                        Retour
                      </VBtn>
                      
                      <VBtn
                        block
                        color="primary"
                        :loading="isProcessingPayment"
                        :disabled="!mobileOtp || mobileOtp.length !== 4"
                        @click="verifyOtp"
                      >
                        <VIcon
                          icon="tabler-lock"
                          class="me-2"
                        />
                        Confirmer le paiement
                      </VBtn>
                    </div>
                  </div>
                </div>

                <!-- Section PayPal -->
                <div
                  v-if="selectedRadio === 'paypal'"
                  class="mb-8"
                >
                  <h4 class="text-h4 mb-6">
                    Paiement PayPal
                  </h4>
                  
                  <VAlert
                    type="info"
                    variant="tonal"
                    class="mb-4"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-info-circle" />
                    </template>
                    Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
                  </VAlert>
                  
                  <div class="d-flex align-center justify-center p-4 border rounded">
                    <VIcon
                      icon="tabler-brand-paypal"
                      size="48"
                      color="primary"
                      class="me-3"
                    />
                    <div>
                      <h5 class="text-h6 mb-1">
                        Paiement sécurisé via PayPal
                      </h5>
                      <p class="text-body-2 text-medium-emphasis">
                        Cliquez sur "Payer avec PayPal" pour continuer
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Informations de carte bancaire -->
                <div
                  class="mb-8"
                  :class="selectedRadio === 'credit card' ? 'd-block' : 'd-none'"
                >
                  <h4 class="text-h4 mb-6">
                    Informations de carte bancaire
                  </h4>
                  <VRow>
                    <VCol cols="12">
                      <AppTextField
                        label="Numéro de carte"
                        placeholder="1234 5678 9012 3456"
                        type="number"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        label="Titulaire de la carte"
                        placeholder="Jean Dupont"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        label="Date d'expiration"
                        placeholder="12/25"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <AppTextField
                        label="Code de sécurité"
                        type="number"
                        placeholder="123"
                      />
                    </VCol>
                  </VRow>
                </div>
              </VCardText>
            </VCol>

            <VCol
              cols="12"
              md="5"
            >
              <VCardText class="pa-8 ps-5">
                <!-- Résumé de la commande -->
                <div class="mb-8">
                  <h4 class="text-h4 mb-2">
                    Résumé de la commande
                  </h4>
                  <div class="text-body-1">
                    Vérifiez les détails de votre abonnement avant de procéder au paiement.
                  </div>
                </div>

                <VCard
                  flat
                  color="rgba(var(--v-theme-on-surface), var(--v-hover-opacity))"
                >
                  <VCardText>
                    <div class="text-body-1">
                      Plan Premium - Pour les apprenants sérieux
                    </div>
                    <h1 class="text-h1 my-4">
                      19 000<span class="text-body-1 font-weight-medium"> FCFA/mois</span>
                    </h1>
                    <VBtn
                      variant="tonal"
                      block
                      @click="isPricingPlanDialogVisible = !isPricingPlanDialogVisible"
                    >
                      Changer de plan
                    </VBtn>
                  </VCardText>
                </VCard>

                <div class="my-5">
                  <div class="d-flex justify-space-between mb-2">
                    <span>Abonnement mensuel</span>
                    <h6 class="text-h6">
                      19 000 FCFA
                    </h6>
                  </div>
                  <div class="d-flex justify-space-between mb-2">
                    <span>Frais de transaction</span>
                    <h6 class="text-h6">
                      500 FCFA
                    </h6>
                  </div>
                  <VDivider class="my-3" />
                  <div class="d-flex justify-space-between">
                    <span class="font-weight-bold">Total</span>
                    <h6 class="text-h6 font-weight-bold">
                      19 500 FCFA
                    </h6>
                  </div>
                </div>


                <VBtn
                  v-if="selectedRadio !== 'orange-money' && selectedRadio !== 'moov-money'"
                  block
                  color="success"
                  class="mb-8"
                  :loading="false"
                >
                  <template #prepend>
                    <VIcon
                      :icon="selectedRadio === 'paypal' ? 'tabler-brand-paypal' : 'tabler-credit-card'"
                    />
                  </template>
                  <template #append>
                    <VIcon
                      icon="tabler-arrow-right"
                      class="flip-in-rtl"
                    />
                  </template>
                  Payer avec {{ selectedRadio === 'paypal' ? 'PayPal' : 'Carte Bancaire' }}
                </VBtn>

                <div class="text-body-1">
                  En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité. Veuillez noter que les paiements ne sont pas remboursables.
                </div>
              </VCardText>
            </VCol>
          </VRow>
        </VCard>
      </div>
    </VContainer>


    <PricingPlanDialog v-model:is-dialog-visible="isPricingPlanDialogVisible" />
  </div>

</template>

<style lang="scss" scoped>
.footer {
  position: static !important;
  inline-size: 100%;
  inset-block-end: 0;
}

.payment-card {
  margin-block: 10.5rem 5.25rem;
}

.payment-page {
  @media (min-width: 600px) and (max-width: 960px) {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>

<style lang="scss">
.payment-card {
  .custom-radio {
    .v-radio {
      margin-block-start: 0 !important;
    }
  }
}

.mobile-payment-step {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
