<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user, logout } = useAuth()
</script>

<template>
  <div class="dashboard-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <h2>Tableau de bord - Bourgeon</h2>
              <VBtn
                color="error"
                variant="outlined"
                @click="logout"
              >
                Déconnexion
              </VBtn>
            </VCardTitle>
            <VCardText>
              <div v-if="user">
                <h3>Bienvenue {{ user.firstname }} {{ user.lastname }} !</h3>
                <p>Numéro de téléphone : {{ user.phonenumber }}</p>
                <p>Rôle : {{ user.role }}</p>
                <p>Statut : {{ user.status }}</p>
                
                <!-- Statistiques rapides -->
                <VRow class="mt-6">
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <VCard
                      variant="outlined"
                      class="text-center"
                    >
                      <VCardText>
                        <h4 class="text-h4 text-primary mb-2">
                          6
                        </h4>
                        <p class="text-body-2">
                          Compositions terminées
                        </p>
                      </VCardText>
                    </VCard>
                  </VCol>
                  
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <VCard
                      variant="outlined"
                      class="text-center"
                    >
                      <VCardText>
                        <h4 class="text-h4 text-success mb-2">
                          78.5%
                        </h4>
                        <p class="text-body-2">
                          Moyenne générale
                        </p>
                      </VCardText>
                    </VCard>
                  </VCol>
                  
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <VCard
                      variant="outlined"
                      class="text-center"
                    >
                      <VCardText>
                        <h4 class="text-h4 text-warning mb-2">
                          4
                        </h4>
                        <p class="text-body-2">
                          Matières étudiées
                        </p>
                      </VCardText>
                    </VCard>
                  </VCol>
                  
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <VCard
                      variant="outlined"
                      class="text-center"
                    >
                      <VCardText>
                        <h4 class="text-h4 text-info mb-2">
                          Premium
                        </h4>
                        <p class="text-body-2">
                          Plan d'abonnement
                        </p>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
                
                <!-- Actions rapides -->
                <VRow class="mt-6">
                  <VCol cols="12">
                    <h4 class="text-h5 mb-4">
                      Actions rapides
                    </h4>
                    <div class="d-flex gap-3 flex-wrap">
                      <VBtn
                        color="primary"
                        variant="tonal"
                        to="/subjects"
                      >
                        <VIcon
                          icon="tabler-book"
                          class="me-2"
                        />
                        Nouvelle composition
                      </VBtn>
                      
                      <VBtn
                        color="success"
                        variant="tonal"
                        to="/compositions"
                      >
                        <VIcon
                          icon="tabler-pencil"
                          class="me-2"
                        />
                        Mes compositions
                      </VBtn>
                      
                      <VBtn
                        color="warning"
                        variant="tonal"
                        to="/performance"
                      >
                        <VIcon
                          icon="tabler-chart-line"
                          class="me-2"
                        />
                        Mes performances
                      </VBtn>
                      
                      <VBtn
                        color="info"
                        variant="tonal"
                        to="/subscription"
                      >
                        <VIcon
                          icon="tabler-crown"
                          class="me-2"
                        />
                        Mon abonnement
                      </VBtn>
                    </div>
                  </VCol>
                </VRow>
              </div>
              <div v-else>
                <p>Chargement des informations utilisateur...</p>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 2rem 0;
}
</style>
