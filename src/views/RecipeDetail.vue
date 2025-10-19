<template>
  <div class="recipe-detail-page">
    <div v-if="recipe" class="container py-4">
      <!-- Breadcrumbs -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">
              <Icon icon="mdi:home" class="me-1" />Home
            </router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/recipes" class="text-decoration-none">
              <Icon icon="mdi:silverware-fork-knife" class="me-1" />Recipes
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
              :src="getImageSrc(recipe.image, recipe.title)" 
              :alt="recipe.title"
              class="recipe-main-image"
              loading="lazy"
              referrerpolicy="no-referrer"
              crossorigin="anonymous"
              @error="onImgError"
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
              <div class="col-6 col-md-4">
                <div class="stat-card text-center p-3 bg-light rounded">
                  <Icon icon="mdi:clock-outline" class="text-primary fs-4 mb-2" />
                  <div class="fw-bold">{{ recipe.cookingTime }} min</div>
                  <small class="text-muted">Cook Time</small>
                </div>
              </div>
              <!-- Removed Servings card -->
              <!--
              <div class="col-6 col-md-3">
                <div class="stat-card text-center p-3 bg-light rounded">
                  <Icon icon="mdi:account-group" class="text-info fs-4 mb-2" />
                  <div class="fw-bold">{{ recipe.servings }}</div>
                  <small class="text-muted">Servings</small>
                </div>
              </div>
              -->
              <div class="col-6 col-md-4">
                <div class="stat-card text-center p-3 bg-light rounded">
                  <Icon icon="mdi:fire" class="text-danger fs-4 mb-2" />
                  <div class="fw-bold">{{ recipe.calories }}</div>
                  <small class="text-muted">Calories</small>
                </div>
              </div>
              <div class="col-6 col-md-4">
                <div class="stat-card text-center p-3 bg-light rounded">
                  <Icon icon="mdi:chart-line" class="text-warning fs-4 mb-2" />
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
                    <Icon icon="mdi:star" class="text-warning fs-4 mb-2" />
                    <div class="fw-bold fs-5">{{ currentRating.averageRating.toFixed(1) }}</div>
                    <small class="text-muted">Average Rating</small>
                  </div>
                </div>
                
                <!-- Total Reviews -->
                <div class="col-md-4">
                  <div class="rating-card text-center p-3 bg-light rounded">
                    <Icon icon="mdi:account-group" class="text-info fs-4 mb-2" />
                    <div class="fw-bold fs-5">{{ currentRating.totalRatings }}</div>
                    <small class="text-muted">Total Reviews</small>
                  </div>
                </div>
                
                <!-- My Rating -->
                <div class="col-md-4">
                  <div class="rating-card text-center p-3 bg-light rounded">
                    <Icon icon="mdi:account" class="text-primary fs-4 mb-2" />
                    <div v-if="currentUser" class="fw-bold fs-5">
                      <span v-if="myRating">
                        {{ myRating.rating }}
                        <Icon icon="mdi:star" class="text-warning fs-4 mb-2" />
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
                <Icon icon="mdi:heart" class="text-warning ms-1" />Save Recipe
              </button>
              <button class="btn btn-outline-primary">
                <Icon icon="mdi:share-variant" class="me-2" />Share
              </button>
              <button class="btn btn-outline-secondary">
                <Icon icon="mdi:printer" class="me-2" />Print
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
                <Icon icon="mdi:format-list-bulleted" class="me-2" />Ingredients
              </h4>
            </div>
            <div class="card-body">
              <ul class="list-unstyled ingredients-list" v-if="recipe && recipe.ingredients && recipe.ingredients.length">
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
              <p v-if="recipe && (!recipe.ingredients || recipe.ingredients.length === 0)" class="text-muted px-3 py-2 mb-0">No ingredients provided for this recipe.</p>
            </div>
          </div>
        </div>
        
        <!-- Instructions Section -->
        <div class="col-lg-8 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-header bg-success text-white">
              <h4 class="card-title mb-0">
                <Icon icon="mdi:clipboard-list" class="me-2" />Instructions
              </h4>
            </div>
            <div class="card-body">
              <ol class="instructions-list" v-if="recipe && recipe.instructions && recipe.instructions.length">
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
              <p v-if="recipe && (!recipe.instructions || recipe.instructions.length === 0)" class="text-muted px-3 py-2 mb-0">No instructions provided for this recipe.</p>
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
                <Icon icon="mdi:comment-text" class="me-2" />User Reviews ({{ userReviews.length }})
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
                        <Icon icon="mdi:account-circle" class="fs-1 text-muted" />
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
                <Icon icon="mdi:swap-horizontal" class="me-2" />Ingredient Alternatives
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
                      <Icon icon="mdi:arrow-right" class="me-2" />{{ alternative }}
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
              <Icon icon="mdi:arrow-left" class="me-2" />Back to Recipes
            </router-link>
            <div class="d-flex gap-2">
              <button 
                @click="goToPreviousRecipe" 
                :disabled="!previousRecipe"
                class="btn btn-outline-primary"
              >
                <Icon icon="mdi:chevron-left" class="me-2" />Previous
              </button>
              <button 
                @click="goToNextRecipe" 
                :disabled="!nextRecipe"
                class="btn btn-outline-primary"
              >
                Next<Icon icon="mdi:chevron-right" class="ms-2" />
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
              <Icon icon="mdi:alert" class="text-warning mb-3" style="font-size: 3rem" />
              <h3 class="text-muted">Recipe Not Found</h3>
              <p class="text-muted mb-4">The recipe you're looking for doesn't exist or has been removed.</p>
              <router-link to="/recipes" class="btn btn-primary">
                <Icon icon="mdi:arrow-left" class="me-2" />Back to Recipes
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import recipesData from '@/data/recipes.json'
import StarRating from '@/components/StarRating.vue'
import { getRecipeRatings, getUserRating } from '@/utils/ratingStorage'
import userStorage from '@/utils/userStorage'
// Firestore imports
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

// Local image map at module scope to avoid this-context issues
const LOCAL_IMAGE_MAP = Object.freeze({
  'Avocado Egg Toast': '/images/Avocado Egg Toast.jpg',
  'Banana Pancakes': '/images/Banana Pancakes.jpg',
  'Beef Gyudon Rice Bowl': '/images/Beef Gyudon Rice Bowl.webp',
  'Beef Steak with Garlic Butter': '/images/Beef Steak with Garlic Butter.jpg',
  'Berry Overnight Oats': '/images/Berry Overnight Oats.jpg',
  'Chicken Alfredo Pasta': '/images/Chicken Alfredo Pasta.jpg',
  'Chocolate Mousse': '/images/Chocolate Mousse.jpg',
  'Chocolate Mug Cake': '/images/Chocolate Mug Cake.jpg',
  'Creamy Mushroom Toast': '/images/Creamy Mushroom Toast.jpg',
  'Garlic Butter Shrimp Noodles': '/images/Garlic Butter Shrimp Noodles.jpg.png',
  'Grilled Salmon with Asparagus': '/images/Grilled Salmon with Asparagus.jpg',
  'Ham & Cheese Sandwich': '/images/Ham & Cheese Sandwich.jpg',
  'Instant Ramen Upgrade': '/images/Instant Ramen Upgrade.jpg',
  'Japanese Curry Rice': '/images/Japanese Curry Rice.jpg',
  'Kimchi Fried Rice': '/images/Kimchi Fried Rice.jpeg',
  'Mango Pudding': '/images/Mango Pudding.jpeg',
  'Matcha Cheesecake': '/images/Matcha Cheesecake.webp',
  'Roasted Chicken Drumsticks': '/images/Roasted Chicken Drumsticks.png.webp',
  'Scrambled Eggs with Tomato': '/images/Scrambled Eggs with Tomato.jpg',
  'Shrimp Fried Rice': '/images/Shrimp Fried Rice.jpg',
  'Sichuan Mala Hotpot Bowl': '/images/Sichuan Mala Hotpot Bowl.jpg',
  'Spaghetti Bolognese': '/images/Spaghetti Bolognese.jpg',
  'Stir-fried udon noodles': '/images/Stir-fried udon noodles.jpg',
  'Teriyaki Chicken Rice Bowl': '/images/Teriyaki Chicken Rice Bowl.jpg',
  'Tiramisu Cup': '/images/Tiramisu Cup.jpg',
  'Tuna Sandwich': '/images/Tuna Sandwich.jpg.webp',
  'Vegetable Cheese Omelette': '/images/Vegetable Cheese Omelette.jpg',
  'Vegetable Egg Wrap': '/images/Vegetable Egg Wrap.jpg',
  'Vegetable Stir-Fry Bowl': '/images/Vegetable Stir-Fry Bowl.jpg',
  'Yogurt Parfait Cup': '/images/Yogurt Parfait Cup.jpg'
})

export default {
  name: 'RecipeDetail',
  components: {
    StarRating
  },
  data() {
    return {
      recipes: [],
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
      const id = Number(this.$route.params.id)
      return this.recipes.find(r => Number(r.id) === id)
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
    // Load recipes from Firestore first, then rating data
    this.loadRecipes().then(() => {
      this.loadRatingData()
    })
  },
  methods: {
    // Load recipes from Firestore and normalize fields
    async loadRecipes() {
      try {
        const snapshot = await getDocs(collection(db, 'recipes'))
        this.recipes = snapshot.docs.map(doc => {
          const data = doc.data() || {}
          return {
            id: data.id != null ? data.id : doc.id,
            title: data.title || data.name || 'Untitled Recipe',
            description: data.description || '',
            image: data.image || '',
            category: data.category || 'General',
            cookingTime: data.cookingTime || 0,
            difficulty: data.difficulty || 'Easy',
            // servings removed from UI; keep optional for data compatibility
            servings: data.servings,
            calories: data.calories || 0,
            tags: Array.isArray(data.tags) ? data.tags : [],
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
            instructions: Array.isArray(data.instructions) ? data.instructions : [],
            alternatives: data.alternatives || null,
            averageRating: typeof data.averageRating === 'number' ? data.averageRating : 0,
            totalRatings: typeof data.totalRatings === 'number' ? data.totalRatings : 0
          }
        })
      } catch (e) {
        console.error('Failed to load recipes from Firestore', e)
      }
    },
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
        this.currentUser = userStorage.getCurrentUser()
        if (this.currentUser) {
          this.myRating = getUserRating(this.recipe.id, this.currentUser.id)
        } else {
          this.myRating = null
        }
      }
    },
    handleRatingUpdate(data) {
      this.loadRatingData()
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
      console.log(`${type.toUpperCase()}: ${message}`)
    },
    getImageSrc(url, title) {
      if (title && LOCAL_IMAGE_MAP[title]) return LOCAL_IMAGE_MAP[title]
      if (!url) return this.getDefaultSvg()
      if (typeof url === 'string' && url.startsWith('/images/')) return url
      if (typeof url === 'string' && /\.(jpg|jpeg|png|webp)$/i.test(url) && !/^https?:\/\//i.test(url)) {
        return `/images/${url}`
      }
      try {
        const u = new URL(url)
        if (u.hostname.includes('images.unsplash.com')) {
          if (!u.searchParams.has('auto')) u.searchParams.set('auto', 'format')
          if (!u.searchParams.has('fit')) u.searchParams.set('fit', 'crop')
          if (!u.searchParams.has('w')) u.searchParams.set('w', '1200')
          if (!u.searchParams.has('q')) u.searchParams.set('q', '60')
          return u.toString()
        }
        return url
      } catch (e) {
        return url
      }
    },
    onImgError(e) {
      e.target.src = this.getDefaultSvg()
      e.target.classList.add('image-fallback')
    },
    getDefaultSvg() {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='675' viewBox='0 0 1200 675'>
        <rect width='1200' height='675' fill='#f0f0f0'/>
        <g fill='#bbb'>
          <circle cx='600' cy='300' r='110'/>
          <rect x='500' y='430' width='200' height='26' rx='13'/>
        </g>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='#888'>Image unavailable</text>
      </svg>`
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
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