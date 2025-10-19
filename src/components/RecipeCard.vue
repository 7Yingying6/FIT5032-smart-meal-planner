<template>
  <div class="card h-100 shadow-sm recipe-card">
    <div class="position-relative">
      <img 
        :src="getImageSrc(recipe.image, recipe.title)" 
        :alt="recipe.title"
        class="card-img-top recipe-image"
        loading="lazy"
        referrerpolicy="no-referrer"
        crossorigin="anonymous"
        @error="onImgError"
      >
      <div class="position-absolute top-0 end-0 m-2">
        <span class="badge bg-primary">{{ recipe.category }}</span>
      </div>
      <div class="position-absolute bottom-0 start-0 m-2">
        <span class="badge bg-dark">
          <Icon icon="mdi:clock-outline" class="me-1" />{{ recipe.cookingTime }}min
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
          <!-- Removed servings column -->
          <!--
          <div class="col-4">
            <small class="text-muted">
              <Icon icon="mdi:account-group" /><br>
              {{ recipe.servings }} servings
            </small>
          </div>
          -->
          <div class="col-6">
            <small class="text-muted">
              <Icon icon="mdi:fire" /><br>
              {{ recipe.calories }} cal
            </small>
          </div>
          <div class="col-6">
            <small class="text-muted">
              <Icon icon="mdi:chart-line" /><br>
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
          <Icon icon="mdi:eye" class="me-2" />View Recipe
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from './StarRating.vue'
// define local image map at module scope to avoid this.* access issues
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
  name: 'RecipeCard',
  components: {
    StarRating
  },
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  methods: {
    // Local images map for fallback
    LOCAL_IMAGE_MAP: Object.freeze({
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
    }),
    getImageSrc(url, title) {
      // Prefer local mapped image if available
      if (title && LOCAL_IMAGE_MAP[title]) {
        return LOCAL_IMAGE_MAP[title]
      }
      if (!url) return this.getDefaultSvg()
      // If already local absolute path
      if (typeof url === 'string' && url.startsWith('/images/')) return url
      // If looks like a local filename (no scheme, has image extension), prefix /images/
      if (typeof url === 'string' && /\.(jpg|jpeg|png|webp)$/i.test(url) && !/^https?:\/\//i.test(url)) {
        return `/images/${url}`
      }
      try {
        const u = new URL(url)
        if (u.hostname.includes('images.unsplash.com')) {
          if (!u.searchParams.has('auto')) u.searchParams.set('auto', 'format')
          if (!u.searchParams.has('fit')) u.searchParams.set('fit', 'crop')
          if (!u.searchParams.has('w')) u.searchParams.set('w', '800')
          if (!u.searchParams.has('q')) u.searchParams.set('q', '60')
          return u.toString()
        }
        return url
      } catch (e) {
        // If not a valid absolute URL, return as is (could be relative)
        return url
      }
    },
    onImgError(e) {
      e.target.src = this.getDefaultSvg()
      e.target.classList.add('image-fallback')
    },
    getDefaultSvg() {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'>
        <rect width='800' height='450' fill='#f0f0f0'/>
        <g fill='#bbb'>
          <circle cx='400' cy='200' r='60'/>
          <rect x='300' y='280' width='200' height='20' rx='10'/>
        </g>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='#888'>Image unavailable</text>
      </svg>`
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
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
  transform: translateY(-1px);
}
</style>