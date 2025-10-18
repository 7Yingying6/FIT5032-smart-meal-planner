<template>
  <div class="shopping-card">
    <div class="shopping-header">
      <h5 class="title">Shopping List</h5>
      <p class="subtitle">Interactive list for weekly meal plan</p>
    </div>

    <!-- DataTables needs a thead; rows are rendered by the plugin -->
    <div class="table-container">
      <table ref="tableRef" class="display stripe hover" style="width:100%">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps } from 'vue'
import $ from 'jquery'
import DataTable from 'datatables.net'
import 'datatables.net-dt/css/dataTables.dataTables.css'

const props = defineProps({
  shoppingList: {
    type: Array,
    default: () => []
  }
})

const tableRef = ref(null)
let dtInstance = null

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

const getData = () => (props.shoppingList && props.shoppingList.length ? props.shoppingList : fallbackData)

function initDataTable() {
  // Avoid duplicate binding
  if (dtInstance) {
    dtInstance.destroy()
    dtInstance = null
  }

  dtInstance = new DataTable(tableRef.value, {
    data: getData(),
    columns: [
      { title: 'Ingredient', data: 'ingredient' },
      { title: 'Amount', data: 'amount' },
      { title: 'Category', data: 'category' }
    ],
    // Interactions
    searching: true,
    ordering: true,
    paging: true,
    pageLength: 10,
    lengthChange: false,
    info: true,
    autoWidth: false,

    // Language and labels
    language: {
      search: 'Search:',
      info: 'Showing _START_ to _END_ of _TOTAL_ entries'
    },

    // Styling classes from DataTables
    // "display" + "stripe" + "hover" classes are already on the table tag
  })

  // Enhance search input UX using jQuery
  $('.dataTables_filter input')
    .attr('placeholder', 'Type to filter...')
    .addClass('form-control form-control-sm')
}

onMounted(() => {
  initDataTable()
})

onBeforeUnmount(() => {
  if (dtInstance) {
    dtInstance.destroy()
    dtInstance = null
  }
})

// React to prop changes and update rows without re-binding
watch(
  () => props.shoppingList,
  () => {
    if (!dtInstance) return
    const data = getData()
    dtInstance.clear()
    dtInstance.rows.add(data).draw()
  },
  { deep: true }
)
</script>

<style scoped>
.shopping-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 16px;
}

.shopping-header .title {
  margin: 0 0 4px;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-green-700, #064e3b);
}
.shopping-header .subtitle {
  margin: 0 0 12px;
  font-size: 0.95rem;
  color: #6b7280; /* muted text */
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

/* Bold column headers */
:deep(table.dataTable thead th) {
  font-weight: 700;
}

/* DataTables wrapper fine-tuning inside scoped styles */
:deep(.dataTables_wrapper .dataTables_filter label) {
  font-weight: 600;
  color: #374151;
}
:deep(.dataTables_wrapper .dataTables_info) {
  font-size: 0.875rem;
  color: #6b7280;
}
:deep(.dataTables_wrapper .dataTables_paginate .paginate_button) {
  border-radius: 6px;
  border: 1px solid transparent;
  padding: 4px 8px;
  margin: 0 2px;
}
:deep(.dataTables_wrapper .dataTables_paginate .paginate_button:hover) {
  background: rgba(34, 197, 94, 0.08);
  color: var(--color-green-700, #064e3b) !important;
  border-color: rgba(34, 197, 94, 0.25);
}

/* Make the table itself crisp */
:deep(table.dataTable) {
  border-collapse: collapse;
}
:deep(table.dataTable tbody td) {
  font-size: 0.95rem;
}
</style>