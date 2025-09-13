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
          
          <!-- Authentication Section -->
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/auth" active-class="active">
              <i class="fas fa-sign-in-alt me-1" style="color: #6f42c1;"></i>Login
            </router-link>
          </li>
          
          <!-- User Menu (when logged in) -->
          <li v-if="isLoggedIn" class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="userDropdown" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <i class="fas fa-user-circle me-1" style="color: #6f42c1;"></i>
              {{ currentUser.firstName }}
              <span class="badge bg-secondary ms-1">{{ currentUser.role }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <h6 class="dropdown-header">
                  <i class="fas fa-user me-2"></i>{{ currentUser.firstName }} {{ currentUser.lastName }}
                </h6>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <span class="dropdown-item-text">
                  <small class="text-muted">
                    <i class="fas fa-envelope me-1"></i>{{ currentUser.email }}
                  </small>
                </span>
              </li>
              <li>
                <span class="dropdown-item-text">
                  <small class="text-muted">
                    <i class="fas fa-id-badge me-1"></i>Role: {{ currentUser.role }}
                  </small>
                </span>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item" @click="handleLogout">
                  <i class="fas fa-sign-out-alt me-2 text-danger"></i>Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import userStorage from '@/utils/userStorage.js'

export default {
  name: 'NavBar',
  data() {
    return {
      currentUser: null,
      isLoggedIn: false
    }
  },
  mounted() {
    this.checkAuthStatus()
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    checkAuthStatus() {
      this.currentUser = userStorage.getCurrentUser()
      this.isLoggedIn = userStorage.isLoggedIn()
    },
    
    handleStorageChange() {
      this.checkAuthStatus()
    },
    
    async handleLogout() {
      try {
        // Confirm logout
        if (confirm('Are you sure you want to logout?')) {
          // Clear user session
          userStorage.logout()
          
          // Update component state
          this.currentUser = null
          this.isLoggedIn = false
          
          // Show success message
          alert('You have been logged out successfully.')
          
          // Redirect to home page
          if (this.$route.path !== '/') {
            this.$router.push('/')
          }
        }
      } catch (error) {
        console.error('Logout error:', error)
        alert('An error occurred during logout. Please try again.')
      }
    }
  },
  
  // Watch for route changes to update auth status
  watch: {
    '$route'() {
      this.checkAuthStatus()
    }
  }
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
  background-color: rgba(255, 255, 255, 0.05);
}

.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
}

.dropdown-header {
  color: #495057;
  font-weight: 600;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.7rem;
}

/* Color coding for modules */
.recipes-module { color:  #9BC7AF!important; }
.meal-plan-module { color: #C7EED0 !important; }
.auth-module { color: #9BC7AF !important; }
</style>