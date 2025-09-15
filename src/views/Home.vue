<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section text-white py-5">
      <div class="hero-overlay"></div>
      <div class="container position-relative">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="display-3 fw-bold mb-4 hero-title">
                <i class="fas fa-leaf me-3 text-success"></i>
                Smart Meal Planner
              </h1>
              <div class="executive-summary">
                <p class="lead mb-4 fs-5">
                  Designed for busy professionals and health-conscious individuals who struggle with meal planning and grocery shopping. 
                  Our platform provides personalized weekly meal plans with smart recipe recommendations and automated shopping lists. 
                  Core features include recipe discovery, meal planning calendar, nutritional tracking, and ingredient substitution suggestions.
                </p>
              </div>
              <div class="d-flex gap-3 flex-wrap">
                <router-link to="/recipes" class="btn btn-success btn-lg px-4 py-3 rounded-pill">
                  <i class="fas fa-book me-2"></i>
                  Explore Recipes
                </router-link>
                <router-link to="/meal-plan" class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                  <i class="fas fa-calendar-week me-2"></i>
                  Plan Meals
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-image">
              <div class="floating-elements">
                <div class="floating-icon floating-icon-1">
                  <i class="fas fa-apple-alt fa-3x text-success"></i>
                </div>
                <div class="floating-icon floating-icon-2">
                  <i class="fas fa-carrot fa-2x text-warning"></i>
                </div>
                <div class="floating-icon floating-icon-3">
                  <i class="fas fa-fish fa-2x text-info"></i>
                </div>
                <div class="main-icon">
                  <i class="fas fa-utensils fa-6x text-white opacity-75"></i>
                </div>
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
              icon-class="fas fa-book"
            />
          </div>
          
          <div class="col-md-4">
            <FeatureCard
              title="Weekly Planning"
              description="Generate personalized weekly meal plans with smart recipe suggestions. Easily replace meals and adjust portions based on your preferences."
              icon-class="fas fa-calendar-week"
            />
          </div>
          
          <div class="col-md-4">
            <FeatureCard
              title="Responsive Design"
              description="Access your meal plans anywhere with our fully responsive design. Optimized for desktop, tablet, and mobile devices."
              icon-class="fas fa-mobile-alt"
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
                  :src="recipe.image" 
                  :alt="recipe.title"
                  class="recipe-image"
                >
                <div class="recipe-badge">
                  <span class="badge bg-warning text-dark">
                    <i class="fas fa-star me-1"></i>{{ getRating(recipe.id).toFixed(1) }}
                  </span>
                </div>
              </div>
              <div class="card-body p-3">
                <h5 class="card-title mb-2">{{ recipe.title }}</h5>
                <p class="card-text text-muted small mb-3">{{ recipe.description }}</p>
                <div class="recipe-meta d-flex justify-content-between align-items-center">
                  <span class="badge bg-primary">{{ recipe.category }}</span>
                  <small class="text-muted">
                    <i class="fas fa-clock me-1"></i>{{ recipe.cookingTime }}min
                  </small>
                </div>
                <div class="mt-2">
                  <small class="text-muted">
                    <i class="fas fa-users me-1"></i>{{ getRatingCount(recipe.id) }} reviews
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="row">
          <div class="col-12 text-center py-4">
            <p class="text-muted">No rated recipes yet. Be the first to rate our recipes!</p>
            <router-link to="/recipes" class="btn btn-primary">
              <i class="fas fa-utensils me-2"></i>Browse Recipes
            </router-link>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-12 text-center">
            <router-link to="/recipes" class="btn btn-outline-primary btn-lg">
              <i class="fas fa-arrow-right me-2"></i>View All Recipes
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
                Join thousands of users who have transformed their eating habits with our smart meal planning platform.
              </p>
              <router-link to="/auth" class="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold">
                <i class="fas fa-user-plus me-2"></i>
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
    goToRecipe(recipeId) {
      this.$router.push(`/recipe/${recipeId}`)
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: #4a7c59;
  min-height: 100vh;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 90, 39, 0.7);
  z-index: 1;
}

.container {
  z-index: 2;
}

.min-vh-75 {
  min-height: 75vh;
}

.hero-title {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-content {
  /* Remove animation effects */
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

/* Removed animation keyframes for simpler design */

/* Top Rated Recipes Section */
.top-rated-section {
  background: #f8f9fa;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e9ecef;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
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
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
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
  background: #28a745;
  border: none;
}

.btn-success:hover {
  background: #20c997;
}

.btn-outline-light:hover {
  /* Simplified hover effect */
}

.hero-image {
  /* Removed animation */
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
</style>