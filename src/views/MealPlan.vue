<template>
  <div class="meal-plan-page">
    <!-- Page Header -->
    <div class="container-fluid bg-success text-white py-4 mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="display-4 mb-2">
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

      <!-- Action Buttons -->
      <div class="row mt-4 mb-4">
        <div class="col-12 text-center">
          <div class="d-flex justify-content-center gap-3 flex-wrap">
            <button @click="generateNewPlan" class="btn btn-success btn-lg">
              <i class="fas fa-magic me-2"></i>Generate New Plan
            </button>
            <button @click="savePlan" class="btn btn-primary btn-lg">
              <i class="fas fa-save me-2"></i>Save Plan
            </button>
            <button @click="exportPlan" class="btn btn-outline-secondary btn-lg">
              <i class="fas fa-download me-2"></i>Export Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import recipesData from '@/data/recipes.json'

export default {
  name: 'MealPlan',
  data() {
    return {
      recipes: recipesData,
      mealPlan: [],
      isGenerating: false,
      isReplacing: null,
      showShoppingList: false,
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
      // Remove duplicates and sort
      return [...new Set(allIngredients)].sort()
    }
  },
  methods: {
    generateNewPlan() {
      this.isGenerating = true
      
      // Simulate loading time for better UX
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
        // Get a different recipe that's not already in the meal plan
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
          // If all recipes are used, just get a random one
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
      // Simulate saving to localStorage or backend
      const planData = {
        mealPlan: this.mealPlan,
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('savedMealPlan', JSON.stringify(planData))
      
      // Show success message (you could use a toast library here)
      alert('Meal plan saved successfully!')
    },
    
    exportPlan() {
      // TODO: Export functionality to be implemented later
      console.log('Export plan functionality will be implemented in future version')
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
  transition: transform 0.2s ease;
}

.summary-stat:hover {
  transform: translateY(-2px);
}

.meal-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: none;
}

.meal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.meal-image {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.meal-card:hover .meal-image {
  transform: scale(1.05);
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
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
}

.btn-success:hover {
  background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
  transform: translateY(-1px);
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
</style>