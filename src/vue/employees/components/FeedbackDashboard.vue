<template>
  <div class="feedback-dashboard">
    <div class="feedback-header">
      <div>
        <h1>Dashboard de Feedback</h1>
        <p class="subtitle">Estadísticas y calificaciones de clientes</p>
      </div>
      <div class="period-selector">
        <label for="period">Período:</label>
        <select id="period" :value="period" @change="changePeriod(Number(($event.target as HTMLSelectElement).value))">
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadData">Reintentar</button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Overall Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: #fff5f2; color: var(--primary-orange)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Calificación Promedio</div>
            <div class="stat-value">{{ stats?.average_rating?.toFixed(1) || '--' }} ⭐</div>
            <div class="stat-change" id="rating-change">En {{ stats?.period_days || '--' }} días</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #eef2ff; color: #4f46e5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total de Feedback</div>
            <div class="stat-value">{{ stats?.total_feedback || '--' }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #f0fdf4; color: #16a34a">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Meseros con 5 Estrellas</div>
            <div class="stat-value">{{ stats?.rating_distribution?.[5] || '--' }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fef3c7; color: #d97706">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">Calidad de Comida</div>
            <div class="stat-value">{{ foodQualityRating || '--' }} ⭐</div>
          </div>
        </div>
      </div>

      <!-- Rating Distribution -->
      <div class="section">
        <h2>Distribución de Calificaciones</h2>
        <div class="rating-distribution">
          <div
            v-for="rating in [5, 4, 3, 2, 1]"
            :key="rating"
            class="rating-bar-item"
          >
            <div class="rating-label">{{ rating }} ⭐</div>
            <div class="rating-bar-bg">
              <div
                class="rating-bar-fill"
                :style="{ width: getRatingPercentage(rating) + '%' }"
              >
                {{ getRatingCount(rating) || '' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Ratings -->
      <div class="section">
        <h2>Calificaciones por Categoría</h2>
        <div class="category-ratings">
          <div
            v-for="(data, categoryKey) in stats?.by_category"
            :key="categoryKey"
            class="category-item"
          >
            <div class="category-header">
              <span class="category-name">{{ getCategoryName(categoryKey) }}</span>
              <div class="category-rating">
                <div class="stars">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="{ empty: i > Math.ceil(data.average_rating) }"
                  >★</span>
                </div>
                <span style="font-weight: 600; color: #0f172a">{{ data.average_rating.toFixed(1) }}</span>
              </div>
            </div>
            <div class="category-bar">
              <div
                class="category-bar-fill"
                :style="{ width: (data.average_rating / 5) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Employees -->
      <div class="section">
        <h2>Top Empleados</h2>
        <div class="top-employees">
          <div v-if="topEmployees.length === 0" class="empty-state">
            <p>No hay datos de feedback aún</p>
          </div>
          <div
            v-for="(employee, index) in topEmployees"
            :key="employee.employee_id"
            class="employee-item"
          >
            <div class="employee-rank">{{ index + 1 }}</div>
            <div class="employee-info">
              <div class="employee-name">{{ escapeHtml(employee.employee_name) }}</div>
              <div class="employee-feedback">{{ employee.feedback_count }} calificaciones</div>
            </div>
            <div class="employee-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFA500">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {{ employee.average_rating.toFixed(1) }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface FeedbackStats {
  average_rating: number
  total_feedback: number
  period_days: number
  rating_distribution: Record<number, number>
  by_category: Record<string, {
    average_rating: number
    count: number
  }>
}

interface TopEmployee {
  employee_id: number
  employee_name: string
  feedback_count: number
  average_rating: number
}

const period = ref(30)
const loading = ref(false)
const error = ref<string | null>(null)
const stats = ref<FeedbackStats | null>(null)
const topEmployees = ref<TopEmployee[]>([])

const CATEGORY_NAMES: Record<string, string> = {
  waiter_service: 'Servicio del Mesero',
  food_quality: 'Calidad de Comida',
  food_presentation: 'Presentación',
  overall_experience: 'Experiencia General'
}

const foodQualityRating = computed(() => {
  if (!stats.value?.by_category?.food_quality) return 'N/A'
  return stats.value.by_category.food_quality.average_rating.toFixed(1)
})

const getRatingCount = (rating: number) => {
  return stats.value?.rating_distribution?.[rating] || 0
}

const getRatingPercentage = (rating: number) => {
  const count = getRatingCount(rating)
  const total = Object.values(stats.value?.rating_distribution || {}).reduce((sum, c) => sum + c, 0)
  return total > 0 ? (count / total * 100) : 0
}

const getCategoryName = (key: string) => {
  return CATEGORY_NAMES[key] || key
}

const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    const [statsRes, employeesRes] = await Promise.all([
      fetch(`/api/feedback/stats/overall?days=${period.value}`),
      fetch(`/api/feedback/stats/top-employees?days=${period.value}&limit=5`)
    ])

    const statsResult = await statsRes.json()
    const employeesResult = await employeesRes.json()

    if (statsResult.success && statsResult.data) {
      stats.value = statsResult.data
    }

    if (employeesResult.success && employeesResult.data?.employees) {
      topEmployees.value = employeesResult.data.employees
    }
  } catch (err) {
    error.value = 'Error al cargar datos'
    console.error('Error loading feedback data:', err)
  } finally {
    loading.value = false
  }
}

const changePeriod = (days: number) => {
  period.value = days
  loadData()
}

onMounted(() => {
  loadData()
})

defineExpose({
  changePeriod,
  refresh: loadData
})
</script>

<style scoped>
.feedback-dashboard {
  padding: 1.5rem;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.feedback-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.subtitle {
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.period-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.period-selector select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.stat-change {
  font-size: 0.75rem;
  color: #64748b;
}

.section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.loading-state,
.error-state {
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

.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-label {
  width: 60px;
  font-size: 0.875rem;
  color: #64748b;
}

.rating-bar-bg {
  flex: 1;
  height: 24px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.rating-bar-fill {
  height: 100%;
  background: #ff6b35;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  font-size: 0.75rem;
  color: white;
  font-weight: 500;
  min-width: 24px;
}

.category-ratings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-size: 0.875rem;
  color: #1e293b;
}

.category-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #fbbf24;
  font-size: 1rem;
}

.star.empty {
  color: #e2e8f0;
}

.category-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.category-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ff8c5a);
  border-radius: 4px;
}

.top-employees {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.employee-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.employee-rank {
  width: 32px;
  height: 32px;
  background: #ff6b35;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.employee-info {
  flex: 1;
}

.employee-name {
  font-weight: 500;
  color: #1e293b;
}

.employee-feedback {
  font-size: 0.75rem;
  color: #64748b;
}

.employee-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: #1e293b;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}
</style>
