<template>
  <div class="recipe-detail-page">
    <div v-if="recipe" class="container py-4">
      <!-- Breadcrumbs -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">
              <i class="fas fa-home me-1"></i>Home
            </router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/recipes" class="text-decoration-none">
              <i class="fas fa-utensils me-1"></i>Recipes
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ recipe.title }}</li>
        </ol>
      </nav>

      <!-- Recipe Header -->
      <div class="row mb-4">
        <div class="col-lg-6">
          <div class="recipe-image-container">
            <img 
              :src="recipe.image" 
              :alt="recipe.title"
              class="img-fluid rounded shadow recipe-main-image"
            >
            <div class="image-overlay">
              <span class="badge bg-primary fs-6">{{ recipe.category }}</span>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="recipe-header-info">
            <h1 class="display-5 mb-3">{{ recipe.title }}</h1>
            <p class="lead text-muted mb-4">{{ recipe.description }}</p>
            
            <!-- Recipe Stats -->
            <div class="row g-3 mb-4">
              <div class="col-6 col-md-3">
                <div class="stat-card text-center p-3 bg-light rounded">
                  <i class="fas fa-clock text-primary fs-4 mb-2"></i>
                  <div class="fw-bold">{{ recipe.cookingTime }} min</div>
                  <small class="text-muted">Cook Time</small>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-card text-center p-3 bg-light rounded">
                  <i class="fas fa-users text-success fs-4 mb-2"></i>
                  <div class="fw-bold">{{ recipe.servings }}</div>
                  <small class="text-muted">Servings</small>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-card text-center p-3 bg-light rounded">
                  <i class="fas fa-fire text-danger fs-4 mb-2"></i>
                  <div class="fw-bold">{{ recipe.calories }}</div>
                  <small class="text-muted">Calories</small>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-card text-center p-3 bg-light rounded">
                  <i class="fas fa-chart-line text-warning fs-4 mb-2"></i>
                  <div class="fw-bold">{{ recipe.difficulty }}</div>
                  <small class="text-muted">Difficulty</small>
                </div>
              </div>
            </div>
            
            <!-- Recipe Rating -->
            <div class="recipe-rating mb-4">
              <div class="row g-3">
                <!-- Average Rating -->
                <div class="col-md-4">
                  <div class="rating-card text-center p-3 bg-light rounded">
                    <i class="fas fa-star text-warning fs-4 mb-2"></i>
                    <div class="fw-bold fs-5">{{ currentRating.averageRating.toFixed(1) }}</div>
                    <small class="text-muted">Average Rating</small>
                  </div>
                </div>
                
                <!-- Total Reviews -->
                <div class="col-md-4">
                  <div class="rating-card text-center p-3 bg-light rounded">
                    <i class="fas fa-users text-info fs-4 mb-2"></i>
                    <div class="fw-bold fs-5">{{ currentRating.totalRatings }}</div>
                    <small class="text-muted">Total Reviews</small>
                  </div>
                </div>
                
                <!-- My Rating -->
                <div class="col-md-4">
                  <div class="rating-card text-center p-3 bg-light rounded">
                    <i class="fas fa-user text-primary fs-4 mb-2"></i>
                    <div v-if="currentUser" class="fw-bold fs-5">
                      <span v-if="myRating">
                        {{ myRating.rating }}
                        <i class="fas fa-star text-warning ms-1"></i>
                      </span>
                      <span v-else class="text-muted">Not Rated</span>
                    </div>
                    <div v-else class="fw-bold fs-6">
                      <router-link to="/auth" class="text-decoration-none">Login to Rate</router-link>
                    </div>
                    <small class="text-muted">My Rating</small>
                  </div>
                </div>
              </div>
              
              <!-- Interactive Rating (if logged in) -->
              <div v-if="currentUser" class="mt-3">
                <h6 class="mb-2">Rate this recipe:</h6>
                <StarRating 
                  :recipe-id="recipe.id"
                  :average-rating="currentRating.averageRating"
                  :total-ratings="currentRating.totalRatings"
                  mode="interactive"
                  :show-comment="true"
                  @rating-updated="handleRatingUpdate"
                />
              </div>
            </div>

            
            <!-- Recipe Tags -->
            <div class="recipe-tags mb-4">
              <h6 class="mb-2">Tags:</h6>
              <span 
                v-for="tag in recipe.tags" 
                :key="tag"
                class="badge bg-secondary me-2 mb-1"
              >
                {{ tag }}
              </span>
            </div>
            
            <!-- Action Buttons -->
            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-primary">
                <i class="fas fa-heart me-2"></i>Save Recipe
              </button>
              <button class="btn btn-outline-primary">
                <i class="fas fa-share me-2"></i>Share
              </button>
              <button class="btn btn-outline-secondary">
                <i class="fas fa-print me-2"></i>Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Content -->
      <div class="row">
        <!-- Ingredients Section -->
        <div class="col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-header bg-primary text-white">
              <h4 class="card-title mb-0">
                <i class="fas fa-list-ul me-2"></i>Ingredients
              </h4>
            </div>
            <div class="card-body">
              <ul class="list-unstyled ingredients-list">
                <li 
                  v-for="(ingredient, index) in recipe.ingredients" 
                  :key="index"
                  class="ingredient-item d-flex align-items-center mb-2 p-2 rounded"
                >
                  <input 
                    type="checkbox" 
                    :id="`ingredient-${index}`"
                    class="form-check-input me-3"
                  >
                  <label 
                    :for="`ingredient-${index}`"
                    class="form-check-label flex-grow-1"
                  >
                    {{ ingredient }}
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Instructions Section -->
        <div class="col-lg-8 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-header bg-success text-white">
              <h4 class="card-title mb-0">
                <i class="fas fa-clipboard-list me-2"></i>Instructions
              </h4>
            </div>
            <div class="card-body">
              <ol class="instructions-list">
                <li 
                  v-for="(instruction, index) in recipe.instructions" 
                  :key="index"
                  class="instruction-item mb-3 p-3 bg-light rounded"
                >
                  <div class="d-flex align-items-start">
                    <span class="step-number badge bg-success me-3 mt-1">
                      {{ index + 1 }}
                    </span>
                    <div class="instruction-text flex-grow-1">
                      {{ instruction }}
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- User Reviews Section -->
      <div class="row mt-4" v-if="userReviews.length > 0">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-info text-white">
              <h4 class="card-title mb-0">
                <i class="fas fa-comments me-2"></i>User Reviews ({{ userReviews.length }})
              </h4>
            </div>
            <div class="card-body">
              <div class="reviews-container" style="max-height: 400px; overflow-y: auto;">
                <div 
                  v-for="review in userReviews" 
                  :key="review.userId + review.timestamp"
                  class="review-item mb-3 p-3 border rounded"
                >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="d-flex align-items-center">
                      <div class="user-avatar me-2">
                        <i class="fas fa-user-circle fa-2x text-muted"></i>
                      </div>
                      <div>
                        <div class="fw-bold">User {{ review.userId.slice(-4) }}</div>
                        <div class="small text-muted">{{ formatDate(review.timestamp) }}</div>
                      </div>
                    </div>
                    <div class="rating-stars">
                      <StarRating 
                        :recipe-id="recipe.id"
                        :average-rating="review.rating"
                        :total-ratings="1"
                        mode="display"
                      />
                    </div>
                  </div>
                  <div v-if="review.comment" class="review-comment">
                    <p class="mb-0">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alternatives Section -->
      <div class="row mt-4" v-if="recipe.alternatives">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-warning text-dark">
              <h4 class="card-title mb-0">
                <i class="fas fa-exchange-alt me-2"></i>Ingredient Alternatives
              </h4>
              <small class="text-muted">Substitute ingredients based on dietary preferences or availability</small>
            </div>
            <div class="card-body">
              <div class="row">
                <div 
                  v-for="(alternative, ingredient) in recipe.alternatives" 
                  :key="ingredient"
                  class="col-md-6 col-lg-4 mb-3"
                >
                  <div class="alternative-item p-3 border rounded">
                    <div class="fw-bold text-primary mb-1">{{ ingredient }}</div>
                    <div class="text-muted">
                      <i class="fas fa-arrow-right me-2"></i>{{ alternative }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <router-link to="/recipes" class="btn btn-outline-secondary">
              <i class="fas fa-arrow-left me-2"></i>Back to Recipes
            </router-link>
            <div class="d-flex gap-2">
              <button 
                @click="goToPreviousRecipe" 
                :disabled="!previousRecipe"
                class="btn btn-outline-primary"
              >
                <i class="fas fa-chevron-left me-2"></i>Previous
              </button>
              <button 
                @click="goToNextRecipe" 
                :disabled="!nextRecipe"
                class="btn btn-outline-primary"
              >
                Next<i class="fas fa-chevron-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Not Found -->
    <div v-else class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <div class="card">
            <div class="card-body py-5">
              <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
              <h3 class="text-muted">Recipe Not Found</h3>
              <p class="text-muted mb-4">The recipe you're looking for doesn't exist or has been removed.</p>
              <router-link to="/recipes" class="btn btn-primary">
                <i class="fas fa-arrow-left me-2"></i>Back to Recipes
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import recipesData from '@/data/recipes.json'
import StarRating from '@/components/StarRating.vue'
import { getRecipeRatings, getUserRating } from '@/utils/ratingStorage'
import userStorage from '@/utils/userStorage'

export default {
  name: 'RecipeDetail',
  components: {
    StarRating
  },
  data() {
    return {
      recipes: recipesData,
      currentRating: {
        averageRating: 0,
        totalRatings: 0
      },
      userReviews: [],
      currentUser: null,
      myRating: null
    }
  },
  computed: {
    recipe() {
      const id = parseInt(this.$route.params.id)
      return this.recipes.find(recipe => recipe.id === id)
    },
    currentIndex() {
      if (!this.recipe) return -1
      return this.recipes.findIndex(recipe => recipe.id === this.recipe.id)
    },
    previousRecipe() {
      if (this.currentIndex <= 0) return null
      return this.recipes[this.currentIndex - 1]
    },
    nextRecipe() {
      if (this.currentIndex >= this.recipes.length - 1) return null
      return this.recipes[this.currentIndex + 1]
    }
  },
  mounted() {
    this.loadRatingData()
  },
  methods: {
    goToPreviousRecipe() {
      if (this.previousRecipe) {
        this.$router.push(`/recipe/${this.previousRecipe.id}`)
      }
    },
    goToNextRecipe() {
      if (this.nextRecipe) {
        this.$router.push(`/recipe/${this.nextRecipe.id}`)
      }
    },
    loadRatingData() {
      if (this.recipe) {
        const ratingData = getRecipeRatings(this.recipe.id)
        this.currentRating = {
          averageRating: ratingData.averageRating || this.recipe.averageRating || 0,
          totalRatings: ratingData.totalRatings || this.recipe.totalRatings || 0
        }
        this.userReviews = ratingData.ratings || []
        
        // Get current user
        this.currentUser = userStorage.getCurrentUser()
        
        // Get user's rating for this recipe
        if (this.currentUser) {
          this.myRating = getUserRating(this.recipe.id, this.currentUser.id)
        } else {
          this.myRating = null
        }
      }
    },
    handleRatingUpdate(data) {
      // Reload rating data after user submits/updates rating
      this.loadRatingData()
      
      // Show success message
      if (data.removed) {
        this.showMessage('Rating removed successfully!', 'success')
      } else {
        this.showMessage('Thank you for your rating!', 'success')
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    showMessage(message, type = 'info') {
      // Simple message display - could be enhanced with toast notifications
      console.log(`${type.toUpperCase()}: ${message}`)
    }
  },
  watch: {
    '$route'() {
      // Scroll to top when route changes
      window.scrollTo(0, 0)
      // Reload rating data for new recipe
      this.loadRatingData()
    },
    recipe() {
      // Reload rating data when recipe changes
      this.loadRatingData()
    }
  }
}
</script>

<style scoped>
.recipe-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.recipe-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
}

.recipe-main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.stat-card {
  border: 1px solid #e9ecef;
}

.stat-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rating-card {
  border: 1px solid #e9ecef;
  transition: box-shadow 0.2s ease;
}

.rating-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Ingredients section split layout */
.ingredients-list {
  max-height: 400px;
  overflow-y: auto;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid transparent;
}

.ingredient-item .qty-badge {
  min-width: 64px;
  padding: 0.35rem 0.5rem;
  border-radius: 999px;
  font-weight: 600;
  text-align: center;
  color: var(--text-primary);
  background: linear-gradient(180deg, var(--color-bg-start), #d9fbe8);
  box-shadow: var(--shadow-sm);
}

.ingredient-item:hover {
  background-color: #f8f9fa !important;
  border-color: #dee2e6;
}

.ingredient-item input:checked + label {
  text-decoration: line-through;
  color: #6c757d;
}

/* Instructions list: custom numbered bubble */
.instructions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instruction-item {
  border-left: 4px solid var(--color-green-500);
  transition: transform var(--transition-fast) var(--ease);
}

.instruction-item:hover {
  background-color: #f8f9fa !important;
  transform: scale(1.01);
}

.step-number {
  min-width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 999px;
  background: linear-gradient(180deg, #91dc95 0%, #1e5a2c 100%);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

/* Tag/Chip styling */
.recipe-tags .badge {
  border-radius: 999px;
  background: #f4f8f7;
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 600px) {
  .ingredient-item {
    flex-wrap: wrap;
  }
  .ingredient-item .qty-badge {
    min-width: 48px;
    margin-bottom: 0.25rem;
  }
}
</style>