<script setup lang="ts">
import ctaDashborad from '@images/logo.png';
</script>

<template>
  <div
    class="landing-cta bg-surface"
    :class="$vuetify.theme.current.dark ? 'banner-bg-dark' : 'banner-bg-light'"
  >
    <VContainer>
      <div class="d-flex justify-center justify-md-space-between flex-wrap gap-6 gap-x-10 position-relative pt-12">
        <div class="align-self-center">
          <div class="banner-title text-primary mb-1">
            Prêt à Commencer ?
          </div>
          <h5 class="text-h5 text-medium-emphasis mb-8">
            Commencez votre apprentissage avec un essai gratuit de 14 jours
          </h5>
          <VBtn
            color="primary"
            to="/register"
            :size="$vuetify.display.smAndUp ? 'large' : 'default' "
          >
            Commencer
          </VBtn>
        </div>

        <div class="banner-img">
          <img
            :src="ctaDashborad"
            class="w-100"
          >
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss">
.landing-cta {
  background-size: cover;
  margin-block: auto;
}

.banner-img {
  margin-block-end: -22px;
}

.banner-title {
  font-size: 34px;
  font-weight: 700;
  line-height: 44px;
}


</style>
