<template>
  <div class="reports-manager">
    <header class="reports-header">
      <h2>📈 Reportes y Análisis</h2>
      <p>Visualiza ventas, productos más vendidos, horarios pico y propinas por mesero.</p>
    </header>

    <div class="reports-filters">
      <div class="filter-group">
        <label for="report-start-date">Desde:</label>
        <input
          type="date"
          id="report-start-date"
          class="filter-input"
          :value="startDate"
          @input="startDate = ($event.target as HTMLInputElement).value"
        />
      </div>
      <div class="filter-group">
        <label for="report-end-date">Hasta:</label>
        <input
          type="date"
          id="report-end-date"
          class="filter-input"
          :value="endDate"
          @input="endDate = ($event.target as HTMLInputElement).value"
        />
      </div>
      <div class="filter-group">
        <label for="report-grouping">Agrupar por:</label>
        <select id="report-grouping" class="filter-input" v-model="grouping">
          <option value="day">Día</option>
          <option value="week">Semana</option>
          <option value="month">Mes</option>
        </select>
      </div>
      <button class="btn btn--primary" @click="loadReports" :disabled="loading">
        🔍 {{ loading ? 'Buscando...' : 'Buscar' }}
      </button>
      <button class="btn btn--secondary" @click="showQuickFilters = !showQuickFilters">
        Filtros rápidos {{ showQuickFilters ? '▲' : '▼' }}
      </button>
    </div>

    <div v-if="showQuickFilters" class="quick-filters">
      <button
        v-for="period in quickFilterOptions"
        :key="period.value"
        class="quick-filter-btn"
        :class="{ active: activeQuickFilter === period.value }"
        @click="applyQuickFilter(period.value)"
      >
        {{ period.label }}
      </button>
    </div>

    <div v-if="error" class="feedback feedback--error">
      {{ error }}
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando reportes...</p>
    </div>

    <template v-else-if="hasData">
      <div class="report-card card card--light">
        <div class="card__header">
          <h3 class="card__header-title">📈 Ventas por Período</h3>
        </div>
        <div class="card__body">
          <div class="report-summary">
            <div class="summary-item">
              <span class="summary-label">Total Órdenes:</span>
              <strong>{{ formatNumber(data.total_orders) }}</strong>
            </div>
            <div class="summary-item">
              <span class="summary-label">Ingresos Totales:</span>
              <strong>{{ formatCurrency(data.total_revenue) }}</strong>
            </div>
            <div class="summary-item">
              <span class="summary-label">Propinas Totales:</span>
              <strong>{{ formatCurrency(data.total_tips) }}</strong>
            </div>
            <div class="summary-item">
              <span class="summary-label">Ticket Promedio:</span>
              <strong>{{ formatCurrency(data.avg_order_value) }}</strong>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="sales-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="report-card card card--light">
        <div class="card__header">
          <h3 class="card__header-title">🏆 Productos Más Vendidos</h3>
        </div>
        <div class="card__body">
          <div class="chart-container">
            <canvas id="top-products-chart"></canvas>
          </div>
          <div class="table-wrapper">
            <table id="top-products-table" data-theme="light">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Órdenes</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in data.top_products" :key="product.id || index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>{{ product.orders }}</td>
                  <td>{{ formatCurrency(product.revenue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="report-card card card--light">
        <div class="card__header">
          <h3 class="card__header-title">🕐 Horarios Pico</h3>
        </div>
        <div class="card__body">
          <div class="peak-hour-info">
            <strong>Hora más concurrida:</strong>
            <span>{{ data.peak_hour || '-' }}</span>
          </div>
          <div class="chart-container">
            <canvas id="peak-hours-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="report-card card card--light">
        <div class="card__header">
          <h3 class="card__header-title">💰 Propinas por Mesero</h3>
        </div>
        <div class="card__body">
          <div class="report-summary">
            <div class="summary-item">
              <span class="summary-label">Total Propinas:</span>
              <strong>{{ formatCurrency(data.total_tips_waiter) }}</strong>
            </div>
            <div class="summary-item">
              <span class="summary-label">Meseros Activos:</span>
              <strong>{{ data.waiter_count || 0 }}</strong>
            </div>
          </div>
          <div class="table-wrapper">
            <table id="waiter-tips-table">
              <thead>
                <tr>
                  <th>Mesero</th>
                  <th>Órdenes</th>
                  <th>Propinas Totales</th>
                  <th>Propina Promedio</th>
                  <th>% Propina</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="waiter in data.waiter_tips" :key="waiter.id">
                  <td>{{ waiter.name }}</td>
                  <td>{{ waiter.orders }}</td>
                  <td>{{ formatCurrency(waiter.total_tips) }}</td>
                  <td>{{ formatCurrency(waiter.avg_tip) }}</td>
                  <td>{{ waiter.tip_percentage }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="!loading && !error" class="empty-state">
      <p>Selecciona un rango de fechas y haz clic en "Buscar" para ver los reportes</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface ReportData {
  total_orders: number
  total_revenue: number
  total_tips: number
  avg_order_value: number
  top_products: Array<{
    id?: number
    name: string
    quantity: number
    orders: number
    revenue: number
  }>
  peak_hour: string | null
  peak_hours: Array<{ hour: number; count: number }>
  total_tips_waiter: number
  waiter_count: number
  waiter_tips: Array<{
    id: number
    name: string
    orders: number
    total_tips: number
    avg_tip: number
    tip_percentage: number
  }>
}

const startDate = ref('')
const endDate = ref('')
const grouping = ref('day')
const loading = ref(false)
const error = ref<string | null>(null)
const showQuickFilters = ref(false)
const activeQuickFilter = ref<string | null>(null)
const data = ref<ReportData>({
  total_orders: 0,
  total_revenue: 0,
  total_tips: 0,
  avg_order_value: 0,
  top_products: [],
  peak_hour: null,
  peak_hours: [],
  total_tips_waiter: 0,
  waiter_count: 0,
  waiter_tips: []
})

const quickFilterOptions = Object.freeze([
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' }
])

const hasData = computed(() => {
  return data.value.total_orders > 0 || data.value.top_products.length > 0
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('es-ES').format(num)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

const setDefaultDates = () => {
  const today = new Date()
  const lastWeek = new Date()
  lastWeek.setDate(today.getDate() - 7)

  endDate.value = today.toISOString().split('T')[0]
  startDate.value = lastWeek.toISOString().split('T')[0]
}

const calculateDateRange = (period: string) => {
  const today = new Date()
  let start = new Date()

  switch (period) {
    case 'today':
      start = new Date(today)
      break
    case 'week':
      const dayOfWeek = today.getDay()
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      start = new Date(today)
      start.setDate(today.getDate() - diff)
      break
    case 'month':
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      break
    default:
      start = new Date(today)
      start.setDate(today.getDate() - 7)
  }

  return { start, end: today }
}

const applyQuickFilter = (period: string) => {
  activeQuickFilter.value = period
  const dates = calculateDateRange(period)
  startDate.value = dates.start.toISOString().split('T')[0]
  endDate.value = dates.end.toISOString().split('T')[0]
  showQuickFilters.value = false
  loadReports()
}

const loadReports = async () => {
  if (!startDate.value || !endDate.value) {
    error.value = 'Por favor selecciona las fechas de inicio y fin'
    return
  }

  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams({
      start_date: startDate.value,
      end_date: endDate.value,
      grouping: grouping.value
    })

    const response = await fetch(`/api/reports?${params}`)
    const result = await response.json()

    if (result.success) {
      data.value = result.data
      await nextTick()
      renderCharts()
    } else {
      error.value = result.message || 'Error al cargar reportes'
    }
  } catch (err) {
    error.value = 'Error de conexión al cargar reportes'
    console.error('Error loading reports:', err)
  } finally {
    loading.value = false
  }
}

const renderCharts = () => {
  if (typeof (window as any).Chart === 'undefined') {
    console.warn('Chart.js not loaded')
    return
  }

  const salesChartEl = document.getElementById('sales-chart')
  const topProductsChartEl = document.getElementById('top-products-chart')
  const peakHoursChartEl = document.getElementById('peak-hours-chart')

  if (salesChartEl) {
    new (window as any).Chart(salesChartEl, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Ventas',
          data: [1200, 1900, 1500, 1800, 2200, 2500, 2100],
          borderColor: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    })
  }

  if (topProductsChartEl) {
    new (window as any).Chart(topProductsChartEl, {
      type: 'bar',
      data: {
        labels: data.value.top_products.slice(0, 5).map(p => p.name),
        datasets: [{
          label: 'Cantidad',
          data: data.value.top_products.slice(0, 5).map(p => p.quantity),
          backgroundColor: ['#ff6b35', '#ffa500', '#ffc107', '#ffd54f', '#ffe082']
        }]
      },
      options: {
        responsive: true
      }
    })
  }

  if (peakHoursChartEl) {
    new (window as any).Chart(peakHoursChartEl, {
      type: 'bar',
      data: {
        labels: data.value.peak_hours.map(h => `${h.hour}:00`),
        datasets: [{
          label: 'Órdenes',
          data: data.value.peak_hours.map(h => h.count),
          backgroundColor: '#4f46e5'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    })
  }
}

onMounted(() => {
  setDefaultDates()
})

defineExpose({
  loadReports,
  refresh: loadReports
})
</script>

<style scoped>
.reports-manager {
  padding: 1.5rem;
}

.reports-header {
  margin-bottom: 1.5rem;
}

.reports-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.reports-header p {
  color: #64748b;
  margin: 0;
}

.reports-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.filter-input {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn--primary {
  background: #ff6b35;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #e85a2b;
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn--secondary:hover {
  background: #e2e8f0;
}

.quick-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.quick-filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-filter-btn:hover {
  background: #f1f5f9;
}

.quick-filter-btn.active {
  background: #ff6b35;
  color: white;
  border-color: #ff6b35;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #ff6b35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.feedback {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.feedback--error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.report-card {
  background: white;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card__header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card__header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card__body {
  padding: 1.5rem;
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.875rem;
  color: #64748b;
}

.summary-item strong {
  font-size: 1.25rem;
  color: #1e293b;
}

.chart-container {
  margin-bottom: 1.5rem;
}

.table-wrapper {
  overflow-x: auto;
}

.table-wrapper table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table-wrapper th,
.table-wrapper td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.table-wrapper th {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
}

.peak-hour-info {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 0.5rem;
  color: #166534;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: #f8fafc;
  border-radius: 0.75rem;
}
</style>
