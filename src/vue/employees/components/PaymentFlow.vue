<template>
  <div class="payment-flow">
    <Teleport to="body">
      <div v-if="showPaymentModal" class="modal active" @click.self="closePaymentModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Procesar Pago</h2>
            <button class="modal-close" @click="closePaymentModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handlePaymentSubmit">
            <div class="modal-body">
              <div class="payment-info">
                <p><strong>Cuenta #{{ paymentState.sessionId }}</strong></p>
                <p>Método: <span class="payment-method-badge">{{ paymentMethodLabel }}</span></p>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="closePaymentModal">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="processing">
                  {{ processing ? 'Procesando...' : 'Confirmar Pago' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div v-if="showTipModal" class="modal active" @click.self="closeTipModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Registrar Propina</h2>
            <button class="modal-close" @click="skipTipAndOpenTicket">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleTipSubmit">
            <div class="modal-body">
              <div class="tip-info">
                <p>Cuenta #{{ tipState.sessionId }}</p>
              </div>
              <div class="tip-options" id="tip-options-modal">
                <button type="button" class="tip-chip" :class="{ active: tipState.tip === 0 }" @click="setTip(0)">Sin</button>
                <button type="button" class="tip-chip" :class="{ active: tipState.tip === 10 }" @click="setTip(10)">10%</button>
                <button type="button" class="tip-chip" :class="{ active: tipState.tip === 15 }" @click="setTip(15)">15%</button>
                <button type="button" class="tip-chip" :class="{ active: tipState.tip === 20 }" @click="setTip(20)">20%</button>
                <button type="button" class="tip-chip" :class="{ active: tipState.tip === 25 }" @click="setTip(25)">25%</button>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="skipTipAndOpenTicket">Omitir</button>
                <button type="submit" class="btn btn-primary">Continuar</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div v-if="showTicketModal" class="modal active" @click.self="closeTicketModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Generar Ticket</h2>
            <button class="modal-close" @click="closeTicketModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleTicketSubmit">
            <div class="modal-body">
              <p>Cuenta #{{ ticketState.sessionId }}</p>
              <div class="ticket-delivery-options">
                <label class="radio-option">
                  <input type="radio" name="ticket-delivery" value="physical" v-model="ticketDelivery" />
                  <span>🖨️ Imprimir ticket físico</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="ticket-delivery" value="digital" v-model="ticketDelivery" />
                  <span>📧 Enviar por email</span>
                </label>
              </div>
              <div v-if="ticketDelivery === 'digital'" class="email-input-wrapper">
                <input
                  type="email"
                  name="ticket-email"
                  id="ticket-email-input"
                  v-model="ticketEmail"
                  placeholder="cliente@email.com"
                  required
                />
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="closeTicketModal">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="processing">
                  {{ processing ? 'Generando...' : 'Confirmar' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

interface PaymentState {
  sessionId: number | null
  method: string | null
}

interface TipState {
  sessionId: number | null
  tip: number
}

interface TicketState {
  sessionId: number | null
}

const showPaymentModal = ref(false)
const showTipModal = ref(false)
const showTicketModal = ref(false)
const processing = ref(false)
const ticketDelivery = ref('physical')
const ticketEmail = ref('')

const paymentState = reactive<PaymentState>({ sessionId: null, method: null })
const tipState = reactive<TipState>({ sessionId: null, tip: 0 })
const ticketState = reactive<TicketState>({ sessionId: null })

const paymentMethodLabel = computed(() => {
  const labels: Record<string, string> = {
    cash: 'Efectivo',
    clip: 'Terminal (Clip)',
    card: 'Tarjeta',
    transfer: 'Transferencia'
  }
  return paymentState.method ? labels[paymentState.method] || paymentState.method : ''
})

function openPaymentModal(sessionId: number, method: string) {
  paymentState.sessionId = sessionId
  paymentState.method = method
  showPaymentModal.value = true
}

function closePaymentModal() {
  showPaymentModal.value = false
  paymentState.sessionId = null
  paymentState.method = null
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Error desconocido'
}

async function handlePaymentSubmit() {
  if (!paymentState.sessionId) return

  processing.value = true
  try {
    const response = await fetch(`/api/sessions/${paymentState.sessionId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_method: paymentState.method })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al procesar el pago')

    closePaymentModal()
    openTipModal(paymentState.sessionId)

    document.dispatchEvent(new CustomEvent('payment:completed', {
      detail: { sessionId: paymentState.sessionId, method: paymentState.method, response: data }
    }))
  } catch (error) {
    console.error('Payment error:', error)
    alert(getErrorMessage(error) || 'Error al procesar el pago')
  } finally {
    processing.value = false
  }
}

function openTipModal(sessionId: number) {
  tipState.sessionId = sessionId
  tipState.tip = 0
  showTipModal.value = true
}

function closeTipModal() {
  showTipModal.value = false
  tipState.sessionId = null
  tipState.tip = 0
}

function setTip(value: number) {
  tipState.tip = value
}

function skipTipAndOpenTicket() {
  closeTipModal()
  if (tipState.sessionId) {
    openTicketModal(tipState.sessionId)
  }
}

async function handleTipSubmit() {
  if (!tipState.sessionId) return

  processing.value = true
  try {
    if (tipState.tip > 0) {
      await fetch(`/api/sessions/${tipState.sessionId}/tip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tip_percentage: tipState.tip })
      })
    }

    closeTipModal()
    openTicketModal(tipState.sessionId)

    document.dispatchEvent(new CustomEvent('tip:completed', {
      detail: { sessionId: tipState.sessionId, tip: tipState.tip }
    }))
  } catch (error) {
    console.error('Tip error:', error)
    alert(getErrorMessage(error) || 'Error al registrar')
  } finally {
    processing.value = false
  }
}

function openTicketModal(sessionId: number) {
  ticketState.sessionId = sessionId
  ticketDelivery.value = 'physical'
  ticketEmail.value = ''
  showTicketModal.value = true
}

function closeTicketModal() {
  showTicketModal.value = false
  ticketState.sessionId = null
  ticketEmail.value = ''
}

async function handleTicketSubmit() {
  if (!ticketState.sessionId) return

  processing.value = true
  try {
    if (ticketDelivery.value === 'physical') {
      await printTicket(ticketState.sessionId)
      alert('Ticket enviado a impresora')
    } else if (ticketDelivery.value === 'digital') {
      if (!ticketEmail.value) {
        alert('Ingresa un email válido')
        processing.value = false
        return
      }
      await fetch(`/api/sessions/${ticketState.sessionId}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ticketEmail.value })
      })
      alert(`Ticket enviado a ${ticketEmail.value}`)
    }

    closeTicketModal()
    document.dispatchEvent(new CustomEvent('ticket:completed', {
      detail: { sessionId: ticketState.sessionId, delivery: ticketDelivery.value }
    }))
  } catch (error) {
    console.error('Ticket error:', error)
    alert(getErrorMessage(error) || 'Error al generar ticket')
  } finally {
    processing.value = false
  }
}

async function printTicket(sessionId: number) {
  const response = await fetch(`/api/sessions/${sessionId}/ticket`)
  const data = await response.json()
  if (data.ticket) {
    const win = window.open('', '_blank', 'width=500,height=600')
    if (win) {
      win.document.write(`<pre style="font-family: monospace; padding: 1rem;">${data.ticket}</pre>`)
      win.document.close()
    }
  }
}

function handlePaymentRequested(event: CustomEvent) {
  openPaymentModal(event.detail.sessionId, event.detail.method)
}

function handleTipRequested(event: CustomEvent) {
  openTipModal(event.detail.sessionId)
}

onMounted(() => {
  document.addEventListener('session:payment-requested', handlePaymentRequested as EventListener)
  document.addEventListener('session:tip-requested', handleTipRequested as EventListener)
})

onUnmounted(() => {
  document.removeEventListener('session:payment-requested', handlePaymentRequested as EventListener)
  document.removeEventListener('session:tip-requested', handleTipRequested as EventListener)
})
</script>

<style scoped>
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
  max-width: 450px;
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
  font-size: 1.25rem;
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
  display: flex;
}

.modal-body {
  padding: 1.5rem;
}

.payment-info,
.tip-info {
  margin-bottom: 1.5rem;
}

.payment-info p,
.tip-info p {
  margin: 0.25rem 0;
  color: #475569;
}

.payment-method-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #f0fdf4;
  color: #166534;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.tip-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.tip-chip {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tip-chip:hover {
  border-color: #ff6b35;
}

.tip-chip.active {
  background: #ff6b35;
  border-color: #ff6b35;
  color: white;
}

.ticket-delivery-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:has(input:checked) {
  border-color: #ff6b35;
  background: #fff7ed;
}

.radio-option input {
  accent-color: #ff6b35;
}

.email-input-wrapper {
  margin-bottom: 1rem;
}

.email-input-wrapper input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.email-input-wrapper input:focus {
  outline: none;
  border-color: #ff6b35;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
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
</style>
