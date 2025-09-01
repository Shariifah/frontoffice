<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import type { CustomInputContent } from '@core/types'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRegister } from '@/composables/useRegister'
import { onMounted } from 'vue'

import registerMultiStepIllustrationDark from '@images/illustrations/register-multi-step-illustration-dark.png'
import registerMultiStepIllustrationLight from '@images/illustrations/register-multi-step-illustration-light.png'

import registerMultiStepBgDark from '@images/pages/register-multi-step-bg-dark.png'
import registerMultiStepBgLight from '@images/pages/register-multi-step-bg-light.png'

const registerMultiStepBg = useGenerateImageVariant(registerMultiStepBgLight, registerMultiStepBgDark)

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
// Réinitialiser le processus au montage du composant

// Register composable
const {
  currentStep,
  isLoading,
  registrationData,
  requestOtp,
  verifyOtp,
  register,
  resendOtp,
  goToPreviousStep,
  resetRegistration,
} = useRegister()

// Form data for each step
const step1Form = ref({
  phonenumber: '',
})

const step2Form = ref({
  otp: '',
})

const step3Form = ref({
  firstname: '',
  lastname: '',
  password: '',
  verifyPassword: '',
})

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Ce champ est requis',
  phone: (value: string) => {
    // Accepter +226XXXXXXXXX ou 226XXXXXXXXX ou XXXXXXXXX
    const phoneRegex = /^(\+?226?)?[0-9]{8}$/
    return phoneRegex.test(value.replace(/\s/g, '')) || 'Numéro de téléphone burkinabé invalide (8 chiffres)'
  },
  otp: (value: string) => {
    const otpRegex = /^\d{6}$/
    return otpRegex.test(value) || 'Code à 6 chiffres requis'
  },
  minLength: (value: string) => value.length >= 6 || 'Minimum 6 caractères',
  passwordMatch: (value: string) => value === step3Form.value.password || 'Les mots de passe ne correspondent pas',
}

// Step 3 validation
const isStep3Valid = computed(() => {
  return step3Form.value.firstname &&
         step3Form.value.lastname &&
         step3Form.value.password &&
         step3Form.value.verifyPassword &&
         rules.minLength(step3Form.value.password) === true &&
         rules.passwordMatch(step3Form.value.verifyPassword) === true
})

// Handle step 1: Request OTP
const handleRequestOtp = async () => {
  try {
    await requestOtp(step1Form.value.phonenumber)
  } catch (error) {
    console.error('Erreur lors de la demande d\'OTP:', error)
  }
}

// Handle step 2: Verify OTP
const handleVerifyOtp = async () => {
  try {
    await verifyOtp(step2Form.value.otp)
  } catch (error) {
    console.error('Erreur lors de la vérification OTP:', error)
  }
}

// Handle step 3: Register
const handleRegister = async () => {
  try {
    await register({
      firstname: step3Form.value.firstname,
      lastname: step3Form.value.lastname,
      password: step3Form.value.password,
      verifyPassword: step3Form.value.verifyPassword,
    })
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
  }
}

// Handle resend OTP
const handleResendOtp = async () => {
  try {
    await resendOtp()
  } catch (error) {
    console.error('Erreur lors du renvoi OTP:', error)
  }
}

const registerMultiStepIllustration = useGenerateImageVariant(registerMultiStepIllustrationLight, registerMultiStepIllustrationDark)

const items = [
  {
    title: 'Démarrage',
    subtitle: 'Numéro de téléphone',
    icon: 'tabler-phone',
  },
  {
    title: 'Sécurisation',
    subtitle: 'Code OTP',
    icon: 'tabler-key',
  },
  {
    title: 'Profil',
    subtitle: 'Informations étudiant',
    icon: 'tabler-user',
  },
]

onMounted(() => {
  resetRegistration()
})



</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="4"
      class="d-none d-md-flex"
    >
      <!-- here your illustration -->
      <div class="d-flex justify-center align-center w-100 position-relative">
        <VImg
          :src="registerMultiStepIllustration"
          class="illustration-image flip-in-rtl"
        />

        <img
          class="bg-image position-absolute w-100 flip-in-rtl"
          :src="registerMultiStepBg"
          alt="register-multi-step-bg"
          height="340"
        >
      </div>
    </VCol>

    <VCol
      cols="12"
      md="8"
      class="auth-card-v2 d-flex align-center justify-center pa-10"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        class="mt-12 mt-sm-10"
      >
        <AppStepper
          v-model:current-step="currentStep"
          :items="items"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
          icon-size="22"
          class="stepper-icon-step-bg mb-12"
        />

        <VWindow
          :model-value="currentStep"
          class="disable-tab-transition"
          style="max-inline-size: 681px;"
        >
          <VForm>
                                        <!-- Étape 1: Demande d'OTP -->
              <VWindowItem>
                <h4 class="text-h4">
                  Commencez votre apprentissage
                </h4>
                <p class="text-body-1 mb-6">
                  Entrez votre numéro de téléphone pour créer votre compte et accéder à nos cours
                </p>

                <VRow>
                  <VCol cols="12">
                    <AppTextField
                      v-model="step1Form.phonenumber"
                      label="Numéro de téléphone"
                      placeholder="+226 70 12 34 56"
                      :rules="[rules.required, rules.phone]"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>

                                        <!-- Étape 2: Vérification OTP -->
              <VWindowItem>
                <h4 class="text-h4">
                  Vérifiez votre identité
                </h4>
                <p class="text-body-1 mb-6">
                  Code envoyé au {{ registrationData.phonenumber }} pour sécuriser votre compte
                </p>

                <VRow>
                  <VCol cols="12">
                    <AppTextField
                      v-model="step2Form.otp"
                      label="Code de vérification"
                      placeholder="123456"
                      :rules="[rules.required, rules.otp]"
                      maxlength="6"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>

                          <!-- Étape 3: Informations utilisateur -->
              <VWindowItem>
                <h4 class="text-h4">
                  Créez votre profil étudiant
                </h4>
                <p class="text-body-1 mb-6">
                  Complétez vos informations pour personnaliser votre expérience d'apprentissage
                </p>

              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="step3Form.firstname"
                    label="Prénom"
                    placeholder="Votre prénom"
                    :rules="[rules.required]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="step3Form.lastname"
                    label="Nom"
                    placeholder="Votre nom"
                    :rules="[rules.required]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="step3Form.password"
                    label="Mot de passe"
                    placeholder="Créez un mot de passe sécurisé"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    :rules="[rules.required, rules.minLength]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="step3Form.verifyPassword"
                    label="Confirmer le mot de passe"
                    placeholder="Confirmez votre mot de passe"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                    :rules="[rules.required, rules.passwordMatch]"
                  />
                </VCol>
              </VRow>
            </VWindowItem>
          </VForm>
        </VWindow>

        <div class="d-flex flex-wrap justify-space-between gap-x-4 mt-6">
          <VBtn
            color="secondary"
            :disabled="currentStep === 0"
            variant="tonal"
            @click="goToPreviousStep"
          >
            <VIcon
              icon="tabler-arrow-left"
              start
              class="flip-in-rtl"
            />
            Précédent
          </VBtn>

          <!-- Étape 1: Demander OTP -->
          <VBtn
            v-if="currentStep === 0"
            :loading="isLoading"
            :disabled="!step1Form.phonenumber || !rules.phone(step1Form.phonenumber)"
            @click="handleRequestOtp"
          >
            Send OTP
            <VIcon
              icon="tabler-arrow-right"
              end
              class="flip-in-rtl"
            />
          </VBtn>

                    <!-- Étape 2: Vérifier OTP -->
          <div v-else-if="currentStep === 1" class="d-flex gap-2">
            <VBtn
              variant="text"
              @click="handleResendOtp"
              :loading="isLoading"
              :disabled="isLoading"
            >
              Renvoyer le code
            </VBtn>
            <VBtn
              :loading="isLoading"
              :disabled="!step2Form.otp || step2Form.otp.length !== 6"
              @click="handleVerifyOtp"
            >
              Continuer vers le profil
              <VIcon
                icon="tabler-arrow-right"
                end
                class="flip-in-rtl"
              />
            </VBtn>
          </div>

          <!-- Étape 3: Finaliser l'inscription -->
          <VBtn
            v-else-if="currentStep === 2"
            color="success"
            :loading="isLoading"
            :disabled="!isStep3Valid"
            @click="handleRegister"
          >
            Créer mon compte étudiant
          </VBtn>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.illustration-image {
  block-size: 550px;
  inline-size: 248px;
}

.bg-image {
  inset-block-end: 0;
}
</style>
