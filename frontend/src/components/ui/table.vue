<template>
  <div :class="cn('w-full space-y-4', wrapperClass)">
    <!-- Table Title and Actions -->
    <div v-if="title || $slots.top" :class="cn('flex items-center justify-between', topClass)">
      <div>
        <h3 v-if="title" :class="cn('text-lg font-semibold text-foreground', titleClass)">
          {{ title }}
        </h3>
        <p v-if="subtitle" :class="cn('text-sm text-muted-foreground', subtitleClass)">
          {{ subtitle }}
        </p>
      </div>
      <slot name="top" />
    </div>

    <!-- Table Controls -->
    <div v-if="searchable || $slots.controls" :class="cn('flex items-center justify-between gap-4', controlsClass)">
      <!-- Search -->
      <div v-if="searchable" class="relative flex-1 max-w-sm">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          :class="cn(
            'w-full px-3 py-2 text-sm border border-input rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            searchInputClass
          )"
        />
        <svg
          class="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <slot name="controls" />
    </div>

    <!-- Table Container -->
    <div :class="cn('rounded-md border border-border', containerClass)">
      <!-- Table -->
      <table :class="cn('w-full caption-bottom text-sm', tableClass)">
        <!-- Header -->
        <thead :class="cn('[&_tr]:border-b', headerClass)">
          <tr :class="cn('border-b transition-colors hover:bg-muted/50', headerRowClass)">
            <!-- Selection Header -->
            <th
              v-if="selectable"
              :class="cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground', headerCellClass)"
            >
              <input
                v-if="multiple"
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleAllSelection"
                :class="cn('h-4 w-4 rounded border-border', checkboxClass)"
              />
            </th>
            
            <!-- Column Headers -->
            <th
              v-for="column in visibleColumns"
              :key="column.name"
              :class="cn(
                'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                {
                  'cursor-pointer hover:bg-muted/50': column.sortable,
                  'text-center': column.align === 'center',
                  'text-right': column.align === 'right',
                },
                headerCellClass
              )"
              @click="column.sortable ? sort(column.name) : null"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable" class="flex flex-col">
                  <svg
                    :class="cn(
                      'h-3 w-3 transition-colors',
                      sortBy === column.name && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground'
                    )"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg
                    :class="cn(
                      'h-3 w-3 transition-colors -mt-1',
                      sortBy === column.name && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground'
                    )"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody :class="cn('[&_tr:last-child]:border-0', bodyClass)">
          <template v-if="paginatedData.length > 0">
            <tr
              v-for="(row, index) in paginatedData"
              :key="getRowKey(row, index)"
              :class="cn(
                'border-b transition-colors hover:bg-muted/50',
                {
                  'bg-muted/50': selectedRows.includes(getRowKey(row, index)),
                  'cursor-pointer': rowClickable,
                },
                rowClass
              )"
              @click="handleRowClick(row, index)"
            >
              <!-- Selection Cell -->
              <td
                v-if="selectable"
                :class="cn('p-4 align-middle', cellClass)"
              >
                <input
                  type="checkbox"
                  :checked="selectedRows.includes(getRowKey(row, index))"
                  @change="toggleRowSelection(row, index)"
                  :class="cn('h-4 w-4 rounded border-border', checkboxClass)"
                />
              </td>

              <!-- Data Cells -->
              <td
                v-for="column in visibleColumns"
                :key="column.name"
                :class="cn(
                  'p-4 align-middle',
                  {
                    'text-center': column.align === 'center',
                    'text-right': column.align === 'right',
                  },
                  cellClass
                )"
              >
                <slot
                  :name="`cell-${column.name}`"
                  :row="row"
                  :column="column"
                  :value="getCellValue(row, column)"
                  :index="index"
                >
                  <span>{{ formatCellValue(getCellValue(row, column), column) }}</span>
                </slot>
              </td>
            </tr>
          </template>
          
          <!-- Empty State -->
          <tr v-else>
            <td
              :colspan="visibleColumns.length + (selectable ? 1 : 0)"
              :class="cn('p-8 text-center text-muted-foreground', emptyClass)"
            >
              <slot name="empty">
                {{ noDataMessage }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && filteredData.length > rowsPerPage"
      :class="cn('flex items-center justify-between', paginationClass)"
    >
      <!-- Rows info -->
      <div :class="cn('text-sm text-muted-foreground', paginationInfoClass)">
        Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredData.length) }} of {{ filteredData.length }} entries
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center gap-2">
        <!-- Rows per page -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Rows per page:</span>
          <select
            v-model="rowsPerPage"
            :class="cn(
              'px-2 py-1 text-sm border border-input rounded bg-background',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              rowsPerPageSelectClass
            )"
          >
            <option v-for="option in rowsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <!-- Page Navigation -->
        <div class="flex items-center gap-1">
          <button
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            :class="cn(
              'px-3 py-1 text-sm border border-input rounded',
              'hover:bg-accent hover:text-accent-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              paginationButtonClass
            )"
          >
            Previous
          </button>
          
          <!-- Page Numbers -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              :class="cn(
                'px-3 py-1 text-sm border border-input rounded',
                'hover:bg-accent hover:text-accent-foreground',
                {
                  'bg-primary text-primary-foreground': page === currentPage,
                },
                paginationButtonClass
              )"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-muted-foreground">...</span>
          </template>
          
          <button
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            :class="cn(
              'px-3 py-1 text-sm border border-input rounded',
              'hover:bg-accent hover:text-accent-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              paginationButtonClass
            )"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { cn } from '@/lib/utils'

interface Column {
  name: string
  label: string
  field?: string | ((row: any) => any)
  format?: (value: any) => string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  style?: string
  classes?: string
  headerStyle?: string
  headerClasses?: string
  required?: boolean
}

interface TableProps {
  data?: any[]
  columns?: Column[]
  title?: string
  subtitle?: string
  searchable?: boolean
  searchPlaceholder?: string
  noDataMessage?: string
  selectable?: boolean
  multiple?: boolean
  rowClickable?: boolean
  pagination?: boolean
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  rowKey?: string | ((row: any) => any)
  // Sorting
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  // Styling props
  wrapperClass?: string
  topClass?: string
  titleClass?: string
  subtitleClass?: string
  controlsClass?: string
  searchInputClass?: string
  containerClass?: string
  tableClass?: string
  headerClass?: string
  headerRowClass?: string
  headerCellClass?: string
  bodyClass?: string
  rowClass?: string
  cellClass?: string
  checkboxClass?: string
  emptyClass?: string
  paginationClass?: string
  paginationInfoClass?: string
  paginationButtonClass?: string
  rowsPerPageSelectClass?: string
}

interface TableEmits {
  (e: 'update:sortBy', value: string): void
  (e: 'update:sortOrder', value: 'asc' | 'desc'): void
  (e: 'update:rowsPerPage', value: number): void
  (e: 'rowClick', row: any, index: number): void
  (e: 'selection', selectedRows: any[]): void
  (e: 'sort', sortBy: string, sortOrder: 'asc' | 'desc'): void
}

const props = withDefaults(defineProps<TableProps>(), {
  data: () => [],
  columns: () => [],
  searchPlaceholder: 'Search...',
  noDataMessage: 'No data available',
  selectable: false,
  multiple: false,
  rowClickable: false,
  pagination: true,
  rowsPerPage: 10,
  rowsPerPageOptions: () => [5, 10, 25, 50],
  rowKey: 'id',
  sortBy: '',
  sortOrder: 'asc',
})

const emit = defineEmits<TableEmits>()

// State
const searchQuery = ref('')
const currentPage = ref(1)
const internalRowsPerPage = ref(props.rowsPerPage)
const internalSortBy = ref(props.sortBy)
const internalSortOrder = ref(props.sortOrder)
const selectedRows = ref<any[]>([])

// Computed
const visibleColumns = computed(() => {
  return props.columns.filter(column => column.required !== false)
})

const filteredData = computed(() => {
  if (!searchQuery.value) return props.data
  
  return props.data.filter(row => {
    return visibleColumns.value.some(column => {
      const value = getCellValue(row, column)
      return String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    })
  })
})

const sortedData = computed(() => {
  if (!internalSortBy.value) return filteredData.value
  
  return [...filteredData.value].sort((a, b) => {
    const column = visibleColumns.value.find(col => col.name === internalSortBy.value)
    if (!column) return 0
    
    const valueA = getCellValue(a, column)
    const valueB = getCellValue(b, column)
    
    let comparison = 0
    if (valueA < valueB) comparison = -1
    else if (valueA > valueB) comparison = 1
    
    return internalSortOrder.value === 'desc' ? -comparison : comparison
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / internalRowsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * internalRowsPerPage.value
})

const endIndex = computed(() => {
  return startIndex.value + internalRowsPerPage.value
})

const paginatedData = computed(() => {
  if (!props.pagination) return sortedData.value
  return sortedData.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
})

const isAllSelected = computed(() => {
  return paginatedData.value.length > 0 && selectedRows.value.length === paginatedData.value.length
})

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < paginatedData.value.length
})

// Methods
const getCellValue = (row: any, column: Column): any => {
  if (typeof column.field === 'function') {
    return column.field(row)
  }
  if (column.field) {
    return row[column.field]
  }
  return row[column.name]
}

const formatCellValue = (value: any, column: Column): string => {
  if (column.format && typeof column.format === 'function') {
    return column.format(value)
  }
  return String(value ?? '')
}

const getRowKey = (row: any, index: number): any => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return row[props.rowKey] ?? index
}

const sort = (columnName: string) => {
  if (internalSortBy.value === columnName) {
    internalSortOrder.value = internalSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    internalSortBy.value = columnName
    internalSortOrder.value = 'asc'
  }
  
  emit('update:sortBy', internalSortBy.value)
  emit('update:sortOrder', internalSortOrder.value)
  emit('sort', internalSortBy.value, internalSortOrder.value)
}

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleRowClick = (row: any, index: number) => {
  if (props.rowClickable) {
    emit('rowClick', row, index)
  }
}

const toggleRowSelection = (row: any, index: number) => {
  const key = getRowKey(row, index)
  const selectedIndex = selectedRows.value.indexOf(key)
  
  if (selectedIndex > -1) {
    selectedRows.value.splice(selectedIndex, 1)
  } else {
    if (props.multiple) {
      selectedRows.value.push(key)
    } else {
      selectedRows.value = [key]
    }
  }
  
  emit('selection', selectedRows.value)
}

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedRows.value = []
  } else {
    selectedRows.value = paginatedData.value.map((row, index) => getRowKey(row, index))
  }
  
  emit('selection', selectedRows.value)
}

const clearSelection = () => {
  selectedRows.value = []
  emit('selection', selectedRows.value)
}

// Watchers
watch(() => props.rowsPerPage, (newValue) => {
  internalRowsPerPage.value = newValue
  currentPage.value = 1
})

watch(() => props.sortBy, (newValue) => {
  internalSortBy.value = newValue
})

watch(() => props.sortOrder, (newValue) => {
  internalSortOrder.value = newValue
})

watch(internalRowsPerPage, (newValue) => {
  emit('update:rowsPerPage', newValue)
  currentPage.value = 1
})

watch(searchQuery, () => {
  currentPage.value = 1
})

// Expose methods
defineExpose({
  clearSelection,
  selectAll: toggleAllSelection,
  getSelectedRows: () => selectedRows.value,
  goToPage,
  refresh: () => {
    // Refresh could trigger a data reload in parent
    currentPage.value = 1
    searchQuery.value = ''
  },
})
</script>

<style scoped>
/* Custom scrollbar for table */
.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

.table-container::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--foreground));
}

/* Indeterminate checkbox styling */
input[type="checkbox"]:indeterminate {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
}

input[type="checkbox"]:indeterminate::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 2px;
  background: white;
  border-radius: 1px;
}
</style> 