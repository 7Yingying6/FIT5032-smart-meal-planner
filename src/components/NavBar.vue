<template>
  <nav class="navbar navbar-expand-lg navbar-dark" :style="{ backgroundColor: '#064e3b' }" role="navigation" aria-label="Main navigation">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <Icon icon="mdi:silverware-fork-knife" class="me-2" />
        NutriPlanner
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
              <Icon icon="mdi:home" class="me-1" />Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/recipes" active-class="active">
              <Icon icon="mdi:book-open-page-variant" class="me-1" />Recipes
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/meal-plan" active-class="active">
              <Icon icon="mdi:calendar-week" class="me-1" />Meal Plan
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/shopping" active-class="active">
              <Icon icon="mdi:cart-outline" class="me-1" />Lets Go Shopping
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/disclaimer" active-class="active">
              <Icon icon="mdi:information-outline" class="me-1" />Disclaimer
            </router-link>
          </li>
          
          <!-- Authentication Section -->
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/auth" active-class="active">
              <Icon icon="mdi:login" class="me-1" />Login
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
              <Icon icon="mdi:account-circle" class="me-1" style="color: #6f42c1;" />
              {{ currentUser.firstName }}
              <span class="badge bg-secondary ms-1">{{ currentUser.role }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <h6 class="dropdown-header">
                  <Icon icon="mdi:account" class="me-2" />{{ currentUser.firstName }} {{ currentUser.lastName }}
                </h6>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <span class="dropdown-item-text">
                  <small class="text-muted">
                    <Icon icon="mdi:email" class="me-1" />{{ currentUser.email }}
                  </small>
                </span>
              </li>
              <li>
                <span class="dropdown-item-text">
                  <small class="text-muted">
                    <Icon icon="mdi:card-account-details-outline" class="me-1" />Role: {{ currentUser.role }}
                  </small>
                </span>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item" @click="handleLogout">
                  <Icon icon="mdi:logout" class="me-2 text-danger" />Logout
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
  font-weight: 800;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.96);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
}
.navbar-dark .navbar-nav .nav-link i {
  color: inherit;
}

.nav-link.active {
  font-weight: 700;
  color: #ffffff !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.35);
}

.navbar-dark .navbar-nav .nav-link:hover,
.navbar-dark .navbar-nav .nav-link:focus {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.08);
}

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.35);
}
.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.35);
}

.nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.08);
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
  background-color: rgba(34, 197, 94, 0.08);
}

.badge {
  font-size: 0.7rem;
}

/* Remove old module color overrides to use new global palette */
.recipes-module { color:  var(--color-green-500) !important; }
.meal-plan-module { color: var(--color-green-400) !important; }
.auth-module { color: var(--color-green-500) !important; }
</style>