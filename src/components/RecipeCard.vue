<template>
  <div class="card h-100 shadow-sm recipe-card">
    <div class="position-relative">
      <img 
        :src="recipe.image" 
        :alt="recipe.title"
        class="card-img-top recipe-image"
        loading="lazy"
      >
      <div class="position-absolute top-0 end-0 m-2">
        <span class="badge bg-primary">{{ recipe.category }}</span>
      </div>
      <div class="position-absolute bottom-0 start-0 m-2">
        <span class="badge bg-dark">
          <i class="fas fa-clock me-1"></i>{{ recipe.cookingTime }}min
        </span>
      </div>
    </div>
    
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text text-muted flex-grow-1">{{ recipe.description }}</p>
      
      <!-- Rating Display -->
      <div class="mb-2">
        <StarRating 
          :recipe-id="recipe.id"
          :average-rating="recipe.averageRating || 0"
          :total-ratings="recipe.totalRatings || 0"
          mode="display"
        />
      </div>
      
      <div class="recipe-meta mb-3">
        <div class="row text-center">
          <div class="col-4">
            <small class="text-muted">
              <i class="fas fa-users"></i><br>
              {{ recipe.servings }} servings
            </small>
          </div>
          <div class="col-4">
            <small class="text-muted">
              <i class="fas fa-fire"></i><br>
              {{ recipe.calories }} cal
            </small>
          </div>
          <div class="col-4">
            <small class="text-muted">
              <i class="fas fa-chart-line"></i><br>
              {{ recipe.difficulty }}
            </small>
          </div>
        </div>
      </div>
      
      <div class="recipe-tags mb-3">
        <span 
          v-for="tag in recipe.tags.slice(0, 3)" 
          :key="tag"
          class="badge bg-light text-dark me-1 mb-1"
        >
          {{ tag }}
        </span>
        <span 
          v-if="recipe.tags.length > 3"
          class="badge bg-secondary me-1 mb-1"
        >
          +{{ recipe.tags.length - 3 }} more
        </span>
      </div>
      
      <div class="mt-auto">
        <router-link 
          :to="`/recipe/${recipe.id}`" 
          class="btn btn-primary w-100"
        >
          <i class="fas fa-eye me-2"></i>View Recipe
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from './StarRating.vue'

export default {
  name: 'RecipeCard',
  components: {
    StarRating
  },
  props: {
    recipe: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.recipe-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.recipe-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.recipe-image {
  height: 200px;
  object-fit: cover;
}

.recipe-meta {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 0.75rem 0;
}

.recipe-tags .badge {
  font-size: 0.7rem;
}

.btn-primary:hover {
  /* Simplified button hover effect */
}
</style>