import { ref, readonly, onMounted, onUnmounted } from 'vue'

interface NotificationData {
  type?: string
  event?: string
  title?: string
  message: string
  priority?: string
  [key: string]: any
}

interface NotificationItem {
  id: number
  type: string
  icon: string
  title: string
  message: string
  timestamp: number
}

const eventListeners: Record<string, Array<(data: NotificationData) => void>> = {}
const notifications = ref<NotificationItem[]>([])
let eventSource: EventSource | null = null
let reconnectTimeout: number | null = null
let reconnectAttempts = 0
const reconnectDelay = 3000
const maxReconnectDelay = 30000
let streamUrl = ''

const icons: Record<string, string> = {
  order_status_update: '📦',
  order_ready: '✅',
  order_delivered: '🎉',
  waiter_accepted: '👍',
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌'
}

let notificationId = 0

function getIcon(type: string): string {
  return icons[type] || icons.info || '🔔'
}

function connect(url: string) {
  if (eventSource) {
    console.log('[useNotifications] Already connected')
    return
  }

  streamUrl = url
  console.log('[useNotifications] Connecting to:', url)

  try {
    eventSource = new EventSource(url)

    eventSource.onopen = () => {
      console.log('[useNotifications] Connection established')
      reconnectAttempts = 0
    }

    eventSource.onmessage = (event) => {
      try {
        const data: NotificationData = JSON.parse(event.data)
        console.log('[useNotifications] Received message:', data)
        handleEvent(data)
      } catch (error) {
        console.error('[useNotifications] Error parsing message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('[useNotifications] Connection error:', error)
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
      reconnect()
    }
  } catch (error) {
    console.error('[useNotifications] Failed to create EventSource:', error)
    reconnect()
  }
}

function reconnect() {
  reconnectAttempts += 1
  const delay = Math.min(
    reconnectDelay * Math.pow(1.5, reconnectAttempts - 1),
    maxReconnectDelay
  )

  console.log(`[useNotifications] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})...`)
  reconnectTimeout = window.setTimeout(() => connect(streamUrl), delay)
}

function handleEvent(data: NotificationData) {
  const eventType = data.type || data.event || 'notification'

  if (eventListeners[eventType]) {
    eventListeners[eventType].forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error(`[useNotifications] Error in event handler for ${eventType}:`, error)
      }
    })
  }

  if (eventListeners.all) {
    eventListeners.all.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error('[useNotifications] Error in "all" event handler:', error)
      }
    })
  }

  if (data.message) {
    showUINotification(data)
  }
}

function showUINotification(data: NotificationData) {
  const item: NotificationItem = {
    id: ++notificationId,
    type: data.priority || data.type || 'info',
    icon: getIcon(data.type || data.priority || 'info'),
    title: data.title || 'Notificación',
    message: data.message,
    timestamp: Date.now()
  }

  notifications.value.push(item)

  const timeout = 5000
  setTimeout(() => {
    removeNotification(item.id)
  }, timeout)
}

function removeNotification(id: number) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

export function useNotifications() {
  const connected = ref(false)

  function on(eventType: string, callback: (data: NotificationData) => void) {
    if (!eventListeners[eventType]) {
      eventListeners[eventType] = []
    }
    eventListeners[eventType].push(callback)
  }

  function off(eventType: string, callback: (data: NotificationData) => void) {
    if (!eventListeners[eventType]) return
    eventListeners[eventType] = eventListeners[eventType].filter(cb => cb !== callback)
  }

  function disconnect() {
    console.log('[useNotifications] Disconnecting...')
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
    connected.value = false
  }

  onMounted(() => {
    console.log('[useNotifications] Component mounted')
  })

  onUnmounted(() => {
    console.log('[useNotifications] Component unmounted')
  })

  return {
    notifications: readonly(notifications),
    connected,
    connect,
    disconnect,
    on,
    off,
    removeNotification
  }
}

export function showNotification(message: string, type: string = 'info', title?: string) {
  showUINotification({ type, message, title } as NotificationData)
}

export function connectNotifications(url: string) {
  connect(url)
}
