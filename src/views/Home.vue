<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section text-dark py-5">
      <!-- hero overlay removed -->
      <div class="container position-relative">
        <div class="row align-items-center justify-content-center">
          <div class="col-12 col-lg-8 mx-auto">
            <div class="hero-content text-center">
              <h1 class="display-3 fw-bold mb-4 hero-title text-center">
                <Icon icon="mdi:leaf" class="me-3 text-success" />
                NutriPlanner
              </h1>
              <div class="executive-summary">
                <p class="lead mb-4 fs-5">
                  Personalized weekly meal plans. Smart recipe recommendations. Automated shopping lists.
                  Plan, cook, and track nutrition in one place--fast and simple.
                </p>
              </div>
              <div class="d-flex gap-3 flex-wrap justify-content-center">
                <router-link to="/recipes" class="btn btn-success btn-lg px-4 py-3">
                  <Icon icon="mdi:book-open-page-variant" class="me-2" />
                  Explore Recipes
                </router-link>
                <router-link to="/meal-plan" class="btn btn-outline-secondary btn-lg px-4 py-3">
                  <Icon icon="mdi:calendar-week" class="me-2" />
                  Plan Meals
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-5 bg-light">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-12">
            <h2 class="display-5 fw-bold mb-4 text-success">Key Features</h2>
            <p class="lead text-muted fs-4">Everything you need for smart meal planning</p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-md-4">
            <FeatureCard
              title="Recipe Discovery"
              description="Browse through curated recipes with detailed ingredients, cooking steps, and nutritional information. Filter by cooking time, dietary preferences, and difficulty level."
              icon="mdi:book-open-page-variant"
            />
          </div>
          
          <div class="col-md-4">
            <FeatureCard
              title="Weekly Planning"
              description="Generate personalized weekly meal plans with smart recipe suggestions. Easily replace meals and adjust portions based on your preferences."
              icon="mdi:calendar-week"
            />
          </div>
          
          <div class="col-md-4">
            <FeatureCard
              title="Responsive Design"
              description="Access your meal plans anywhere with our fully responsive design. Optimized for desktop, tablet, and mobile devices."
              icon="mdi:cellphone"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Top Rated Recipes Section -->
    <section class="top-rated-section py-5">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-12">
            <h2 class="display-5 fw-bold mb-4 text-primary">Top Rated Recipes</h2>
            <p class="lead text-muted fs-4">Discover our most loved recipes by the community</p>
          </div>
        </div>
        
        <div class="row g-4" v-if="topRatedRecipes.length > 0">
          <div 
            v-for="recipe in topRatedRecipes" 
            :key="recipe.id" 
            class="col-12 col-md-6 col-lg-4"
          >
            <div class="recipe-card h-100 shadow-sm" @click="goToRecipe(recipe.id)">
              <div class="recipe-image-container">
                <img 
                  :src="getImageSrc(recipe.image, recipe.title)"
                  :alt="recipe.title"
                  class="recipe-image"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  crossorigin="anonymous"
                  @error="onImgError"
                >
                <div class="recipe-badge">
                  <span class="badge bg-warning text-dark">
                    <Icon icon="mdi:star" class="me-1" />{{ getRating(recipe.id).toFixed(1) }}
                  </span>
                </div>
              </div>
              <div class="card-body p-3">
                <h5 class="card-title mb-2">{{ recipe.title }}</h5>
                <p class="card-text text-muted small mb-3">{{ recipe.description }}</p>
                <div class="recipe-meta d-flex justify-content-between align-items-center">
                  <span class="badge bg-primary">{{ recipe.category }}</span>
                  <small class="text-muted">
                    <Icon icon="mdi:clock-outline" class="me-1" />{{ recipe.cookingTime }}min
                  </small>
                </div>
                <div class="mt-2">
                  <small class="text-muted">
                    <Icon icon="mdi:account-group" class="me-1" />{{ getRatingCount(recipe.id) }} reviews
                  </small>
                </div>
                <div class="d-flex align-items-center mt-1" v-if="hasNutritionistReply(recipe.id)">
                  <span class="badge bg-info">
                    <Icon icon="mdi:account-badge" class="me-1" />Nutritionist replied
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="row">
          <div class="col-12 text-center py-4">
            <p class="text-muted">No rated recipes yet. Be the first to rate our recipes!</p>
            <router-link to="/recipes" class="btn btn-primary">
              <Icon icon="mdi:silverware-fork-knife" class="me-2" />Browse Recipes
            </router-link>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-12 text-center">
            <router-link to="/recipes" class="btn btn-outline-primary btn-lg">
              <Icon icon="mdi:arrow-right" class="me-2" />View All Recipes
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <div class="cta-content p-5 rounded-4">
              <h3 class="display-6 fw-bold text-white mb-4">Ready to Start Your Healthy Journey?</h3>
              <p class="lead text-white mb-4 opacity-90">
                Try NutriPlanner and be part of our early adopters--help us improve a smart meal planning platform for everyone.
              </p>
              <router-link to="/auth" class="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold">
                <Icon icon="mdi:account-plus" class="me-2" />
                Get Started Today
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FeatureCard from '@/components/FeatureCard.vue'
import recipesData from '@/data/recipes.json'
import { getRecipeRatings } from '@/utils/ratingStorage'
import { ImageOptimizer } from '@/utils/imageOptimizer'

// Module-level local image map to avoid this-context issues
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
  name: 'Home',
  components: {
    FeatureCard
  },
  data() {
    return {
      topRatedRecipes: []
    }
  },
  computed: {
    // Get top rated recipes (3-6 items)
    sortedRecipesByRating() {
      return recipesData
        .map(recipe => ({
          ...recipe,
          averageRating: this.getRating(recipe.id),
          ratingCount: this.getRatingCount(recipe.id)
        }))
        .filter(recipe => recipe.ratingCount > 0) // Only show recipes with ratings
        .sort((a, b) => {
          // Sort by average rating first, then by rating count
          if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating
          }
          return b.ratingCount - a.ratingCount
        })
        .slice(0, 6) // Take top 6
    }
  },
  mounted() {
    this.loadTopRatedRecipes()
  },
  methods: {
    loadTopRatedRecipes() {
      this.topRatedRecipes = this.sortedRecipesByRating
    },
    getRating(recipeId) {
      const ratingData = getRecipeRatings(recipeId)
      return ratingData.averageRating || 0
    },
    getRatingCount(recipeId) {
      const ratingData = getRecipeRatings(recipeId)
      return ratingData.totalRatings || 0
    },
    hasNutritionistReply(recipeId) {
      const data = getRecipeRatings(recipeId)
      const ratings = Array.isArray(data.ratings) ? data.ratings : []
      return ratings.some(r => Array.isArray(r.replies) && r.replies.some(rep => (rep.role || '').toLowerCase() === 'nutritionist'))
    },
    goToRecipe(recipeId) {
      this.$router.push(`/recipe/${recipeId}`)
    },
    getImageSrc(url, title) {
      if (title && LOCAL_IMAGE_MAP[title]) return LOCAL_IMAGE_MAP[title]
      if (!url) return ImageOptimizer.getDefaultImage()
      if (typeof url === 'string' && url.startsWith('/images/')) return url
      if (typeof url === 'string' && /\.(jpg|jpeg|png|webp)$/i.test(url) && !/^https?:\/\//i.test(url)) {
        return `/images/${url}`
      }
      
      // Use image optimizer
      return ImageOptimizer.optimizeImageUrl(url, {
        width: 800,
        height: 600,
        quality: 80
      })
    },
    onImgError(e) {
      e.target.src = ImageOptimizer.getDefaultImage()
      e.target.classList.add('image-fallback')
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: #ffffff;
  min-height: 65vh;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 90, 44, 0.35);
  z-index: 1;
}

.container {
  z-index: 2;
}

.min-vh-75 {
  min-height: 75vh;
}

.hero-title {
  /* remove heavy text shadow for a cleaner look */
  text-shadow: none;
}


.executive-summary {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid #fff;
}

.floating-elements {
  position: relative;
  height: 400px;
}

.floating-icon {
  position: absolute;
}

.floating-icon-1 {
  top: 20%;
  left: 10%;
}

.floating-icon-2 {
  top: 60%;
  right: 20%;
}

.floating-icon-3 {
  bottom: 30%;
  left: 20%;
}

.main-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* No animation keyframes for a simpler design */

/* Top Rated Recipes Section */
.top-rated-section {
  background: #f8f9fa;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  /* remove animation/transition */
  transition: none;
  cursor: pointer;
  border: 1px solid #e9ecef;
}

.recipe-card:hover {
  /* disable hover elevation */
  transform: none;
  box-shadow: none !important;
}

.recipe-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: none;
}

.recipe-card:hover .recipe-image {
  transform: none;
}

.recipe-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.recipe-badge .badge {
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
}

.recipe-meta {
  font-size: 0.9rem;
}

.recipe-meta .badge {
  font-size: 0.75rem;
  padding: 0.4rem 0.6rem;
}

.cta-section {
  background: #4a7c59;
}

.cta-content {
  background: rgba(45, 90, 39, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-success {
  background: var(--color-green-500);
  border: none;
}

.btn-success:hover {
  background: var(--color-green-400);
}

.text-success {
  color: var(--color-green-500) !important;
}

.btn-outline-light:hover {
  /* align with outline-secondary change */
  background-color: transparent;
}


@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
    padding: 3rem 0;
  }
  
  .display-3 {
    font-size: 2.5rem;
  }
  
  .floating-elements {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .floating-icon {
    position: absolute;
  }
  
  .floating-icon-1 {
    top: 10%;
    left: 15%;
    font-size: 1.5rem;
  }
  
  .floating-icon-2 {
    top: 15%;
    right: 20%;
    font-size: 1.2rem;
  }
  
  .floating-icon-3 {
    bottom: 20%;
    left: 10%;
    font-size: 1.2rem;
  }
  
  .main-icon {
    position: static;
    transform: none;
  }
  
  .main-icon i {
    font-size: 4rem !important;
  }
  
  .min-vh-75 {
    min-height: 60vh;
  }
  
  .tech-badge {
    font-size: 0.9rem;
  }
  
  .hero-content {
    margin-bottom: 2rem;
  }
}

@media (min-width: 992px) {
  .hero-title {
    white-space: nowrap;
  }
}
</style>