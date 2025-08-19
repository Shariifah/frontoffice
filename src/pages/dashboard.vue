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
