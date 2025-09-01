<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import logo1dark from '@images/front-pages/branding/logo-1-dark.png'
import logo1light from '@images/front-pages/branding/logo-1-light.png'
import logo1 from '@images/front-pages/branding/logo-1.png'
import logo2dark from '@images/front-pages/branding/logo-2-dark.png'
import logo2light from '@images/front-pages/branding/logo-2-light.png'
import logo2 from '@images/front-pages/branding/logo-2.png'
import logo3dark from '@images/front-pages/branding/logo-3-dark.png'
import logo3light from '@images/front-pages/branding/logo-3-light.png'
import logo3 from '@images/front-pages/branding/logo-3.png'
import logo4dark from '@images/front-pages/branding/logo-4-dark.png'
import logo4light from '@images/front-pages/branding/logo-4-light.png'
import logo4 from '@images/front-pages/branding/logo-4.png'
import logo5dark from '@images/front-pages/branding/logo-5-dark.png'
import logo5light from '@images/front-pages/branding/logo-5-light.png'

import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'

register()

const brandLogo1 = useGenerateImageVariant(logo1light, logo1dark)
const brandLogo2 = useGenerateImageVariant(logo2light, logo2dark)
const brandLogo3 = useGenerateImageVariant(logo3light, logo3dark)
const brandLogo4 = useGenerateImageVariant(logo4light, logo4dark)
const brandLogo5 = useGenerateImageVariant(logo5light, logo5dark)

// Customer Review Data
const reviewData = [
  {
    desc: 'Bourgeon a révolutionné ma façon d\'apprendre. La plateforme est intuitive et les cours sont vraiment adaptés à mes besoins.',
    img: logo1,
    rating: 5,
    name: 'Marie Dupont',
    position: 'Étudiante en informatique',
    avatar: avatar1,
  },
  {
    desc: 'La plateforme Bourgeon est exceptionnelle. L\'interface est claire et les exercices pratiques m\'ont permis de progresser rapidement.',
    img: logo2,
    rating: 5,
    name: 'Thomas Martin',
    position: 'Étudiant en développement',
    avatar: avatar2,
  },
  {
    desc: 'Grâce à Bourgeon, j\'ai pu améliorer mes compétences en programmation. Les cours sont bien structurés et le support est excellent.',
    img: logo3,
    rating: 5,
    name: 'Sophie Bernard',
    position: 'Étudiante en ingénierie',
    avatar: avatar3,
  },
  {
    desc: 'Tous les besoins des apprenants ont été pris en compte. Je peux maintenant maîtriser n\'importe quel sujet grâce à Bourgeon.',
    img: logo4,
    rating: 5,
    name: 'Lucas Dubois',
    position: 'Étudiant en sciences',
    avatar: avatar4,
  },
  {
    desc: 'Bourgeon est génial, et j\'apprécie particulièrement de savoir que si je suis bloqué sur quelque chose, il y a toujours une communauté bienveillante pour m\'aider.',
    img: logo3,
    rating: 5,
    name: 'Antoine Leroy',
    position: 'Étudiant en médecine',
    avatar: avatar5,
  },
  {
    desc: 'La qualité des cours sur Bourgeon est exceptionnelle. J\'ai pu apprendre à mon rythme et les projets pratiques m\'ont beaucoup aidé.',
    img: logo1,
    rating: 5,
    name: 'Emma Rousseau',
    position: 'Étudiante en design',
    avatar: avatar1,
  },
  {
    desc: 'Bourgeon m\'a permis de découvrir ma passion pour la programmation. L\'approche pédagogique est parfaite pour les débutants.',
    img: logo2,
    rating: 5,
    name: 'Pierre Moreau',
    position: 'Étudiant en mathématiques',
    avatar: avatar2,
  },
  {
    desc: 'Je recommande Bourgeon à tous les étudiants qui veulent se former en ligne. La plateforme est complète et les résultats sont au rendez-vous.',
    img: logo3,
    rating: 5,
    name: 'Camille Durand',
    position: 'Étudiante en commerce',
    avatar: avatar3,
  },
  {
    desc: 'Bourgeon a transformé ma façon d\'apprendre. Les cours sont interactifs et j\'ai pu développer des projets concrets.',
    img: logo4,
    rating: 5,
    name: 'Alexandre Petit',
    position: 'Étudiant en physique',
    avatar: avatar4,
  },
  {
    desc: 'La communauté Bourgeon est incroyable. J\'ai trouvé de l\'aide à chaque fois que j\'en avais besoin et j\'ai progressé rapidement.',
    img: logo2,
    rating: 5,
    name: 'Julie Laurent',
    position: 'Étudiante en biologie',
    avatar: avatar5,
  },
]

const customerReviewSwiper = ref(null)

const slide = (dir: string) => {
  const swiper = customerReviewSwiper.value?.swiper

  if (dir === 'prev')
    swiper.slidePrev()

  swiper.slideNext()
}
</script>

<template>
  <div
    id="customer-review"
    class="position-relative"
  >
    <div class="customer-reviews">
      <VContainer>
        <!-- 👉 Headers  -->
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
            <div
              class="headers d-flex justify-center flex-column align-start h-100"
              style="max-inline-size: 275px;"
            >
              <VChip
                label
                color="primary"
                class="mb-4"
                size="small"
              >
                Témoignages d'Étudiants
              </VChip>
              <div class="position-relative mb-1 me-2">
                <div class="section-title">
                  Ce que disent nos étudiants
                </div>
              </div>
              <p class="text-body-1 mb-12">
                Découvrez ce que nos étudiants pensent de leur expérience avec Bourgeon.
              </p>
              <div class="position-relative">
                <IconBtn
                  class="reviews-button-prev rounded me-4"
                  variant="tonal"
                  color="primary"
                  @click="slide('prev')"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    class="flip-in-rtl"
                  />
                </IconBtn>

                <IconBtn
                  class="reviews-button-next rounded"
                  variant="tonal"
                  color="primary"
                  @click="slide('next')"
                >
                  <VIcon
                    icon="tabler-chevron-right"
                    class="flip-in-rtl"
                  />
                </IconBtn>
              </div>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <!-- 👉 Customer Review Swiper -->
            <div class="swiper-reviews-carousel">
              <!-- eslint-disable vue/attribute-hyphenation -->
              <swiper-container
                ref="customerReviewSwiper"
                slides-per-view="1"
                space-between="20"
                loop="true"
                autoplay-delay="3000"
                autoplay-disable-on-interaction="false"
                events-prefix="swiper-"
                :injectStyles="[
                  `
                    .swiper{
                      padding-block: 12px;
                      padding-inline: 12px;
                      margin-inline: -12px;
                    }
                    .swiper-button-next, .swiper-button-prev{
                      visibility: hidden;
                    }
                  `,
                ]"
                navigation="{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }"
                :breakpoints="{
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  960: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  600: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                }"
              >
                <swiper-slide
                  v-for="(data, index) in reviewData"
                  :key="index"
                >
                  <VCard class="d-flex h-100 align-stretch">
                    <VCardText class="pa-6 d-flex flex-column justify-space-between align-start">
                      <img
                        :src="data.img"
                        style="block-size: 1.375rem;"
                        class="mb-3"
                      >
                      <p class="text-body-1">
                        {{ data.desc }}
                      </p>

                      <VRating
                        :model-value="data.rating"
                        color="warning"
                        density="compact"
                        class="mb-4"
                        readonly
                      />
                      <div class="d-flex align-center gap-x-3">
                        <VAvatar
                          :image="data.avatar"
                          size="32"
                        />
                        <div>
                          <h6 class="text-h6">
                            {{ data.name }}
                          </h6>

                          <div class="text-body-2 text-disabled">
                            {{ data.position }}
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </swiper-slide>
              </swiper-container>
            </div>
          </VCol>
        </VRow>
      </VContainer>

      <VDivider class="w-100 swiper-divider" />

      <VContainer>
        <!-- 👉 Brand-logo Swiper  -->
        <div class="swiper-brands-carousel">
          <swiper-container
            slides-per-view="2"
            :space-between="10"
            events-prefix="swiper-"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: true,
            }"
            :breakpoints="{
              992: {
                slidesPerView: 5,
              },
              768: {
                slidesPerView: 3,
              },
            }"
          >
            <swiper-slide
              v-for="(img, index) in [brandLogo1, brandLogo2, brandLogo3, brandLogo4, brandLogo5]"
              :key="index"
            >
              <VImg
                :src="img"
                height="38"
              />
            </swiper-slide>
          </swiper-container>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss">
@use "swiper/css/bundle";

swiper-container::part(bullet-active) {
  border-radius: 6px;
  background-color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  inline-size: 38px;
}

swiper-container::part(bullet) {
  background-color: rgba(var(--v-theme-on-background));
}

.swiper-divider {
  margin-block: 72px 1rem;
}

.swiper-reviews-carousel {
  swiper-container {
    .swiper {
      padding-block-end: 3rem;
    }

    .swiper-button-next {
      display: none;
    }
  }

  swiper-slide {
    block-size: auto;
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
.customer-reviews {
  padding-block: 72px 84px;
}

@media (max-width: 600px) {
  .customer-reviews {
    padding-block: 4rem;
  }
}

#customer-review {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgb(var(--v-theme-background));
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom/contain;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}
</style>
