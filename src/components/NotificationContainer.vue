<template>
  <div>
    <VSnackbar
      v-for="notification in notifications"
      :key="notification.id"
      :model-value="true"
      :color="notification.color"
      :timeout="notification.timeout"
      :location="notification.location"
      @update:model-value="remove(notification.id)"
    >
      <div class="d-flex align-center">
        <VIcon
          :icon="getIcon(notification.color)"
          class="me-2"
          size="20"
        />
        <span>{{ notification.message }}</span>
      </div>

      <template #actions>
        <VBtn
          variant="text"
          size="small"
          @click="remove(notification.id)"
        >
          Fermer
        </VBtn>
      </template>
    </VSnackbar>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'

const { notifications, remove } = useNotification()

const getIcon = (color: string) => {
  switch (color) {
    case 'success':
      return 'tabler-check-circle'
    case 'error':
      return 'tabler-alert-circle'
    case 'warning':
      return 'tabler-alert-triangle'
    case 'info':
      return 'tabler-info-circle'
    default:
      return 'tabler-info-circle'
  }
}
</script>

<style scoped>
.v-snackbar {
  z-index: 9999;
}
</style>
