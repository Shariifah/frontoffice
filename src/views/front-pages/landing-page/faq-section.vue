<script setup lang="ts">
import boyWithLogo from '@images/logo.png';

const faqData = [
  {
    question: 'Comment fonctionne l\'inscription sur Bourgeon ?',
    answer: 'L\'inscription est simple et sécurisée. Entrez votre numéro de téléphone, recevez un code de vérification par SMS, puis complétez votre profil avec vos informations personnelles. Le processus prend moins de 5 minutes.',
  },
  {
    question: 'Les cours sont-ils gratuits ou payants ?',
    answer: 'Bourgeon propose une gamme de cours gratuits pour commencer, ainsi que des formations premium pour approfondir vos compétences. Chaque cours est clairement étiqueté avec son statut tarifaire.',
  },
  {
    question: 'Puis-je accéder aux cours hors ligne ?',
    answer: 'Oui, vous pouvez télécharger certains cours pour les consulter hors ligne. Cette fonctionnalité est disponible pour les cours premium et vous permet d\'apprendre même sans connexion internet.',
  },
  {
    question: 'Comment puis-je obtenir de l\'aide si j\'ai des difficultés ?',
    answer: 'Notre équipe de support est disponible 24h/24 et 7j/7. Vous pouvez nous contacter via le chat en ligne, par email ou par téléphone. Nous répondons généralement dans les 2 heures.',
  },
  {
    question: 'Puis-je annuler mon abonnement à tout moment ?',
    answer: 'Absolument ! Vous pouvez annuler votre abonnement à tout moment depuis votre espace personnel. Aucun frais de résiliation ne vous sera facturé.',
  },
]
</script>

<template>
  <div id="faq">
    <VContainer>
      <!-- 👉 Header  -->
      <div class="faq-section">
        <div class="headers d-flex justify-center flex-column align-center">
          <VChip
            label
            color="primary"
            size="small"
            class="mb-4"
          >
            FAQ
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            Questions
            <div class="position-relative ms-2">
              <div class="section-title">
                Fréquentes
              </div>
            </div>
          </h4>
          <p class="text-body-1 mb-0">
            Parcourez ces FAQ pour trouver des réponses aux questions les plus courantes.
          </p>
        </div>
        <VRow>
          <VCol
            cols="12"
            md="5"
          >
            <div class="pt-10 d-flex align-center justify-center h-100">
              <VImg
                :src="boyWithLogo"
                height="330"
                width="330"
              />
            </div>
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VExpansionPanels class="pt-16">
              <VExpansionPanel
                v-for="faq in faqData"
                :key="faq.question"
              >
                <VExpansionPanelTitle>
                  {{ faq.question }}
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ faq.answer }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.faq-section {
  margin-block: 5.25rem;
}

@media (max-width: 600px) {
  .faq-section {
    margin-block: 4rem;
  }
}

#faq {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgba(var(--v-theme-background));
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 130%;
  inset-block-end: 12%;
  inset-inline-start: -12%;
}
</style>
