<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #9BC7AF;">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <i class="fas fa-utensils me-2"></i>
        Smart Meal Planner
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" active-class="active">
              <i class="fas fa-home me-1"></i>Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/recipes" active-class="active">
              <i class="fas fa-book me-1" style="color: #007bff;"></i>Recipes
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/meal-plan" active-class="active">
              <i class="fas fa-calendar-week me-1" style="color: #28a745;"></i>Meal Plan
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/auth" active-class="active">
              <i class="fas fa-user me-1" style="color: #6f42c1;"></i>Auth
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link.active {
  font-weight: bold;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
}

/* Color coding for modules */
.recipes-module { color:  #9BC7AF!important; }
.meal-plan-module { color: #C7EED0 !important; }
.auth-module { color: #9BC7AF !important; }
</style>