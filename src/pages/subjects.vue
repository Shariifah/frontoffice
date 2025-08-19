<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

// Données simulées des sujets
const subjects = ref([
  {
    id: 1,
    title: 'Mathématiques - Niveau Terminale',
    subject: 'Mathématiques',
    level: 'Terminale',
    duration: '3 heures',
    questions: 25,
    available: true,
    period: 'Janvier 2024',
    description: 'Sujet complet de mathématiques couvrant l\'algèbre, la géométrie et l\'analyse.',
    image: '/src/assets/images/subjects/math.jpg',
  },
  {
    id: 2,
    title: 'Physique-Chimie - Niveau Terminale',
    subject: 'Physique-Chimie',
    level: 'Terminale',
    duration: '3 heures',
    questions: 20,
    available: true,
    period: 'Janvier 2024',
    description: 'Sujet de physique-chimie avec exercices pratiques et théoriques.',
    image: '/src/assets/images/subjects/physics.jpg',
  },
  {
    id: 3,
    title: 'Français - Niveau Terminale',
    subject: 'Français',
    level: 'Terminale',
    duration: '4 heures',
    questions: 15,
    available: true,
    period: 'Janvier 2024',
    description: 'Composition française avec commentaire de texte et dissertation.',
    image: '/src/assets/images/subjects/french.jpg',
  },
  {
    id: 4,
    title: 'Histoire-Géographie - Niveau Terminale',
    subject: 'Histoire-Géographie',
    level: 'Terminale',
    duration: '3 heures',
    questions: 18,
    available: false,
    period: 'Février 2024',
    description: 'Sujet d\'histoire-géographie avec cartographie et analyse documentaire.',
    image: '/src/assets/images/subjects/history.jpg',
  },
])

const selectedSubject = ref('')
const selectedLevel = ref('')

const subjectsFilter = computed(() => {
  let filtered = subjects.value

  if (selectedSubject.value) {
    filtered = filtered.filter(s => s.subject === selectedSubject.value)
  }

  if (selectedLevel.value) {
    filtered = filtered.filter(s => s.level === selectedLevel.value)
  }

  return filtered
})

const availableSubjects = computed(() => subjects.value.map(s => s.subject).filter((v, i, a) => a.indexOf(v) === i))
const availableLevels = computed(() => subjects.value.map(s => s.level).filter((v, i, a) => a.indexOf(v) === i))
</script>

<template>
  <div class="subjects-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <h2>Sujets disponibles</h2>
              <VBtn
                color="primary"
                variant="outlined"
                to="/subscription"
              >
                Vérifier mon abonnement
              </VBtn>
            </VCardTitle>
            <VCardText>
              <p class="text-body-1 mb-6">
                Consultez les sujets disponibles pour la composition selon votre abonnement et la période de disponibilité.
              </p>
              
              <!-- Filtres -->
              <VRow class="mb-6">
                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="selectedSubject"
                    label="Filtrer par matière"
                    :items="availableSubjects"
                    clearable
                    variant="outlined"
                    prepend-inner-icon="tabler-book"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="selectedLevel"
                    label="Filtrer par niveau"
                    :items="availableLevels"
                    clearable
                    variant="outlined"
                    prepend-inner-icon="tabler-school"
                  />
                </VCol>
              </VRow>
              
              <!-- Liste des sujets -->
              <VRow>
                <VCol
                  v-for="subject in subjectsFilter"
                  :key="subject.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <VCard
                    variant="outlined"
                    class="subject-card"
                    :class="{ 'disabled': !subject.available }"
                  >
                    <VCardText>
                      <div class="d-flex align-center justify-space-between mb-4">
                        <VChip
                          :color="subject.available ? 'success' : 'warning'"
                          size="small"
                        >
                          {{ subject.available ? 'Disponible' : 'Bientôt disponible' }}
                        </VChip>
                        <VChip
                          color="primary"
                          size="small"
                        >
                          {{ subject.subject }}
                        </VChip>
                      </div>
                      
                      <h4 class="text-h6 mb-2">
                        {{ subject.title }}
                      </h4>
                      
                      <p class="text-body-2 mb-4">
                        {{ subject.description }}
                      </p>
                      
                      <div class="mb-4">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-clock"
                              size="16"
                              class="me-1"
                            />
                            <span class="text-caption">{{ subject.duration }}</span>
                          </div>
                          
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-help"
                              size="16"
                              class="me-1"
                            />
                            <span class="text-caption">{{ subject.questions }} questions</span>
                          </div>
                        </div>
                        
                        <div class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-calendar"
                              size="16"
                              class="me-1"
                            />
                            <span class="text-caption">{{ subject.period }}</span>
                          </div>
                          
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-school"
                              size="16"
                              class="me-1"
                            />
                            <span class="text-caption">{{ subject.level }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <VBtn
                        v-if="subject.available"
                        block
                        color="primary"
                        variant="tonal"
                        :to="`/subject/${subject.id}`"
                      >
                        <VIcon
                          icon="tabler-eye"
                          size="16"
                          class="me-2"
                        />
                        Consulter le sujet
                      </VBtn>
                      
                      <VBtn
                        v-else
                        block
                        color="warning"
                        variant="tonal"
                        disabled
                      >
                        <VIcon
                          icon="tabler-clock"
                          size="16"
                          class="me-2"
                        />
                        Disponible le {{ subject.period }}
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Informations importantes -->
              <VRow class="mt-8">
                <VCol cols="12">
                  <VCard
                    variant="outlined"
                    color="info"
                  >
                    <VCardText>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-info-circle"
                          size="24"
                          color="info"
                          class="me-3"
                        />
                        <div>
                          <h5 class="text-h6 mb-1">
                            Informations importantes
                          </h5>
                          <ul class="text-body-2 mb-0">
                            <li>Les sujets sont consultables en lecture seule (PDF)</li>
                            <li>Le téléchargement des sujets est désactivé</li>
                            <li>Chaque sujet ne peut être composé qu'une seule fois</li>
                            <li>La note est affichée immédiatement après soumission</li>
                            <li>Assurez-vous que votre abonnement est actif</li>
                          </ul>
                        </div>
                      </div>
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
.subjects-container {
  padding: 2rem 0;
}

.subject-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.subject-card:hover {
  transform: translateY(-4px);
}

.subject-card.disabled {
  opacity: 0.7;
}
</style>
