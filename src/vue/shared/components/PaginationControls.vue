<template>
  <div class="pagination" v-if="totalItems > 0 || showItemsPerPage">
    <div class="pagination__per-page" v-if="showItemsPerPage">
      <label>{{ labels.show }}</label>
      <select v-model="itemsPerPageModel" class="pagination__select">
        <option v-for="opt in itemsPerPageOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <div class="pagination__controls" v-if="totalPages > 1">
      <button
        class="pagination__btn pagination__btn--nav"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        {{ labels.previous }}
      </button>
      <div class="pagination__numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination__btn"
          :class="{ 'pagination__btn--active': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <span v-if="showEllipsisStart" class="pagination__ellipsis">...</span>
      </div>
      <button
        class="pagination__btn pagination__btn--nav"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        {{ labels.next }}
      </button>
    </div>

    <div class="pagination__info">
      {{ startItem }}-{{ endItem }} {{ labels.of }} {{ totalItems }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  totalItems: number
  currentPage?: number
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  showItemsPerPage?: boolean
  storageKey?: string | null
  labels?: {
    previous?: string
    next?: string
    showing?: string
    of?: string
    items?: string
    show?: string
  }
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'items-per-page-change', itemsPerPage: number): void
}>()

const itemsPerPageOptionsDefault = [10, 20, 50, 100]
const labelsDefault = {
  previous: '‹ Anterior',
  next: 'Siguiente ›',
  showing: '',
  of: 'de',
  items: '',
  show: 'Mostrar:'
}

const itemsPerPage = ref(props.itemsPerPage || 20)
const currentPage = ref(props.currentPage || 1)
const showItemsPerPage = props.showItemsPerPage !== false
const itemsPerPageOptions = props.itemsPerPageOptions || itemsPerPageOptionsDefault
const labels = { ...labelsDefault, ...props.labels }
const storageKey = props.storageKey || null

const itemsPerPageModel = computed({
  get: () => itemsPerPage.value,
  set: (val) => {
    itemsPerPage.value = val
    savePreference(val)
    currentPage.value = 1
    emit('items-per-page-change', val)
    emit('page-change', 1)
  }
})

const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage.value))

const startItem = computed(() => {
  return props.totalItems > 0 ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, props.totalItems)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  const total = totalPages.value

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)

    if (currentPage.value > 3) {
      // Don't show ellipsis if currentPage is 4 (1, 2, 3, 4, 5)
      if (currentPage.value > 4) {
        // Will show ellipsis
      }
    }

    let start = Math.max(2, currentPage.value - 1)
    let end = Math.min(total - 1, currentPage.value + 1)

    if (currentPage.value <= 3) {
      start = 2
      end = 4
    }

    if (currentPage.value >= total - 2) {
      start = total - 3
      end = total - 1
    }

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < total) {
        pages.push(i)
      }
    }

    if (currentPage.value < total - 2) {
      // Will show ellipsis
    }
  }

  pages.push(total)
  return [...new Set(pages)].sort((a, b) => a - b)
})

const showEllipsisStart = computed(() => {
  return visiblePages.value[1] > 2
})

const showEllipsisEnd = computed(() => {
  const len = visiblePages.value.length
  return visiblePages.value[len - 2] < totalPages.value - 1
})

function savePreference(value: number) {
  try {
    localStorage.setItem('pronto_items_per_page', String(value))
    if (storageKey) {
      localStorage.setItem(`pronto_items_per_page_${storageKey}`, String(value))
    }
  } catch (e) {
    console.warn('[PaginationControls] Failed to save preference:', e)
  }
}

function loadPreference() {
  try {
    if (storageKey) {
      const sectionPref = localStorage.getItem(`pronto_items_per_page_${storageKey}`)
      if (sectionPref) {
        const val = parseInt(sectionPref, 10)
        if (itemsPerPageOptions.includes(val)) {
          itemsPerPage.value = val
          return
        }
      }
    }
    const globalPref = localStorage.getItem('pronto_items_per_page')
    if (globalPref) {
      const val = parseInt(globalPref, 10)
      if (itemsPerPageOptions.includes(val)) {
        itemsPerPage.value = val
      }
    }
  } catch (e) {
    console.warn('[PaginationControls] Failed to load preference:', e)
  }
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  emit('page-change', page)
}

watch(() => props.currentPage, (val) => {
  if (val) currentPage.value = val
})

watch(() => props.itemsPerPage, (val) => {
  if (val) itemsPerPage.value = val
})

loadPreference()
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  flex-wrap: wrap;
}

.pagination__per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination__per-page label {
  font-size: 0.875rem;
  color: #64748b;
}

.pagination__select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.pagination__controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination__numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination__btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination__btn:hover:not(:disabled) {
  background: #f1f5f9;
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__btn--nav {
  font-weight: 500;
}

.pagination__btn--active {
  background: #ff6b35;
  border-color: #ff6b35;
  color: white;
}

.pagination__btn--active:hover {
  background: #e85a2b;
}

.pagination__ellipsis {
  padding: 0 0.5rem;
  color: #64748b;
}

.pagination__info {
  font-size: 0.875rem;
  color: #64748b;
  margin-left: auto;
}
</style>
