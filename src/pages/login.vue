<script setup lang="ts">
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { useAuth } from '@/composables/useAuth'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRouter } from 'vue-router'


definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const form = ref({
  phonenumber: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)
const router = useRouter()

// Auth composable
const { login, isLoading } = useAuth()

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Ce champ est requis',
  phone: (value: string) => {
    // Accepter +226XXXXXXXXX ou 226XXXXXXXXX ou XXXXXXXXX
    const phoneRegex = /^(\+?226?)?[0-9]{8}$/
    return phoneRegex.test(value.replace(/\s/g, '')) || 'Numéro de téléphone burkinabé invalide (8 chiffres)'
  },
  minLength: (value: string) => value.length >= 6 || 'Minimum 6 caractères',
}

// Form validation
const isFormValid = computed(() => {
  return form.value.phonenumber && 
         form.value.password && 
         rules.phone(form.value.phonenumber) === true &&
         rules.minLength(form.value.password) === true
})

// Handle login
const handleLogin = async () => {
  try {
    await login(form.value.phonenumber, form.value.password)
    router.push('/dashboard')
  } catch (error) {
    // L'erreur est déjà gérée dans le composable
    console.error('Erreur de connexion:', error)
  }
}

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
</script>

<template>
  <a href="javascript:void(0)">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </a>

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
            Bienvenue sur <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 🎓
          </h4>
          <p class="mb-0">
            Connectez-vous à votre compte pour continuer votre apprentissage
          </p>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="handleLogin">
            <VRow>
              <!-- phonenumber -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.phonenumber"
                  autofocus
                  label="Numéro de téléphone"
                                      placeholder="+226 70 12 34 56"
                  :rules="[rules.required, rules.phone]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                                  <VCheckbox
                  v-model="form.remember"
                  label="Se souvenir de moi"
                />
                <RouterLink
                  class="text-primary"
                  to="/forgot-password"
                >
                  Mot de passe oublié ?
                </RouterLink>
                </div>

                <VBtn
                  block
                  type="submit"
                  :loading="isLoading"
                  :disabled="!isFormValid"
                >
                  Se connecter
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-body-1 text-center"
              >
                <span class="d-inline-block">
                  Nouveau sur notre plateforme ?
                </span>
                <RouterLink
                  class="text-primary ms-1 d-inline-block text-body-1"
                  to="/register"
                >
                  Créer un compte étudiant
                </RouterLink>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
