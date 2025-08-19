<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

// Données simulées des certificats
const certificates = ref([
  {
    id: 1,
    title: 'Certificat de programmation de base',
    course: 'Introduction à la programmation',
    issuedDate: '2024-01-15',
    score: 95,
    status: 'Obtenu',
    downloadUrl: '#',
  },
  {
    id: 2,
    title: 'Certificat de développement web',
    course: 'Développement Web Frontend',
    issuedDate: '2024-02-20',
    score: 88,
    status: 'Obtenu',
    downloadUrl: '#',
  },
  {
    id: 3,
    title: 'Certificat JavaScript',
    course: 'JavaScript Avancé',
    issuedDate: null,
    score: null,
    status: 'En cours',
    downloadUrl: null,
  },
])
</script>

<template>
  <div class="certificates-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>
              <h2>Mes certificats</h2>
            </VCardTitle>
            <VCardText>
              <p class="text-body-1 mb-6">
                Consultez et téléchargez vos certificats obtenus après avoir terminé les cours.
              </p>
              
              <VRow>
                <VCol
                  v-for="certificate in certificates"
                  :key="certificate.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <VCard
                    variant="outlined"
                    class="certificate-card"
                  >
                    <VCardText>
                      <div class="d-flex align-center justify-space-between mb-4">
                        <VChip
                          :color="certificate.status === 'Obtenu' ? 'success' : 'warning'"
                          size="small"
                        >
                          {{ certificate.status }}
                        </VChip>
                        <VIcon
                          icon="tabler-certificate"
                          size="24"
                          color="primary"
                        />
                      </div>
                      
                      <h4 class="text-h6 mb-2">
                        {{ certificate.title }}
                      </h4>
                      
                      <p class="text-body-2 mb-4">
                        Cours : {{ certificate.course }}
                      </p>
                      
                      <div class="mb-4">
                        <div
                          v-if="certificate.score"
                          class="d-flex align-center justify-space-between mb-2"
                        >
                          <span class="text-caption">
                            Score obtenu
                          </span>
                          <span class="text-caption font-weight-bold">
                            {{ certificate.score }}%
                          </span>
                        </div>
                        
                        <div
                          v-if="certificate.issuedDate"
                          class="d-flex align-center justify-space-between"
                        >
                          <span class="text-caption">
                            Date d'obtention
                          </span>
                          <span class="text-caption">
                            {{ new Date(certificate.issuedDate).toLocaleDateString('fr-FR') }}
                          </span>
                        </div>
                      </div>
                      
                      <VBtn
                        v-if="certificate.status === 'Obtenu'"
                        block
                        color="primary"
                        variant="tonal"
                        :href="certificate.downloadUrl"
                        target="_blank"
                      >
                        <VIcon
                          icon="tabler-download"
                          size="16"
                          class="me-2"
                        />
                        Télécharger
                      </VBtn>
                      
                      <VBtn
                        v-else
                        block
                        color="warning"
                        variant="tonal"
                        disabled
                      >
                        En cours d'obtention
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Statistiques -->
              <VRow class="mt-8">
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-success mb-2">
                        {{ certificates.filter(c => c.status === 'Obtenu').length }}
                      </h3>
                      <p class="text-body-2">
                        Certificats obtenus
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-warning mb-2">
                        {{ certificates.filter(c => c.status === 'En cours').length }}
                      </h3>
                      <p class="text-body-2">
                        En cours d'obtention
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <h3 class="text-h3 text-primary mb-2">
                        {{ certificates.filter(c => c.score).reduce((acc, c) => acc + c.score, 0) / certificates.filter(c => c.score).length || 0 }}%
                      </h3>
                      <p class="text-body-2">
                        Score moyen
                      </p>
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
.certificates-container {
  padding: 2rem 0;
}

.certificate-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.certificate-card:hover {
  transform: translateY(-4px);
}
</style>
