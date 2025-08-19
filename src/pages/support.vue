<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    middleware: 'auth',
  },
})

const { user } = useAuth()

const supportTopics = ref([
  {
    id: 1,
    title: 'Comment commencer un cours ?',
    category: 'Démarrage',
    description: 'Guide pour commencer votre premier cours sur la plateforme',
  },
  {
    id: 2,
    title: 'Problèmes de paiement',
    category: 'Paiement',
    description: 'Résolution des problèmes liés aux paiements et abonnements',
  },
  {
    id: 3,
    title: 'Problèmes techniques',
    category: 'Technique',
    description: 'Aide pour les problèmes techniques et de navigation',
  },
  {
    id: 4,
    title: 'Certificats et diplômes',
    category: 'Certification',
    description: 'Informations sur l\'obtention et la validation des certificats',
  },
])

const contactInfo = ref({
  email: 'support@bourgeon.app',
  phone: '+226 70 25 44 30',
  address: 'Ouagadougou, Burkina Faso',
  workingHours: 'Lun-Ven: 8h-18h, Sam: 9h-13h',
})
</script>

<template>
  <div class="support-container">
    <VContainer>
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>
              <h2>Support et aide</h2>
            </VCardTitle>
            <VCardText>
              <p class="text-body-1 mb-6">
                Nous sommes là pour vous aider. Consultez nos guides ou contactez-nous directement.
              </p>
              
              <!-- Rubriques d'aide -->
              <h3 class="text-h5 mb-4">
                Rubriques d'aide
              </h3>
              
              <VRow class="mb-8">
                <VCol
                  v-for="topic in supportTopics"
                  :key="topic.id"
                  cols="12"
                  md="6"
                  lg="3"
                >
                  <VCard
                    variant="outlined"
                    class="support-topic-card"
                  >
                    <VCardText>
                      <div class="d-flex align-center mb-3">
                        <VIcon
                          icon="tabler-help"
                          size="24"
                          color="primary"
                          class="me-3"
                        />
                        <VChip
                          size="small"
                          color="primary"
                          variant="tonal"
                        >
                          {{ topic.category }}
                        </VChip>
                      </div>
                      
                      <h4 class="text-h6 mb-2">
                        {{ topic.title }}
                      </h4>
                      
                      <p class="text-body-2 mb-4">
                        {{ topic.description }}
                      </p>
                      
                      <VBtn
                        block
                        color="primary"
                        variant="tonal"
                        size="small"
                      >
                        Voir l'aide
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- Contact direct -->
              <h3 class="text-h5 mb-4">
                Contactez-nous
              </h3>
              
              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Informations de contact
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <div class="d-flex align-center mb-4">
                        <VIcon
                          icon="tabler-mail"
                          size="20"
                          color="primary"
                          class="me-3"
                        />
                        <div>
                          <p class="text-body-2 mb-0">
                            Email
                          </p>
                          <p class="text-body-1 font-weight-medium">
                            {{ contactInfo.email }}
                          </p>
                        </div>
                      </div>
                      
                      <div class="d-flex align-center mb-4">
                        <VIcon
                          icon="tabler-phone"
                          size="20"
                          color="primary"
                          class="me-3"
                        />
                        <div>
                          <p class="text-body-2 mb-0">
                            Téléphone
                          </p>
                          <p class="text-body-1 font-weight-medium">
                            {{ contactInfo.phone }}
                          </p>
                        </div>
                      </div>
                      
                      <div class="d-flex align-center mb-4">
                        <VIcon
                          icon="tabler-map-pin"
                          size="20"
                          color="primary"
                          class="me-3"
                        />
                        <div>
                          <p class="text-body-2 mb-0">
                            Adresse
                          </p>
                          <p class="text-body-1 font-weight-medium">
                            {{ contactInfo.address }}
                          </p>
                        </div>
                      </div>
                      
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-clock"
                          size="20"
                          color="primary"
                          class="me-3"
                        />
                        <div>
                          <p class="text-body-2 mb-0">
                            Heures d'ouverture
                          </p>
                          <p class="text-body-1 font-weight-medium">
                            {{ contactInfo.workingHours }}
                          </p>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
                
                <VCol
                  cols="12"
                  md="6"
                >
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Envoyer un message
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <VForm>
                        <VTextField
                          label="Sujet"
                          placeholder="Votre sujet"
                          variant="outlined"
                          class="mb-4"
                        />
                        
                        <VTextField
                          label="Message"
                          placeholder="Décrivez votre problème..."
                          variant="outlined"
                          type="textarea"
                          rows="4"
                          class="mb-4"
                        />
                        
                        <VBtn
                          block
                          color="primary"
                        >
                          Envoyer le message
                        </VBtn>
                      </VForm>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
              
              <!-- FAQ rapide -->
              <VRow class="mt-8">
                <VCol cols="12">
                  <VCard
                    variant="outlined"
                  >
                    <VCardTitle>
                      <h4 class="text-h6">
                        Questions fréquentes
                      </h4>
                    </VCardTitle>
                    <VCardText>
                      <VExpansionPanels>
                        <VExpansionPanel>
                          <VExpansionPanelTitle>
                            Comment puis-je annuler mon abonnement ?
                          </VExpansionPanelTitle>
                          <VExpansionPanelText>
                            Vous pouvez annuler votre abonnement à tout moment depuis votre espace personnel. Aucun frais de résiliation ne vous sera facturé.
                          </VExpansionPanelText>
                        </VExpansionPanel>
                        
                        <VExpansionPanel>
                          <VExpansionPanelTitle>
                            Les cours sont-ils accessibles hors ligne ?
                          </VExpansionPanelTitle>
                          <VExpansionPanelText>
                            Oui, vous pouvez télécharger certains cours pour les consulter hors ligne. Cette fonctionnalité est disponible pour les cours premium.
                          </VExpansionPanelText>
                        </VExpansionPanel>
                        
                        <VExpansionPanel>
                          <VExpansionPanelTitle>
                            Comment obtenir mon certificat ?
                          </VExpansionPanelTitle>
                          <VExpansionPanelText>
                            Votre certificat sera automatiquement généré et disponible au téléchargement une fois que vous aurez terminé le cours avec un score minimum de 70%.
                          </VExpansionPanelText>
                        </VExpansionPanel>
                      </VExpansionPanels>
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
.support-container {
  padding: 2rem 0;
}

.support-topic-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.support-topic-card:hover {
  transform: translateY(-4px);
}
</style>
