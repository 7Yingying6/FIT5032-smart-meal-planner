<template>
  <div class="recipes-page">
    <!-- Recipes: page header -->
    <div class="container-fluid bg-success text-white py-4 mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="display-4 mb-2 page-title">
              <i class="fas fa-utensils me-3"></i>Recipe Collection
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
                <i class="fas fa-filter me-2"></i>Filter Recipes
              </h5>
              <div class="row g-3">
                <div class="col-md-3">
                  <label for="categoryFilter" class="form-label">Category</label>
                  <select 
                    id="categoryFilter" 
                    v-model="selectedCategory" 
                    class="form-select"
                  >
                    <option value="">All Categories</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Comfort Food">Comfort Food</option>
                    <option value="Asian">Asian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="timeFilter" class="form-label">Cooking Time</label>
                  <select 
                    id="timeFilter" 
                    v-model="maxCookingTime" 
                    class="form-select"
                  >
                    <option value="">Any Time</option>
                    <option value="15">&lt;= 15 minutes</option>
                    <option value="30">&lt;= 30 minutes</option>
                    <option value="45">&lt;= 45 minutes</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="difficultyFilter" class="form-label">Difficulty</label>
                  <select 
                    id="difficultyFilter" 
                    v-model="selectedDifficulty" 
                    class="form-select"
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
                  >
                    <option value="default">Default</option>
                     <option value="Rating: High to Low">Rating: High to Low</option>
                     <option value="Most Reviewed">Most Reviewed</option>
                  </select>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-12">
                  <button 
                    @click="clearFilters" 
                    class="btn btn-outline-secondary"
                    :disabled="!hasActiveFilters"
                  >
                    <i class="fas fa-times me-2"></i>Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid of recipe cards -->
      <div class="row">
        <div 
          v-for="recipe in filteredRecipes" 
          :key="recipe.id" 
          class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
        >
          <RecipeCard :recipe="recipe" />
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="filteredRecipes.length === 0" class="row">
        <div class="col-12 text-center py-5">
          <div class="card">
            <div class="card-body">
              <i class="fas fa-search fa-3x text-muted mb-3"></i>
              <h4 class="text-muted">No recipes found</h4>
              <p class="text-muted">Try adjusting your filters to see more results.</p>
              <button @click="clearFilters" class="btn btn-primary">
                <i class="fas fa-times me-2"></i>Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import recipesData from '@/data/recipes.json'
import RecipeCard from '@/components/RecipeCard.vue'
import { getRecipeRatings } from '@/utils/ratingStorage'

export default {
  name: 'Recipes',
  components: {
    RecipeCard
  },
  data() {
    return {
      recipes: recipesData,
      selectedCategory: '',
      maxCookingTime: '',
      selectedDifficulty: '',
      sortBy: 'default'
    }
  },
  computed: {
    filteredRecipes() {
      let filtered = this.recipes
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(recipe => 
          recipe.category === this.selectedCategory
        )
      }
      
      // Filter by cooking time
      if (this.maxCookingTime) {
        filtered = filtered.filter(recipe => 
          recipe.cookingTime <= parseInt(this.maxCookingTime)
        )
      }
      
      // Filter by difficulty
      if (this.selectedDifficulty) {
        filtered = filtered.filter(recipe => 
          recipe.difficulty === this.selectedDifficulty
        )
      }
      
      // Sort recipes
      if (this.sortBy === 'Rating: High to Low') {
        filtered = filtered.sort((a, b) => {
          const ratingA = a.averageRating || 0
          const ratingB = b.averageRating || 0
          return ratingB - ratingA
        })
      } else if (this.sortBy === 'Most Reviewed') {
        filtered = filtered.sort((a, b) => {
          const countA = a.totalRatings || 0
          const countB = b.totalRatings || 0
          return countB - countA
        })
      }
      
      return filtered
    },
    hasActiveFilters() {
      return this.selectedCategory || this.maxCookingTime || this.selectedDifficulty
    }
  },
  methods: {
    clearFilters() {
      this.selectedCategory = ''
      this.maxCookingTime = ''
      this.selectedDifficulty = ''
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
.page-title .fa-utensils {
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
</style>