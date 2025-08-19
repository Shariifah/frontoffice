<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { usePasswordReset } from '@/composables/usePasswordReset'

import authV2ForgotPasswordIllustrationBorderedDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationBorderedLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

// Password reset composable
const {
  currentStep,
  isLoading,
  resetData,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  resendPasswordResetOtp,
  goToPreviousStep,
} = usePasswordReset()

// Form data for each step
const step1Form = ref({
  phonenumber: '',
})

const step2Form = ref({
  otp: '',
})

const step3Form = ref({
  newPassword: '',
  confirmPassword: '',
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
  passwordMatch: (value: string) => value === step3Form.value.newPassword || 'Les mots de passe ne correspondent pas',
}

// Step 3 validation
const isStep3Valid = computed(() => {
  return step3Form.value.newPassword &&
         step3Form.value.confirmPassword &&
         rules.minLength(step3Form.value.newPassword) === true &&
         rules.passwordMatch(step3Form.value.confirmPassword) === true
})

// Handle step 1: Request OTP
const handleRequestOtp = async () => {
  try {
    await requestPasswordResetOtp(step1Form.value.phonenumber)
  } catch (error) {
    console.error('Erreur lors de la demande d\'OTP:', error)
  }
}

// Handle step 2: Verify OTP
const handleVerifyOtp = async () => {
  try {
    await verifyPasswordResetOtp(step2Form.value.otp)
  } catch (error) {
    console.error('Erreur lors de la vérification OTP:', error)
  }
}

// Handle step 3: Reset password
const handleResetPassword = async () => {
  try {
    await resetPassword(step3Form.value.newPassword, step3Form.value.confirmPassword)
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
  }
}

// Handle resend OTP
const handleResendOtp = async () => {
  try {
    await resendPasswordResetOtp()
  } catch (error) {
    console.error('Erreur lors du renvoi OTP:', error)
  }
}

const authThemeImg = useGenerateImageVariant(
  authV2ForgotPasswordIllustrationLight,
  authV2ForgotPasswordIllustrationDark,
  authV2ForgotPasswordIllustrationBorderedLight,
  authV2ForgotPasswordIllustrationBorderedDark,
  true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
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
    class="auth-wrapper bg-surface"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 6.25rem;"
        >
          <VImg
            max-width="613"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <img
          class="auth-footer-mask flip-in-rtl"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        >
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-6"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Mot de passe oublié ? 🔐
          </h4>
          <p class="mb-0">
            Pas de problème ! Entrez votre numéro de téléphone pour réinitialiser votre mot de passe
          </p>
        </VCardText>
        <VCardText>
          <VForm>
            <!-- Étape 1: Demande d'OTP -->
            <div v-if="currentStep === 1">
              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="step1Form.phonenumber"
                    autofocus
                    label="Numéro de téléphone"
                    placeholder="+226 70 12 34 56"
                    :rules="[rules.required, rules.phone]"
                  />
                </VCol>

                <VCol cols="12">
                  <VBtn
                    block
                    :loading="isLoading"
                    :disabled="!step1Form.phonenumber || !rules.phone(step1Form.phonenumber)"
                    @click="handleRequestOtp"
                  >
                    Envoyer le code de réinitialisation
                  </VBtn>
                </VCol>
              </VRow>
            </div>

            <!-- Étape 2: Vérification OTP -->
            <div v-if="currentStep === 2">
              <div class="text-center mb-4">
                <VIcon icon="tabler-phone" size="48" color="primary" class="mb-2" />
                <p class="text-body-1">
                  Code envoyé au {{ resetData.phonenumber }}
                </p>
              </div>

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

                <VCol cols="12">
                  <div class="d-flex gap-2">
                    <VBtn
                      variant="outlined"
                      @click="goToPreviousStep"
                      :disabled="isLoading"
                    >
                      Retour
                    </VBtn>
                    <VBtn
                      variant="text"
                      @click="handleResendOtp"
                      :loading="isLoading"
                      :disabled="isLoading"
                    >
                      Renvoyer le code
                    </VBtn>
                  </div>
                </VCol>

                <VCol cols="12">
                  <VBtn
                    block
                    :loading="isLoading"
                    :disabled="!step2Form.otp || step2Form.otp.length !== 6"
                    @click="handleVerifyOtp"
                  >
                    Vérifier le code
                  </VBtn>
                </VCol>
              </VRow>
            </div>

            <!-- Étape 3: Nouveau mot de passe -->
            <div v-if="currentStep === 3">
              <p class="text-body-1 text-center mb-4">
                Définissez votre nouveau mot de passe
              </p>

              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="step3Form.newPassword"
                    label="Nouveau mot de passe"
                    type="password"
                    placeholder="············"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    :rules="[rules.required, rules.minLength]"
                  />
                </VCol>

                <VCol cols="12">
                  <AppTextField
                    v-model="step3Form.confirmPassword"
                    label="Confirmer le nouveau mot de passe"
                    type="password"
                    placeholder="············"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                    :rules="[rules.required, rules.passwordMatch]"
                  />
                </VCol>

                <VCol cols="12">
                  <VBtn
                    variant="outlined"
                    @click="goToPreviousStep"
                    :disabled="isLoading"
                  >
                    Retour
                  </VBtn>
                </VCol>

                <VCol cols="12">
                  <VBtn
                    block
                    color="success"
                    :loading="isLoading"
                    :disabled="!isStep3Valid"
                    @click="handleResetPassword"
                  >
                    Réinitialiser le mot de passe
                  </VBtn>
                </VCol>
              </VRow>
            </div>

            <div class="text-center mt-4">
              <RouterLink
                class="text-primary"
                to="/login"
              >
                Retour à la connexion
              </RouterLink>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
