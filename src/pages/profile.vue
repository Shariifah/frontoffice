<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user, logout } = useAuth()

const profileData = ref({
  firstname: 'Jean',
  lastname: 'Dupont',
  email: 'jean.dupont@email.com',
  phonenumber: '+226 70 12 34 56',
  country: 'Burkina Faso',
  city: 'Ouagadougou',
  bio: 'Étudiant passionné par le développement web et les nouvelles technologies.',
  joinDate: '2024-01-15',
  subscription: 'Premium',
  subscriptionEnd: '2024-12-31',
})

const isEditing = ref(false)
</script>

<template>
  <div class="profile-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <h2>Mon profil</h2>
              <VBtn
                color="error"
                variant="outlined"
                @click="logout"
              >
                Déconnexion
              </VBtn>
            </VCardTitle>
            <VCardText>
              <!-- Informations personnelles -->
              <VRow>
                <VCol
                  cols="12"
                  md="4"
                >
                  <VCard
                    variant="outlined"
                    class="text-center"
                  >
                    <VCardText>
                      <VAvatar
                        size="120"
                        color="primary"
                        class="mb-4"
                      >
                        <span class="text-h4">
                          {{ profileData.firstname.charAt(0) }}{{ profileData.lastname.charAt(0) }}
                        </span>
                      </VAvatar>
                      
                      <h3 class="text-h5 mb-2">
                        {{ profileData.firstname }} {{ profileData.lastname }}
                      </h3>
                      
                      <p class="text-body-2 text-medium-emphasis mb-4">
                        Membre depuis {{ new Date(profileData.joinDate).toLocaleDateString('fr-FR') }}
                      </p>
                      
                      <VChip
                        color="primary"
                        size="small"
                      >
                        {{ profileData.subscription }}
                      </VChip>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="8"
                >
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle class="d-flex justify-space-between align-center">
                      <h4 class="text-h6">
                        Informations personnelles
                      </h4>
                      <VBtn
                        size="small"
                        color="primary"
                        variant="tonal"
                        @click="isEditing = !isEditing"
                      >
                        {{ isEditing ? 'Annuler' : 'Modifier' }}
                      </VBtn>
                    </VCardTitle>
                    <VCardText>
                      <VForm>
                        <VRow>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              v-model="profileData.firstname"
                              label="Prénom"
                              variant="outlined"
                              :readonly="!isEditing"
                            />
                          </VCol>
                          
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              v-model="profileData.lastname"
                              label="Nom"
                              variant="outlined"
                              :readonly="!isEditing"
                            />
                          </VCol>
                          
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              v-model="profileData.email"
                              label="Email"
                              type="email"
                              variant="outlined"
                              :readonly="!isEditing"
                            />
                          </VCol>
                          
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              v-model="profileData.phonenumber"
                              label="Téléphone"
                              variant="outlined"
                              :readonly="!isEditing"
                            />
                          </VCol>
                          
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              v-model="profileData.country"
                              label="Pays"
                              variant="outlined"
                              :readonly="!isEditing"
                            />
                          </VCol>
                          
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              v-model="profileData.city"
                              label="Ville"
                              variant="outlined"
                              :readonly="!isEditing"
                            />
                          </VCol>
                          
                          <VCol cols="12">
                            <VTextField
                              v-model="profileData.bio"
                              label="Bio"
                              variant="outlined"
                              type="textarea"
                              rows="3"
                              :readonly="!isEditing"
                            />
                          </VCol>
                        </VRow>
                        
                        <div
                          v-if="isEditing"
                          class="d-flex gap-2 mt-4"
                        >
                          <VBtn
                            color="primary"
                            @click="isEditing = false"
                          >
                            Sauvegarder
                          </VBtn>
                          <VBtn
                            variant="outlined"
                            @click="isEditing = false"
                          >
                            Annuler
                          </VBtn>
                        </div>
                      </VForm>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Abonnement -->
              <VRow class="mt-6">
                <VCol cols="12">
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Informations d'abonnement
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <VRow>
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-crown"
                              size="24"
                              color="primary"
                              class="me-3"
                            />
                            <div>
                              <p class="text-body-2 mb-0">
                                Plan actuel
                              </p>
                              <p class="text-body-1 font-weight-medium">
                                {{ profileData.subscription }}
                              </p>
                            </div>
                          </div>
                        </VCol>
                        
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-calendar"
                              size="24"
                              color="primary"
                              class="me-3"
                            />
                            <div>
                              <p class="text-body-2 mb-0">
                                Expire le
                              </p>
                              <p class="text-body-1 font-weight-medium">
                                {{ new Date(profileData.subscriptionEnd).toLocaleDateString('fr-FR') }}
                              </p>
                            </div>
                          </div>
                        </VCol>
                        
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VBtn
                            color="primary"
                            variant="outlined"
                            to="/pricing"
                          >
                            Gérer l'abonnement
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Actions -->
              <VRow class="mt-6">
                <VCol cols="12">
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Actions
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <VRow>
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VBtn
                            block
                            color="primary"
                            variant="outlined"
                            to="/progress"
                          >
                            <VIcon
                              icon="tabler-chart-line"
                              class="me-2"
                            />
                            Voir ma progression
                          </VBtn>
                        </VCol>
                        
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VBtn
                            block
                            color="success"
                            variant="outlined"
                            to="/certificates"
                          >
                            <VIcon
                              icon="tabler-certificate"
                              class="me-2"
                            />
                            Mes certificats
                          </VBtn>
                        </VCol>
                        
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VBtn
                            block
                            color="warning"
                            variant="outlined"
                            to="/support"
                          >
                            <VIcon
                              icon="tabler-help"
                              class="me-2"
                            />
                            Support
                          </VBtn>
                        </VCol>
                      </VRow>
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
.profile-container {
  padding: 2rem 0;
}
</style>
