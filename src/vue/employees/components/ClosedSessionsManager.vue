<template>
  <div class="sessions-manager">
    <div v-if="loading" class="sessions-loading">
      <div class="loading-spinner"></div>
      <p>Cargando sesiones...</p>
    </div>

    <div v-else-if="closedSessions.length === 0" class="sessions-empty">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <p>No hay órdenes cerradas en las últimas 24 horas.</p>
    </div>

    <template v-else>
      <div class="sessions-list">
        <article
          v-for="session in paginatedSessions"
          :key="session.id"
          class="session-card session-card--closed"
          :data-session-id="session.id"
        >
          <div class="session-card__flag session-card__flag--closed">Cerrada</div>
          <header class="session-card__header">
            <h3>Cuenta #{{ session.id }} · Mesa {{ session.table_number || 'N/A' }}</h3>
            <span class="session-status session-status--closed">{{ formatDate(session.closed_at) }}</span>
          </header>
          <div class="session-card__info">
            <p><strong>Cliente:</strong> {{ session.customer_name || 'N/A' }}</p>
            <p><strong>Método de pago:</strong> {{ session.payment_method || 'N/A' }}</p>
            <p v-if="session.payment_reference"><strong>Referencia:</strong> {{ session.payment_reference }}</p>
            <p><strong>Órdenes:</strong> {{ session.orders_count }}</p>
          </div>
          <div class="session-card__totals">
            <span>Subtotal: {{ formatCurrency(session.subtotal) }}</span>
            <span>IVA: {{ formatCurrency(session.tax_amount) }}</span>
            <span>Propina: {{ formatCurrency(session.tip_amount) }}</span>
            <strong>Total: {{ formatCurrency(session.total_amount) }}</strong>
          </div>
          <div class="session-card__actions">
            <button type="button" class="btn btn--secondary" @click="reprintTicket(session.id)">
              Reimprimir ticket
            </button>
            <button type="button" class="btn btn--outline" @click="openResendModal(session)">
              Reenviar por email
            </button>
          </div>
        </article>
      </div>

      <PaginationControls
        v-if="totalPages > 1"
        :total-items="closedSessions.length"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        @page-change="handlePageChange"
      />
    </template>

    <Teleport to="body">
      <div v-if="showResendModal" class="modal active" @click.self="closeResendModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Reenviar Ticket #{{ selectedSession?.id }}</h2>
            <button class="modal-close" @click="closeResendModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form @submit.prevent="resendTicket">
            <div class="modal-body">
              <div class="form-group">
                <label for="resend-email">Correo electrónico</label>
                <input
                  type="email"
                  id="resend-email"
                  v-model="resendEmail"
                  placeholder="cliente@email.com"
                  required
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeResendModal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="sending">
                {{ sending ? 'Enviando...' : 'Enviar ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PaginationControls from '../../shared/components/PaginationControls.vue'

interface ClosedSession {
  id: number
  table_number: number | null
  customer_name: string
  customer_email: string
  closed_at: string
  payment_method: string
  payment_reference: string
  orders_count: number
  subtotal: number
  tax_amount: number
  tip_amount: number
  total_amount: number
}

const closedSessions = ref<ClosedSession[]>([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showResendModal = ref(false)
const selectedSession = ref<ClosedSession | null>(null)
const resendEmail = ref('')
const sending = ref(false)

const totalPages = computed(() => Math.ceil(closedSessions.value.length / itemsPerPage.value))

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return closedSessions.value.slice(start, start + itemsPerPage.value)
})

async function loadClosedSessions() {
  loading.value = true
  try {
    const response = await fetch('/api/sessions/closed')
    const data = await response.json()
    if (data && data.closed_sessions) {
      closedSessions.value = data.closed_sessions
    }
  } catch (error) {
    console.error('Error loading closed sessions:', error)
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  })
  return formatter.format(amount)
}

async function reprintTicket(sessionId: number) {
  try {
    const response = await fetch(`/api/sessions/${sessionId}/reprint`, { method: 'POST' })
    const data = await response.json()
    if (data && data.ticket) {
      printTicketContent(data.ticket)
    }
  } catch (error) {
    console.error('Error reprinting ticket:', error)
    alert('Error al reimprimir ticket')
  }
}

function printTicketContent(ticket: string) {
  const window = window.open('', '_blank', 'width=500,height=600')
  if (window) {
    window.document.write(`<pre style="font-family: monospace; padding: 1rem;">${ticket}</pre>`)
    window.document.close()
    window.print()
  }
}

function openResendModal(session: ClosedSession) {
  selectedSession.value = session
  resendEmail.value = session.customer_email || ''
  showResendModal.value = true
}

function closeResendModal() {
  showResendModal.value = false
  selectedSession.value = null
  resendEmail.value = ''
}

async function resendTicket() {
  if (!selectedSession.value || !resendEmail.value) return

  sending.value = true
  try {
    const response = await fetch(`/api/sessions/${selectedSession.value.id}/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resendEmail.value })
    })
    const data = await response.json()
    if (data.success) {
      alert(data.message || 'Ticket reenviado exitosamente')
      closeResendModal()
    } else {
      alert(data.message || 'Error al reenviar ticket')
    }
  } catch (error) {
    console.error('Error resending ticket:', error)
    alert('Error al reenviar ticket')
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  loadClosedSessions()
})
</script>

<style scoped>
.sessions-manager {
  padding: 1rem;
}

.sessions-loading,
.sessions-empty {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.sessions-empty svg {
  margin: 0 auto 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #ff6b35;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #22c55e;
}

.session-card--closed {
  border-left-color: #94a3b8;
}

.session-card__flag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.session-card__flag--closed {
  background: #f1f5f9;
  color: #64748b;
}

.session-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.session-card__header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.session-status {
  font-size: 0.875rem;
  color: #64748b;
}

.session-card__info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #475569;
}

.session-card__info p {
  margin: 0;
}

.session-card__totals {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

.session-card__totals strong {
  color: #0f172a;
}

.session-card__actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--secondary {
  background: #f1f5f9;
  color: #475569;
  border: none;
}

.btn--secondary:hover {
  background: #e2e8f0;
}

.btn--outline {
  background: transparent;
  color: #ff6b35;
  border: 1px solid #ff6b35;
}

.btn--outline:hover {
  background: #fff7ed;
}

.btn-primary {
  background: #ff6b35;
  color: white;
  border: none;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: none;
}

/* Modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal.active {
  display: flex;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-group input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}
</style>
