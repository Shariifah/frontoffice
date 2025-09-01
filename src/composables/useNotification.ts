import { readonly, ref } from 'vue'

interface NotificationOptions {
  color?: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
  location?: 'top' | 'bottom'
}

interface Notification {
  id: number
  message: string
  color: string
  timeout: number
  location: string
}

const notifications = ref<Notification[]>([])
let nextId = 1

export const useNotification = () => {
  const show = (message: string, options: NotificationOptions = {}) => {
    const {
      color = 'info',
      timeout = 5000,
      location = 'top'
    } = options

    const notification: Notification = {
      id: nextId++,
      message,
      color,
      timeout,
      location
    }

    notifications.value.push(notification)

    // Auto-remove notification after timeout
    if (timeout > 0) {
      setTimeout(() => {
        remove(notification.id)
      }, timeout)
    }

    return notification.id
  }

  const remove = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, options?: Omit<NotificationOptions, 'color'>) => {
    return show(message, { ...options, color: 'success' })
  }

  const error = (message: string, options?: Omit<NotificationOptions, 'color'>) => {
    return show(message, { ...options, color: 'error' })
  }

  const warning = (message: string, options?: Omit<NotificationOptions, 'color'>) => {
    return show(message, { ...options, color: 'warning' })
  }

  const info = (message: string, options?: Omit<NotificationOptions, 'color'>) => {
    return show(message, { ...options, color: 'info' })
  }

  return {
    notifications: readonly(notifications),
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}


