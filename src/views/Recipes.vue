<template>
  <div class="recipes-page">
    <!-- Recipes: page header -->
    <div class="container-fluid bg-success text-white py-4 mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="display-4 mb-2 page-title">
              <Icon icon="mdi:silverware-fork-knife" class="me-3" />Recipe Collection
            </h1>
            <p class="lead mb-0">Discover delicious recipes for every occasion</p>
          </div>
          <div class="col-md-4 text-md-end">
            <div class="badge bg-light text-success fs-6">
              {{ filteredRecipes.length }} recipes available
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Filter Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3">
                <Icon icon="mdi:filter-variant" class="me-2" />Filter Recipes
              </h5>
              <div class="row g-3" role="group" aria-label="Recipe filters">
                <div class="col-md-3">
                  <label for="categoryFilter" class="form-label">Category</label>
                  <select 
                    id="categoryFilter" 
                    v-model="selectedCategory" 
                    class="form-select"
                    aria-label="Select meal category"
                  >
                    <option value="">All Categories</option>
                    <option value="Asian">Asian</option>
                    <option value="Western">Western</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="timeFilter" class="form-label">Cooking Time</label>
                  <select 
                    id="timeFilter" 
                    v-model="maxCookingTime" 
                    class="form-select"
                    aria-label="Select maximum cooking time"
                  >
                    <option value="">Any Time</option>
                    <option value="15">&lt;= 15 minutes</option>
                    <option value="25">&lt;= 25 minutes</option>
                    <option value="30">&lt;= 30 minutes</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="difficultyFilter" class="form-label">Difficulty</label>
                  <select 
                    id="difficultyFilter" 
                    v-model="selectedDifficulty" 
                    class="form-select"
                    aria-label="Select difficulty level"
                  >
                    <option value="">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="sortFilter" class="form-label">Sort By</label>
                  <select 
                    id="sortFilter" 
                    v-model="sortBy" 
                    class="form-select"
                    aria-label="Select sort option"
                  >
                    <option value="default">Default</option>
                     <option value="Rating: High to Low">Rating: High to Low</option>
                     <option value="Most Reviewed">Most Reviewed</option>
                  </select>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-12 d-flex gap-2">
                  <button 
                    @click="viewMode = 'cards'" 
                    class="btn" 
                    :class="viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'"
                    :aria-pressed="viewMode === 'cards'"
                    aria-label="Show recipes in card view"
                  >
                    <Icon icon="mdi:view-grid" class="me-2" />Card View
                  </button>
                  <button 
                    @click="viewMode = 'table'" 
                    class="btn" 
                    :class="viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'"
                    :aria-pressed="viewMode === 'table'"
                    aria-label="Show recipes in table view"
                  >
                    <Icon icon="mdi:table" class="me-2" />Table View
                  </button>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-12">
                  <button 
                    @click="clearFilters" 
                    class="btn btn-outline-secondary"
                    :disabled="!hasActiveFilters"
                    aria-label="Clear all top-level filters"
                  >
                    <Icon icon="mdi:close" class="me-2" />Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid of recipe cards -->
      <div v-if="viewMode === 'cards'" class="row" role="region" aria-label="Recipes card view">
        <div 
          v-for="recipe in filteredRecipes" 
          :key="recipe.id" 
          class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
        >
          <RecipeCard :recipe="recipe" />
        </div>
      </div>

      <!-- Table view -->
      <div v-else class="row" role="region" aria-label="Recipes table view">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <button @click="clearColumnFilters" class="btn btn-outline-secondary btn-sm" aria-label="Clear table column filters">Clear Column Filters</button>
                <div class="d-flex align-items-center gap-2">
                  <label class="form-label mb-0 small text-muted" for="recipesPageSize">Per Page</label>
                  <select id="recipesPageSize" class="form-select form-select-sm w-auto" v-model.number="tablePageSize" aria-label="Select page size">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                </div>
              </div>

              <table class="table table-striped table-hover align-middle" role="table" aria-label="Recipes Table">
                <caption class="visually-hidden">Recipes Table View</caption>
                <thead>
                  <tr role="row">
                    <th scope="col" role="columnheader">
                      <button class="table-sort-btn" @click="toggleTableSort('title')" :aria-sort="ariaSort('title')" aria-label="Sort by Title">
                        Title
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'title' && tableSortOrder === 'asc'">&uarr;</span>
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'title' && tableSortOrder === 'desc'">&darr;</span>
                      </button>
                    </th>
                    <th scope="col" role="columnheader">
                      <button class="table-sort-btn" @click="toggleTableSort('category')" :aria-sort="ariaSort('category')" aria-label="Sort by Category">
                        Category
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'category' && tableSortOrder === 'asc'">&uarr;</span>
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'category' && tableSortOrder === 'desc'">&darr;</span>
                      </button>
                    </th>
                    <th scope="col" role="columnheader">
                      <button class="table-sort-btn" @click="toggleTableSort('cookingTime')" :aria-sort="ariaSort('cookingTime')" aria-label="Sort by Cooking Time">
                        Cooking Time
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'cookingTime' && tableSortOrder === 'asc'">&uarr;</span>
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'cookingTime' && tableSortOrder === 'desc'">&darr;</span>
                      </button>
                    </th>
                    <th scope="col" role="columnheader">
                      <button class="table-sort-btn" @click="toggleTableSort('difficulty')" :aria-sort="ariaSort('difficulty')" aria-label="Sort by Difficulty">
                        Difficulty
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'difficulty' && tableSortOrder === 'asc'">&uarr;</span>
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'difficulty' && tableSortOrder === 'desc'">&darr;</span>
                      </button>
                    </th>
                    <th scope="col" role="columnheader">
                      <button class="table-sort-btn" @click="toggleTableSort('rating')" :aria-sort="ariaSort('rating')" aria-label="Sort by Rating">
                        Rating
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'rating' && tableSortOrder === 'asc'">&uarr;</span>
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'rating' && tableSortOrder === 'desc'">&darr;</span>
                      </button>
                    </th>
                    <th scope="col" role="columnheader">
                      <button class="table-sort-btn" @click="toggleTableSort('reviews')" :aria-sort="ariaSort('reviews')" aria-label="Sort by Reviews">
                        Reviews
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'reviews' && tableSortOrder === 'asc'">&uarr;</span>
                        <span class="sort-indicator" aria-hidden="true" v-if="tableSortKey === 'reviews' && tableSortOrder === 'desc'">&darr;</span>
                      </button>
                    </th>
                  </tr>
                  <tr role="row">
                    <th role="columnheader"><input v-model="columnFilters.title" type="text" class="form-control form-control-sm" placeholder="Column filter..." aria-label="Filter Title" /></th>
                    <th role="columnheader"><input v-model="columnFilters.category" type="text" class="form-control form-control-sm" placeholder="Column filter..." aria-label="Filter Category" /></th>
                    <th role="columnheader"><input v-model="columnFilters.cookingTime" type="text" class="form-control form-control-sm" placeholder="Column filter..." aria-label="Filter Cooking Time" /></th>
                    <th role="columnheader"><input v-model="columnFilters.difficulty" type="text" class="form-control form-control-sm" placeholder="Column filter..." aria-label="Filter Difficulty" /></th>
                    <th role="columnheader"><input v-model="columnFilters.rating" type="text" class="form-control form-control-sm" placeholder="Column filter..." aria-label="Filter Rating" /></th>
                    <th role="columnheader"><input v-model="columnFilters.reviews" type="text" class="form-control form-control-sm" placeholder="Column filter..." aria-label="Filter Reviews" /></th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  <tr v-if="paginatedRows.length === 0" role="row">
                    <td role="cell" colspan="6" class="text-center text-muted py-4">No matching results. Please adjust filters.</td>
                  </tr>
                  <tr v-for="row in paginatedRows" :key="row.id" role="row">
                    <td role="cell" class="text-truncate" :title="row.title">{{ row.title }}</td>
                    <td role="cell" class="text-truncate" :title="row.category">{{ row.category }}</td>
                    <td role="cell">{{ row.cookingTime }}</td>
                    <td role="cell" class="text-truncate" :title="row.difficulty">{{ row.difficulty }}</td>
                    <td role="cell">{{ row.rating.toFixed(1) }}</td>
                    <td role="cell">{{ row.reviews }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="d-flex justify-content-between align-items-center mt-2" role="navigation" aria-label="Recipes table pagination">
                <div class="text-muted small">Page {{ currentPage + 1 }} / {{ totalPages }} ({{ filteredTableRows.length }} items)</div>
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
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="filteredRecipes.length === 0" class="row">
        <div class="col-12 text-center py-5">
          <div class="card">
            <div class="card-body">
              <Icon icon="mdi:magnify" class="text-muted mb-3" style="font-size: 3rem" />
              <h4 class="text-muted">No recipes found</h4>
              <p class="text-muted">Try adjusting your filters to see more results.</p>
              <button @click="clearFilters" class="btn btn-primary" aria-label="Clear all filters">
                <Icon icon="mdi:close" class="me-2" />Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeCard from '@/components/RecipeCard.vue'
import { getRecipeRatings } from '@/utils/ratingStorage'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import localRecipes from '@/recipes.json'
// Remove jQuery/DataTables imports
// import $ from 'jquery'
// import DataTable from 'datatables.net'
// import 'datatables.net-dt/css/dataTables.dataTables.css'

export default {
  name: 'Recipes',
  components: { RecipeCard },
  setup() {
    const recipes = ref([])
    const selectedCategory = ref('')
    const maxCookingTime = ref('')
    const selectedDifficulty = ref('')
    const sortBy = ref('default')
    const viewMode = ref('cards')

    // Load recipes from Firestore (fallback to local JSON)
    onMounted(async () => {
      try {
        // Early fallback in dev or when Firestore is not initialized
        if (!db) {
          recipes.value = (Array.isArray(localRecipes) ? localRecipes : []).map(r => {
            const rating = getRecipeRatings(r.id)
            return {
              id: r.id,
              title: r.title || r.name || '',
              name: r.name || r.title || '',
              description: r.description || '',
              category: r.category || '',
              cookingTime: Number(r.cookingTime) || 0,
              difficulty: r.difficulty || 'Easy',
              calories: Number(r.calories) || 0,
              image: r.image || '',
              tags: Array.isArray(r.tags) ? r.tags : [],
              averageRating: rating.averageRating || 0,
              totalRatings: rating.totalRatings || 0
            }
          })
          return
        }
        const snap = await getDocs(collection(db, 'recipes'))
        const docs = snap.docs.map(d => {
          const data = d.data() || {}
          const id = d.id
          const rating = getRecipeRatings(id)
          return {
            id,
            title: data.title || data.name || '',
            name: data.name || data.title || '',
            description: data.description || '',
            category: data.category || '',
            cookingTime: Number(data.cookingTime) || 0,
            difficulty: data.difficulty || 'Easy',
            calories: Number(data.calories) || 0,
            image: data.image || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            averageRating: rating.averageRating || 0,
            totalRatings: rating.totalRatings || 0
          }
        })
        recipes.value = docs
        if (!recipes.value.length) throw new Error('No Firestore recipes')
      } catch (_) {
        // Fallback to local JSON
        recipes.value = (Array.isArray(localRecipes) ? localRecipes : []).map(r => {
          const rating = getRecipeRatings(r.id)
          return {
            id: r.id,
            title: r.title || r.name || '',
            name: r.name || r.title || '',
            description: r.description || '',
            category: r.category || '',
            cookingTime: Number(r.cookingTime) || 0,
            difficulty: r.difficulty || 'Easy',
            calories: Number(r.calories) || 0,
            image: r.image || '',
            tags: Array.isArray(r.tags) ? r.tags : [],
            averageRating: rating.averageRating || 0,
            totalRatings: rating.totalRatings || 0
          }
        })
      }
    })

    // Cards view filtering & sorting
    const filteredRecipes = computed(() => {
      let arr = Array.isArray(recipes.value) ? [...recipes.value] : []
      if (selectedCategory.value) {
        arr = arr.filter(r => String(r.category) === String(selectedCategory.value))
      }
      if (maxCookingTime.value) {
        const lim = Number(maxCookingTime.value)
        arr = arr.filter(r => Number(r.cookingTime) <= lim)
      }
      if (selectedDifficulty.value) {
        arr = arr.filter(r => String(r.difficulty) === String(selectedDifficulty.value))
      }
      // Sort options for cards view
      if (sortBy.value === 'Rating: High to Low') {
        arr.sort((a, b) => Number(b.averageRating) - Number(a.averageRating))
      } else if (sortBy.value === 'Most Reviewed') {
        arr.sort((a, b) => Number(b.totalRatings) - Number(a.totalRatings))
      }
      return arr
    })

    const hasActiveFilters = computed(() => {
      return Boolean(
        selectedCategory.value ||
        maxCookingTime.value ||
        selectedDifficulty.value ||
        (sortBy.value && sortBy.value !== 'default')
      )
    })

    // Reset table pagination when top-level filters change
    watch([selectedCategory, maxCookingTime, selectedDifficulty, sortBy], () => {
      currentPage.value = 0
    })

    // Remove DataTables refs
    // const tableRef = ref(null)
    // let dtInstance = null

    // --- Lightweight table pipeline state ---
    const columnFilters = ref({ title: '', category: '', cookingTime: '', difficulty: '', rating: '', reviews: '' })
    const debouncedColumnFilters = ref({ title: '', category: '', cookingTime: '', difficulty: '', rating: '', reviews: '' })
    let filterTimer = null
    watch(columnFilters, (val) => {
      clearTimeout(filterTimer)
      filterTimer = setTimeout(() => {
        debouncedColumnFilters.value = { ...val }
        currentPage.value = 0
      }, 300)
    }, { deep: true })

    const tableSortKey = ref('rating')
    const tableSortOrder = ref('desc') // default by Rating high to low
    function toggleTableSort(key) {
      if (tableSortKey.value === key) {
        tableSortOrder.value = tableSortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        tableSortKey.value = key
        tableSortOrder.value = 'asc'
      }
    }
    function ariaSort(key) {
      if (tableSortKey.value !== key) return 'none'
      return tableSortOrder.value === 'asc' ? 'ascending' : 'descending'
    }

    const tablePageSize = ref(10)
    const currentPage = ref(0)
    function goToPage(p) { if (p < 0 || p > totalPages.value - 1) return; currentPage.value = p }

    function includesCI(haystack, needle) {
      if (!needle) return true
      return String(haystack ?? '').toLowerCase().includes(String(needle).toLowerCase())
    }
    function toNumber(val) {
      const m = String(val ?? '').match(/[\d.]+/)
      return m ? parseFloat(m[0]) : Number.NEGATIVE_INFINITY
    }

    const baseRows = computed(() => filteredRecipes.value.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      cookingTime: Number(r.cookingTime) || 0,
      difficulty: r.difficulty,
      rating: Number(r.averageRating) || 0,
      reviews: Number(r.totalRatings) || 0
    })))

    const filteredTableRows = computed(() => {
      const f = debouncedColumnFilters.value
      return baseRows.value.filter(r =>
        includesCI(r.title, f.title) &&
        includesCI(r.category, f.category) &&
        includesCI(String(r.cookingTime), f.cookingTime) &&
        includesCI(r.difficulty, f.difficulty) &&
        includesCI(String(r.rating), f.rating) &&
        includesCI(String(r.reviews), f.reviews)
      )
    })

    const sortedRows = computed(() => {
      const rows = [...filteredTableRows.value]
      rows.sort((a, b) => {
        let av, bv
        if (['rating', 'reviews', 'cookingTime'].includes(tableSortKey.value)) {
          av = Number(a[tableSortKey.value])
          bv = Number(b[tableSortKey.value])
        } else {
          av = String(a[tableSortKey.value] ?? '').toLowerCase()
          bv = String(b[tableSortKey.value] ?? '').toLowerCase()
        }
        if (av < bv) return tableSortOrder.value === 'asc' ? -1 : 1
        if (av > bv) return tableSortOrder.value === 'asc' ? 1 : -1
        return 0
      })
      return rows
    })

    const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / tablePageSize.value)))
    const paginatedRows = computed(() => {
      const start = currentPage.value * tablePageSize.value
      return sortedRows.value.slice(start, start + tablePageSize.value)
    })

    const pageList = computed(() => {
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

    function clearColumnFilters() {
      columnFilters.value = { title: '', category: '', cookingTime: '', difficulty: '', rating: '', reviews: '' }
      tableSortKey.value = 'rating'
      tableSortOrder.value = 'desc'
      currentPage.value = 0
    }

    function clearFilters() {
      selectedCategory.value = ''
      maxCookingTime.value = ''
      selectedDifficulty.value = ''
    }

    return {
      recipes,
      selectedCategory,
      maxCookingTime,
      selectedDifficulty,
      sortBy,
      viewMode,
      filteredRecipes,
      hasActiveFilters,
      columnFilters,
      debouncedColumnFilters,
      tableSortKey,
      tableSortOrder,
      toggleTableSort,
      ariaSort,
      tablePageSize,
      currentPage,
      goToPage,
      baseRows,
      filteredTableRows,
      sortedRows,
      totalPages,
      paginatedRows,
      pageList,
      clearColumnFilters,
      clearFilters
    }
  }
}
</script>

<style scoped>
.recipes-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.bg-success {
  background: linear-gradient(135deg, var(--color-green-600) 0%, var(--color-green-700) 100%) !important;
}

/* Use light green for the page title and enhance readability */
.page-title {
  color: var(--color-green-400) !important;
  font-weight: 800;
  letter-spacing: 0.2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
}
.page-title .iconify {
  color: var(--color-green-400);
}

.lead {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.30);
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2rem;
  }
}
.table-sort-btn {
  background: transparent;
  border: none;
  padding: 0;
  font-weight: 700;
  color: #374151;
}
.table-sort-btn:focus { outline: 2px solid rgba(34, 197, 94, 0.35); outline-offset: 2px; }
.sort-indicator { margin-left: 4px; color: #10b981; }

/* Truncate long cell content */
td.text-truncate { max-width: 240px; }

.pagination .page-link { cursor: pointer; }
</style>