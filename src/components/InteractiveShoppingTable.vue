<template>
  <div class="shopping-card">
    <div class="shopping-header d-flex align-items-center justify-content-between">
      <div>
        <h5 class="title mb-0">Shopping List</h5>
        <p class="subtitle mb-0">Interactive list for weekly meal plan</p>
      </div>
      <div class="d-flex gap-2 align-items-center">
        <button @click="clearFilters" class="btn btn-outline-secondary btn-sm" aria-label="Clear all filters">Clear Filters</button>
        <div class="d-flex align-items-center gap-2">
          <label class="form-label mb-0 small text-muted" for="pageSizeSelect">Per Page</label>
          <select id="pageSizeSelect" class="form-select form-select-sm w-auto" v-model.number="pageSize" aria-label="Select page size">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="table table-striped table-hover align-middle" role="table" aria-label="Shopping List Table">
        <caption class="visually-hidden">Shopping List</caption>
        <thead>
          <tr role="row">
            <th scope="col" role="columnheader">
              <button class="table-sort-btn" @click="toggleSort('ingredient')" :aria-sort="ariaSort('ingredient')" aria-label="Sort by Ingredient">
                Ingredient
                <span class="sort-indicator" aria-hidden="true" v-if="sortKey === 'ingredient' && sortOrder === 'asc'">&uarr;</span>
                <span class="sort-indicator" aria-hidden="true" v-if="sortKey === 'ingredient' && sortOrder === 'desc'">&darr;</span>
              </button>
            </th>
            <th scope="col" role="columnheader">
              <button class="table-sort-btn" @click="toggleSort('amount')" :aria-sort="ariaSort('amount')" aria-label="Sort by Amount">
                Amount
                <span class="sort-indicator" aria-hidden="true" v-if="sortKey === 'amount' && sortOrder === 'asc'">&uarr;</span>
                <span class="sort-indicator" aria-hidden="true" v-if="sortKey === 'amount' && sortOrder === 'desc'">&darr;</span>
              </button>
            </th>
            <th scope="col" role="columnheader">
              <button class="table-sort-btn" @click="toggleSort('category')" :aria-sort="ariaSort('category')" aria-label="Sort by Category">
                Category
                <span class="sort-indicator" aria-hidden="true" v-if="sortKey === 'category' && sortOrder === 'asc'">&uarr;</span>
                <span class="sort-indicator" aria-hidden="true" v-if="sortKey === 'category' && sortOrder === 'desc'">&darr;</span>
              </button>
            </th>
          </tr>
          <tr role="row">
            <th role="columnheader">
              <input
                v-model="filters.ingredient"
                type="text"
                class="form-control form-control-sm"
                placeholder="Column filter..."
                aria-label="Filter Ingredient"
              />
            </th>
            <th role="columnheader">
              <input
                v-model="filters.amount"
                type="text"
                class="form-control form-control-sm"
                placeholder="Column filter..."
                aria-label="Filter Amount"
              />
            </th>
            <th role="columnheader">
              <input
                v-model="filters.category"
                type="text"
                class="form-control form-control-sm"
                placeholder="Column filter..."
                aria-label="Filter Category"
              />
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          <tr v-if="paginatedRows.length === 0" role="row">
            <td role="cell" colspan="3" class="text-center text-muted py-4">No matching results. Please adjust filters.</td>
          </tr>
          <tr v-for="(row, idx) in paginatedRows" :key="idx" role="row">
            <td role="cell" class="text-truncate" :title="row.ingredient">{{ row.ingredient }}</td>
            <td role="cell" class="text-truncate" :title="row.amount">{{ row.amount }}</td>
            <td role="cell" class="text-truncate" :title="row.category">{{ row.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-2" role="navigation" aria-label="Shopping table pagination">
      <div class="text-muted small">Page {{ currentPage + 1 }} / {{ totalPages }} ({{ filteredRows.length }} items)</div>
      <ul class="pagination pagination-sm mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 0 }">
          <button class="page-link" @click="goToPage(currentPage - 1)" aria-label="Previous page">Prev</button>
        </li>
        <li v-for="p in pageList" :key="p" class="page-item" :class="{ active: p - 1 === currentPage }">
          <button class="page-link" @click="goToPage(p - 1)" :aria-label="`Go to page ${p}`">{{ p }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
          <button class="page-link" @click="goToPage(currentPage + 1)" aria-label="Next page">Next</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  shoppingList: {
    type: Array,
    default: () => []
  }
})

// Fallback demo data when parent doesn't pass shoppingList
const fallbackData = [
  { ingredient: 'Tomato', amount: '2 pcs', category: 'Vegetable' },
  { ingredient: 'Chicken Breast', amount: '500 g', category: 'Meat' },
  { ingredient: 'Olive Oil', amount: '100 ml', category: 'Condiment' },
  { ingredient: 'Garlic', amount: '3 cloves', category: 'Vegetable' },
  { ingredient: 'Onion', amount: '1 pc', category: 'Vegetable' },
  { ingredient: 'Spinach', amount: '200 g', category: 'Vegetable' },
  { ingredient: 'Rice', amount: '500 g', category: 'Grain' },
  { ingredient: 'Salmon', amount: '2 fillets', category: 'Seafood' },
  { ingredient: 'Soy Sauce', amount: '50 ml', category: 'Condiment' },
  { ingredient: 'Milk', amount: '1 L', category: 'Dairy' },
  { ingredient: 'Eggs', amount: '12 pcs', category: 'Dairy' },
  { ingredient: 'Bell Pepper', amount: '2 pcs', category: 'Vegetable' },
  { ingredient: 'Broccoli', amount: '1 head', category: 'Vegetable' },
  { ingredient: 'Pasta', amount: '400 g', category: 'Grain' },
  { ingredient: 'Cheddar Cheese', amount: '200 g', category: 'Dairy' }
]

const rawRows = computed(() => (props.shoppingList && props.shoppingList.length ? props.shoppingList : fallbackData))

// Filters with debounce
const filters = ref({ ingredient: '', amount: '', category: '' })
const debouncedFilters = ref({ ingredient: '', amount: '', category: '' })
let filterTimer = null
watch(filters, (val) => {
  clearTimeout(filterTimer)
  filterTimer = setTimeout(() => {
    debouncedFilters.value = { ...val }
    currentPage.value = 0 // reset to first page when filters change
  }, 300)
}, { deep: true })

// Sorting
const sortKey = ref('ingredient')
const sortOrder = ref('asc') // 'asc' | 'desc'
function toggleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
function ariaSort(key) {
  if (sortKey.value !== key) return 'none'
  return sortOrder.value === 'asc' ? 'ascending' : 'descending'
}

// Pagination
const currentPage = ref(0)
const pageSize = ref(10)
function goToPage(p) {
  if (p < 0 || p > totalPages.value - 1) return
  currentPage.value = p
}

// Helpers
function includesCI(haystack, needle) {
  if (!needle) return true
  return String(haystack || '').toLowerCase().includes(String(needle).toLowerCase())
}
function amountToNumber(amount) {
  // Extract leading numeric value for better numeric sorting, fallback to lexical
  const m = String(amount || '').match(/[\d.]+/)
  return m ? parseFloat(m[0]) : Number.NEGATIVE_INFINITY
}

// Pipeline: filter -> sort -> paginate
const filteredRows = computed(() => {
  const f = debouncedFilters.value
  return rawRows.value.filter((r) =>
    includesCI(r.ingredient, f.ingredient) &&
    includesCI(r.amount, f.amount) &&
    includesCI(r.category, f.category)
  )
})

const sortedRows = computed(() => {
  const rows = [...filteredRows.value]
  rows.sort((a, b) => {
    let av, bv
    if (sortKey.value === 'amount') {
      av = amountToNumber(a.amount)
      bv = amountToNumber(b.amount)
    } else {
      av = String(a[sortKey.value] || '').toLowerCase()
      bv = String(b[sortKey.value] || '').toLowerCase()
    }
    if (av < bv) return sortOrder.value === 'asc' ? -1 : 1
    if (av > bv) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value)))
const paginatedRows = computed(() => {
  const start = currentPage.value * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})

const pageList = computed(() => {
  // Generate a compact page list (1-based) up to 5 items around current
  const tp = totalPages.value
  const cur = currentPage.value + 1
  const pages = []
  let start = Math.max(1, cur - 2)
  let end = Math.min(tp, cur + 2)
  if (end - start < 4) {
    if (start === 1) end = Math.min(tp, start + 4)
    else if (end === tp) start = Math.max(1, end - 4)
  }
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
})

function clearFilters() {
  filters.value = { ingredient: '', amount: '', category: '' }
  sortKey.value = 'ingredient'
  sortOrder.value = 'asc'
  currentPage.value = 0
}
</script>

<style scoped>
.shopping-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 16px;
}

.shopping-header .title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-green-700, #064e3b);
}
.shopping-header .subtitle {
  font-size: 0.95rem;
  color: #6b7280; /* muted text */
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.table-sort-btn {
  background: transparent;
  border: none;
  padding: 0;
  font-weight: 700;
  color: #374151;
}
.table-sort-btn:focus {
  outline: 2px solid rgba(34, 197, 94, 0.35);
  outline-offset: 2px;
}

.sort-indicator {
  margin-left: 4px;
  color: #10b981;
}

/* Truncate long cell content for responsiveness */
td.text-truncate {
  max-width: 240px;
}

/* Pagination fine-tuning */
.pagination .page-link {
  cursor: pointer;
}
</style>