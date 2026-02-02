<template>
  <div class="data-table-wrapper">
    <div class="data-table__header" v-if="$slots.header || $slots.toolbar">
      <slot name="header">
        <div class="data-table__toolbar">
          <slot name="toolbar" />
        </div>
      </slot>
    </div>

    <div class="data-table__container">
      <table class="data-table" :class="{ 'data-table--striped': striped, 'data-table--hover': hover }">
        <thead v-if="columns.length > 0">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="col.width ? { width: col.width } : {}"
              :class="[
                `data-table__th--align-${col.align || 'left'}`,
                { 'data-table__th--sortable': col.sortable }
              ]"
              @click="col.sortable && handleSort(col.key)"
            >
              <div class="data-table__th-content">
                <span>{{ col.label }}</span>
                <span v-if="col.sortable && sortKey === col.key" class="data-table__sort-icon">
                  <svg v-if="sortOrder === 'asc'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in paginatedData" :key="getRowKey(row, rowIndex)" :class="{ 'data-table__tr--selected': isSelected(row) }">
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[`data-table__td--align-${col.align || 'left'}`]"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="getNestedValue(row, col.key)" :index="rowIndex">
                {{ getNestedValue(row, col.key) }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="data-table__empty">
              <slot name="empty">
                <div class="data-table__empty-message">No hay datos</div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="data-table__footer" v-if="showPagination && totalPages > 0">
      <PaginationControls
        :total-items="sortedData.length"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PaginationControls from './PaginationControls.vue'

export interface TableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

const props = withDefaults(defineProps<{
  data: any[]
  columns: TableColumn[]
  rowKey?: string
  striped?: boolean
  hover?: boolean
  selectable?: boolean
  selectedRows?: any[]
  showPagination?: boolean
  itemsPerPage?: number
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
}>(), {
  striped: false,
  hover: true,
  selectable: false,
  showPagination: true,
  itemsPerPage: 20,
  sortOrder: 'asc'
})

const emit = defineEmits<{
  (e: 'update:sortKey', key: string): void
  (e: 'update:sortOrder', order: 'asc' | 'desc'): void
  (e: 'update:selectedRows', rows: any[]): void
  (e: 'row-click', row: any): void
  (e: 'selection-change', rows: any[]): void
  (e: 'page-change', page: number): void
}>()

const currentPage = ref(1)
const internalSortKey = ref(props.sortKey || '')
const internalSortOrder = ref<'asc' | 'desc'>(props.sortOrder || 'asc')
const selected = ref<any[]>([...(props.selectedRows || [])])

const sortedData = computed(() => {
  let result = [...props.data]

  if (internalSortKey.value) {
    result.sort((a, b) => {
      const aVal = getNestedValue(a, internalSortKey.value)
      const bVal = getNestedValue(b, internalSortKey.value)

      if (aVal === bVal) return 0

      const comparison = aVal > bVal ? 1 : -1
      return internalSortOrder.value === 'asc' ? comparison : -comparison
    })
  }

  return result
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / props.itemsPerPage))

const paginatedData = computed(() => {
  if (!props.showPagination) return sortedData.value

  const start = (currentPage.value - 1) * props.itemsPerPage
  return sortedData.value.slice(start, start + props.itemsPerPage)
})

function getNestedValue<T = unknown>(obj: Record<string, unknown>, path: string): T | undefined {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj as unknown) as T | undefined
}

function getRowKey(row: any, index: number): any {
  return props.rowKey ? row[props.rowKey] : index
}

function handleSort(key: string) {
  if (internalSortKey.value === key) {
    internalSortOrder.value = internalSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    internalSortKey.value = key
    internalSortOrder.value = 'asc'
  }

  emit('update:sortKey', internalSortKey.value)
  emit('update:sortOrder', internalSortOrder.value)
}

function handlePageChange(page: number) {
  currentPage.value = page
  emit('page-change', page)
}

function isSelected(row: any): boolean {
  return selected.value.some(item => {
    if (props.rowKey) return item[props.rowKey] === row[props.rowKey]
    return item === row
  })
}

function toggleRowSelection(row: any) {
  const index = selected.value.findIndex(item => {
    if (props.rowKey) return item[props.rowKey] === row[props.rowKey]
    return item === row
  })

  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }

  emit('update:selectedRows', selected.value)
  emit('selection-change', selected.value)
}

watch(() => props.selectedRows, (newVal) => {
  if (newVal) selected.value = [...newVal]
}, { deep: true })

watch(() => props.sortKey, (newKey) => {
  if (newKey) internalSortKey.value = newKey
})

watch(() => props.sortOrder, (newOrder) => {
  if (newOrder) internalSortOrder.value = newOrder
})

defineExpose({
  toggleRowSelection,
  clearSelection: () => {
    selected.value = []
    emit('update:selectedRows', [])
    emit('selection-change', [])
  },
  selectAll: (rows: any[]) => {
    selected.value = [...rows]
    emit('update:selectedRows', selected.value)
    emit('selection-change', selected.value)
  }
})
</script>

<style scoped>
.data-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.data-table__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.data-table__toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.data-table__container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table__th--align-left,
.data-table__td--align-left {
  text-align: left;
}

.data-table__th--align-center,
.data-table__td--align-center {
  text-align: center;
}

.data-table__th--align-right,
.data-table__td--align-right {
  text-align: right;
}

.data-table__th {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  user-select: none;
}

.data-table__th--sortable {
  cursor: pointer;
}

.data-table__th--sortable:hover {
  background: #f1f5f9;
}

.data-table__th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.data-table__sort-icon {
  color: #ff6b35;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table--striped tbody tr:nth-child(even) {
  background: #f8fafc;
}

.data-table--hover tbody tr:hover {
  background: #f1f5f9;
}

.data-table__tr--selected {
  background: #fff7ed;
}

.data-table__empty {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.data-table__empty-message {
  color: #64748b;
}

.data-table__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
