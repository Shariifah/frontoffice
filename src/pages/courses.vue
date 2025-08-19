<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

// Données simulées des cours
const courses = ref([
  {
    id: 1,
    title: 'Introduction à la programmation',
    description: 'Apprenez les bases de la programmation avec des exemples pratiques',
    duration: '8 heures',
    level: 'Débutant',
    price: 'Gratuit',
    image: '/src/assets/images/courses/programming-basics.jpg',
    progress: 0,
  },
  {
    id: 2,
    title: 'Développement Web Frontend',
    description: 'Maîtrisez HTML, CSS et JavaScript pour créer des sites web modernes',
    duration: '12 heures',
    level: 'Intermédiaire',
    price: '19 000 FCFA',
    image: '/src/assets/images/courses/web-development.jpg',
    progress: 0,
  },
  {
    id: 3,
    title: 'Développement Web Backend',
    description: 'Apprenez à créer des APIs et des applications serveur',
    duration: '15 heures',
    level: 'Avancé',
    price: '19 000 FCFA',
    image: '/src/assets/images/courses/backend-development.jpg',
    progress: 0,
  },
  {
    id: 4,
    title: 'Base de données SQL',
    description: 'Concevez et gérez des bases de données relationnelles',
    duration: '10 heures',
    level: 'Intermédiaire',
    price: '19 000 FCFA',
    image: '/src/assets/images/courses/database.jpg',
    progress: 0,
  },
])
</script>

<template>
  <div class="courses-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <h2>Cours disponibles</h2>
              <VBtn
                color="primary"
                variant="outlined"
                to="/pricing"
              >
                Voir les tarifs
              </VBtn>
            </VCardTitle>
            <VCardText>
              <p class="text-body-1 mb-6">
                Découvrez notre collection de cours conçus pour vous accompagner dans votre apprentissage.
              </p>
              
              <VRow>
                <VCol
                  v-for="course in courses"
                  :key="course.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <VCard
                    variant="outlined"
                    class="course-card"
                  >
                    <VCardText>
                      <div class="d-flex align-center justify-space-between mb-4">
                        <VChip
                          :color="course.price === 'Gratuit' ? 'success' : 'primary'"
                          size="small"
                        >
                          {{ course.price }}
                        </VChip>
                        <VChip
                          :color="course.level === 'Débutant' ? 'success' : course.level === 'Intermédiaire' ? 'warning' : 'error'"
                          size="small"
                        >
                          {{ course.level }}
                        </VChip>
                      </div>
                      
                      <h4 class="text-h6 mb-2">
                        {{ course.title }}
                      </h4>
                      
                      <p class="text-body-2 mb-4">
                        {{ course.description }}
                      </p>
                      
                      <div class="d-flex align-center justify-space-between mb-4">
                        <div class="d-flex align-center">
                          <VIcon
                            icon="tabler-clock"
                            size="16"
                            class="me-1"
                          />
                          <span class="text-caption">{{ course.duration }}</span>
                        </div>
                        
                        <div class="d-flex align-center">
                          <VIcon
                            icon="tabler-book"
                            size="16"
                            class="me-1"
                          />
                          <span class="text-caption">Cours complet</span>
                        </div>
                      </div>
                      
                      <VBtn
                        block
                        :color="course.price === 'Gratuit' ? 'success' : 'primary'"
                        variant="tonal"
                        :to="course.price === 'Gratuit' ? `/course/${course.id}` : '/pricing'"
                      >
                        {{ course.price === 'Gratuit' ? 'Commencer' : 'Souscrire' }}
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped>
.courses-container {
  padding: 2rem 0;
}

.course-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.course-card:hover {
  transform: translateY(-4px);
}
</style>
