<template>
  <div class="meal-plan-page">
    <!-- Page header: title and short context -->
    <div class="container-fluid py-4 mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="display-4 mb-2 page-title">
              <i class="fas fa-calendar-alt me-3"></i>Weekly Meal Plan
            </h1>
            <p class="lead mb-0">Your personalized meal plan for the week</p>
          </div>
          <div class="col-md-4 text-md-end">
            <button 
              @click="generateNewPlan" 
              class="btn btn-light btn-lg"
              :disabled="isGenerating"
            >
              <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': isGenerating }"></i>
              {{ isGenerating ? 'Generating...' : 'New Plan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Meal Plan Summary -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row text-center">
                <div class="col-6 col-md-3">
                  <div class="summary-stat">
                    <i class="fas fa-utensils text-success fs-2 mb-2"></i>
                    <h4 class="mb-1">{{ mealPlan.length }}</h4>
                    <small class="text-muted">Meals Planned</small>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="summary-stat">
                    <i class="fas fa-clock text-primary fs-2 mb-2"></i>
                    <h4 class="mb-1">{{ totalCookingTime }} min</h4>
                    <small class="text-muted">Total Cook Time</small>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="summary-stat">
                    <i class="fas fa-fire text-danger fs-2 mb-2"></i>
                    <h4 class="mb-1">{{ totalCalories }}</h4>
                    <small class="text-muted">Total Calories</small>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="summary-stat">
                    <i class="fas fa-users text-warning fs-2 mb-2"></i>
                    <h4 class="mb-1">{{ averageServings }}</h4>
                    <small class="text-muted">Avg Servings</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Meal Plan Cards -->
      <div class="row">
        <div 
          v-for="(meal, index) in mealPlan" 
          :key="`${meal.id}-${index}`"
          class="col-12 col-md-6 col-lg-4 mb-4"
        >
          <div class="card h-100 shadow-sm meal-card">
            <div class="position-relative">
              <img 
                :src="meal.image" 
                :alt="meal.title"
                class="card-img-top meal-image"
                loading="lazy"
              >
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-success">{{ getDayName(index) }}</span>
              </div>
              <div class="position-absolute top-0 start-0 m-2">
                <span class="badge bg-dark">
                  <i class="fas fa-clock me-1"></i>{{ meal.cookingTime }}min
                </span>
              </div>
            </div>
            
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">{{ meal.title }}</h5>
                <span class="badge bg-primary">{{ meal.category }}</span>
              </div>
              
              <p class="card-text text-muted flex-grow-1">{{ meal.description }}</p>
              
              <!-- Meal Stats -->
              <div class="meal-stats mb-3">
                <div class="row text-center">
                  <div class="col-4">
                    <small class="text-muted">
                      <i class="fas fa-users"></i><br>
                      {{ meal.servings }}
                    </small>
                  </div>
                  <div class="col-4">
                    <small class="text-muted">
                      <i class="fas fa-fire"></i><br>
                      {{ meal.calories }}
                    </small>
                  </div>
                  <div class="col-4">
                    <small class="text-muted">
                      <i class="fas fa-chart-line"></i><br>
                      {{ meal.difficulty }}
                    </small>
                  </div>
                </div>
              </div>
              
              <!-- Meal Tags -->
              <div class="meal-tags mb-3">
                <span 
                  v-for="tag in meal.tags.slice(0, 2)" 
                  :key="tag"
                  class="badge bg-light text-dark me-1 mb-1"
                >
                  {{ tag }}
                </span>
              </div>
              
              <!-- Action Buttons -->
              <div class="d-flex justify-content-center mt-auto">
                <button 
                  @click="replaceMeal(index)" 
                  class="btn btn-success"
                  :disabled="isReplacing === index"
                  title="Replace this meal"
                >
                  <i 
                    class="fas fa-sync-alt me-2" 
                    :class="{ 'fa-spin': isReplacing === index }"
                  ></i>
                  {{ isReplacing === index ? 'Replacing...' : 'Replace Meal' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shopping List Section -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-info text-white">
              <h4 class="card-title mb-0">
                <i class="fas fa-shopping-cart me-2"></i>Shopping List
                <button 
                  @click="toggleShoppingList" 
                  class="btn btn-sm btn-light float-end"
                >
                  <i class="fas" :class="showShoppingList ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                </button>
              </h4>
            </div>
            <div v-show="showShoppingList" class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">
                    <i class="fas fa-list me-2"></i>All Ingredients
                  </h6>
                  <ul class="list-unstyled shopping-list">
                    <li 
                      v-for="ingredient in uniqueIngredients" 
                      :key="ingredient"
                      class="d-flex align-items-center mb-2"
                    >
                      <input 
                        type="checkbox" 
                        :id="`shop-${ingredient}`"
                        class="form-check-input me-3"
                      >
                      <label 
                        :for="`shop-${ingredient}`"
                        class="form-check-label flex-grow-1"
                      >
                        {{ ingredient }}
                      </label>
                    </li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">
                    <i class="fas fa-info-circle me-2"></i>Shopping Tips
                  </h6>
                  <div class="alert alert-info">
                    <ul class="mb-0">
                      <li>Check your pantry before shopping</li>
                      <li>Buy fresh ingredients closer to cooking day</li>
                      <li>Consider buying in bulk for common ingredients</li>
                      <li>Don't forget to check the alternatives section</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Shopping Table Section -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0 d-flex align-items-center">
                <i class="fas fa-table me-2 text-success"></i>
                Interactive Shopping Table
              </h5>
            </div>
            <div class="card-body">
              <InteractiveShoppingTable :shoppingList="shoppingTableData" />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="row mt-4 mb-2">
        <div class="col-12 text-center">
          <div class="d-flex justify-content-center gap-3 flex-wrap">
            <button @click="generateNewPlan" class="btn btn-success btn-lg">
              <i class="fas fa-magic me-2"></i>Generate New Plan
            </button>
            <button @click="savePlan" class="btn btn-primary btn-lg">
              <i class="fas fa-save me-2"></i>Save Plan
            </button>
            <button @click="toggleExportOptions" class="btn btn-outline-secondary btn-lg">
              <i class="fas fa-download me-2"></i>Export
              <i class="fas" :class="showExportOptions ? 'fa-chevron-up ms-1' : 'fa-chevron-down ms-1'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div v-if="showExportOptions" class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-center gap-2 flex-wrap">
                <button @click="exportShoppingListCSV" class="btn btn-outline-secondary">
                  <i class="fas fa-file-csv me-2"></i>Shopping List (CSV)
                </button>
                <button @click="exportShoppingListPDF" class="btn btn-outline-secondary">
                  <i class="fas fa-file-pdf me-2"></i>Shopping List (PDF)
                </button>
                <button @click="exportWeekPlanCSV" class="btn btn-outline-secondary">
                  <i class="fas fa-file-csv me-2"></i>Weekly Plan (CSV)
                </button>
                <button @click="exportWeekPlanPDF" class="btn btn-outline-secondary">
                  <i class="fas fa-file-pdf me-2"></i>Weekly Plan (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import recipesData from '@/data/recipes.json'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'
import InteractiveShoppingTable from '@/components/InteractiveShoppingTable.vue'

export default {
  name: 'MealPlan',
  components: {
    InteractiveShoppingTable
  },
  data() {
    return {
      recipes: recipesData,
      mealPlan: [],
      isGenerating: false,
      isReplacing: null,
      showShoppingList: false,
      showExportOptions: false,
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },
  computed: {
    totalCookingTime() {
      return this.mealPlan.reduce((total, meal) => total + meal.cookingTime, 0)
    },
    totalCalories() {
      return this.mealPlan.reduce((total, meal) => total + meal.calories, 0)
    },
    averageServings() {
      if (this.mealPlan.length === 0) return 0
      const total = this.mealPlan.reduce((sum, meal) => sum + meal.servings, 0)
      return Math.round(total / this.mealPlan.length)
    },
    uniqueIngredients() {
      const allIngredients = []
      this.mealPlan.forEach(meal => {
        allIngredients.push(...meal.ingredients)
      })
      return [...new Set(allIngredients)].sort()
    },
    // Build shopping list data for InteractiveShoppingTable
    shoppingTableData() {
      const map = new Map()
      this.mealPlan.forEach(meal => {
        const ingList = meal.ingredients || []
        ingList.forEach(ing => {
          const key = (ing || '').trim()
          if (!key) return
          const current = map.get(key) || { count: 0, category: meal.category || 'General' }
          current.count += 1
          // preserve first non-empty category
          if (!current.category && meal.category) current.category = meal.category
          map.set(key, current)
        })
      })
      return Array.from(map.entries())
        .map(([ingredient, stat]) => ({
          ingredient,
          amount: String(stat.count),
          category: stat.category || 'General'
        }))
        .sort((a, b) => a.ingredient.localeCompare(b.ingredient))
    }
  },
  methods: {
    generateNewPlan() {
      this.isGenerating = true
      setTimeout(() => {
        this.mealPlan = this.getRandomRecipes(5)
        this.isGenerating = false
      }, 1000)
    },
    getRandomRecipes(count) {
      const shuffled = [...this.recipes].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    },
    replaceMeal(index) {
      this.isReplacing = index
      setTimeout(() => {
        const currentMealIds = this.mealPlan.map(meal => meal.id)
        const availableRecipes = this.recipes.filter(recipe => 
          !currentMealIds.includes(recipe.id)
        )
        if (availableRecipes.length > 0) {
          const randomRecipe = availableRecipes[
            Math.floor(Math.random() * availableRecipes.length)
          ]
          this.mealPlan.splice(index, 1, randomRecipe)
        } else {
          const randomRecipe = this.recipes[
            Math.floor(Math.random() * this.recipes.length)
          ]
          this.mealPlan.splice(index, 1, randomRecipe)
        }
        this.isReplacing = null
      }, 500)
    },
    getDayName(index) {
      return this.dayNames[index] || `Day ${index + 1}`
    },
    toggleShoppingList() {
      this.showShoppingList = !this.showShoppingList
    },
    savePlan() {
      const planData = {
        mealPlan: this.mealPlan,
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('savedMealPlan', JSON.stringify(planData))
      alert('Meal plan saved successfully!')
    },
    toggleExportOptions() {
      this.showExportOptions = !this.showExportOptions
    },
    // --- Export helpers ---
    buildShoppingListData() {
      return this.uniqueIngredients.map(name => ({ Ingredient: name }))
    },
    buildWeekPlanData() {
      return this.mealPlan.map((meal, index) => ({
        Day: this.getDayName(index),
        Title: meal.title,
        Category: meal.category,
        Servings: meal.servings,
        Calories: meal.calories,
        CookingTime: meal.cookingTime + ' min',
        Ingredients: (meal.ingredients || []).join(', ')
      }))
    },
    exportCSV(filename, rows) {
      if (!rows || rows.length === 0) {
        alert('Nothing to export. Please generate a plan first.')
        return
      }
      const csv = Papa.unparse(rows)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    exportShoppingListCSV() {
      const rows = this.buildShoppingListData()
      this.exportCSV(`shopping-list-${new Date().toISOString().slice(0,10)}.csv`, rows)
    },
    exportWeekPlanCSV() {
      const rows = this.buildWeekPlanData()
      this.exportCSV(`weekly-meal-plan-${new Date().toISOString().slice(0,10)}.csv`, rows)
    },
    exportShoppingListPDF() {
      if (this.uniqueIngredients.length === 0) {
        alert('Nothing to export. Please generate a plan first.')
        return
      }
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text('Shopping List', 14, 18)
      autoTable(doc, {
        head: [["Ingredient"]],
        body: this.uniqueIngredients.map(i => [i]),
        startY: 24
      })
      doc.save(`shopping-list-${new Date().toISOString().slice(0,10)}.pdf`)
    },
    exportWeekPlanPDF() {
      if (this.mealPlan.length === 0) {
        alert('Nothing to export. Please generate a plan first.')
        return
      }
      const doc = new jsPDF('p', 'mm', 'a4')
      doc.setFontSize(16)
      doc.text('Weekly Meal Plan', 14, 18)
      const rows = this.buildWeekPlanData().map(r => [
        r.Day, r.Title, r.Category, r.Servings, r.Calories, r.CookingTime
      ])
      autoTable(doc, {
        head: [["Day", "Title", "Category", "Servings", "Calories", "Cook Time"]],
        body: rows,
        startY: 24,
        styles: { fontSize: 10 }
      })
      doc.save(`weekly-meal-plan-${new Date().toISOString().slice(0,10)}.pdf`)
    },
    exportPlan() {
      // Default to exporting the weekly meal plan PDF
      this.exportWeekPlanPDF()
    },
    loadSavedPlan() {
      const saved = localStorage.getItem('savedMealPlan')
      if (saved) {
        const planData = JSON.parse(saved)
        this.mealPlan = planData.mealPlan
      } else {
        this.generateNewPlan()
      }
    }
  },
  mounted() {
    this.loadSavedPlan()
  }
}
</script>

<style scoped>
.meal-plan-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.summary-stat {
  padding: 1rem;
}

.meal-card {
  border: none;
}

.meal-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.meal-image {
  height: 200px;
  object-fit: cover;
}

.meal-stats {
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
  padding: 0.75rem 0;
}

.meal-tags .badge {
  font-size: 0.7rem;
}

.shopping-list {
  max-height: 300px;
  overflow-y: auto;
}

.shopping-list input:checked + label {
  text-decoration: line-through;
  color: #6c757d;
}

.bg-success {
  background: var(--color-green-500) !important;
}

.btn-success {
  background: var(--color-green-500);
  border: none;
}

.btn-success:hover {
  background: var(--color-green-400);
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2rem;
  }
  
  .meal-image {
    height: 180px;
  }
  
  .summary-stat {
    margin-bottom: 1rem;
  }
}

.page-title {
  color: var(--color-green-400) !important;
  font-weight: 800;
  letter-spacing: 0.2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
}
.page-title .fa-calendar-alt {
  color: var(--color-green-400);
}

.lead {
  color: rgba(0, 0, 0, 0.70);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.20);
}
</style>