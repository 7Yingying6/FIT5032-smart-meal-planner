<script setup>
import { onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
import userStorage from '@/utils/userStorage.js'

// Check user authentication status on app startup
onMounted(() => {
  // Force a check of user authentication status
  const currentUser = userStorage.getCurrentUser()
  if (currentUser) {
    console.log('App: User session restored:', currentUser.firstName)
  } else {
    console.log('App: No active user session')
  }
})
</script>

<template>
  <div id="app">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Main Content -->
    <main class="container-fluid px-0">
      <router-view />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style>
/* Global styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

main {
  min-height: calc(100vh - 200px);
}

/* Color coding for modules */
.recipes-module { color: #007bff !important; }
.meal-plan-module { color: #28a745 !important; }
.auth-module { color: #6f42c1 !important; }
</style>
