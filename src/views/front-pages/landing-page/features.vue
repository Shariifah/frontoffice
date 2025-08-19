<script setup lang="ts">
import check from '@images/svg/Check.svg'
import keyboard from '@images/svg/keyboard.svg'
import laptop from '@images/svg/laptop.svg'
import paper from '@images/svg/paper-send.svg'
import rocket from '@images/svg/rocket.svg'
import user from '@images/svg/user.svg'

const featuresData = [
  { title: 'Cours Interactifs', desc: 'Des cours conçus pour une compréhension facile et un apprentissage efficace.', icon: laptop },
  { title: 'Mises à Jour Régulières', desc: 'Nouveaux contenus et fonctionnalités ajoutés régulièrement pour enrichir votre parcours.', icon: rocket },
  { title: 'Kit de Démarrage', desc: 'Commencez rapidement votre apprentissage sans perdre de temps sur la configuration.', icon: paper },
  { title: 'API Prête', desc: 'Intégration facile avec vos outils existants pour un apprentissage personnalisé.', icon: check },
  { title: 'Support Excellent', desc: 'Une documentation claire avec de nombreux exemples et références pratiques.', icon: user },
  { title: 'Bien Documenté', desc: 'Des guides détaillés et des tutoriels pour vous accompagner à chaque étape.', icon: keyboard },
]
</script>

<template>
  <VContainer id="features">
    <div class="feature-cards">
      <div class="headers d-flex justify-center flex-column align-center mb-12">
        <VChip
          label
          color="primary"
          class="mb-4"
          size="small"
        >
          Fonctionnalités Utiles
        </VChip>
        <div class="d-flex text-h4 mb-1 align-center flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              Tout ce dont vous avez besoin
            </div>
          </div>
          pour commencer votre apprentissage
        </div>
        <p class="text-body-1 mb-0">
          Plus qu\'un simple ensemble d\'outils, la plateforme inclut une application d\'apprentissage complète et prête à l\'emploi.
        </p>
      </div>
      <VRow>
        <VCol
          v-for="(data, index) in featuresData"
          :key="index"
          cols="12"
          md="4"
          sm="6"
        >
          <div class="d-flex flex-column align-center justify-center gap-4 mx-auto">
            <VIcon
              :icon="data.icon"
              size="64"
              color="primary"
            />
            <div class="text-center">
              <h5 class="text-h5 mb-2">
                {{ data.title }}
              </h5>
              <p
                class="text-body-1 mb-6"
                style="max-inline-size: 310px;"
              >
                {{ data.desc }}
              </p>
            </div>
          </div>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.feature-cards {
  margin-block: 3.75rem;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.feature {
  .v-avatar {
    &.v-avatar--variant-outlined {
      border: 2px solid rgba(var(--v-theme-primary), 0.32);

      &:hover {
        background: rgba(var(--v-theme-primary), 0.16);
        cursor: pointer;
      }
    }
  }
}
</style>
