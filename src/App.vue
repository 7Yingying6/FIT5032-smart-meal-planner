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
    if (import.meta.env.DEV) console.debug('App: User session restored:', currentUser.firstName)
  } else {
    if (import.meta.env.DEV) console.debug('App: No active user session')
  }
})
</script>

<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Main Content -->
    <main id="main-content" class="container-fluid px-0">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style>
/* Design tokens used across the app */
:root {
  --primary-color: #2b6cb0; /* WCAG-compliant deep blue */
  --text-color: #1a202c; /* high-contrast text */
  /* Background gradient */
  --color-bg-start: #f0fdf4; /* light green */
  --color-bg-end: #ecfdf5;   /* mint green */

  /* Primary & accents */
  --color-green-500: #22c55e;
  --color-green-400: #10b981;
  --color-green-deep-1: #064e3b;
  --color-green-deep-2: #045d56;
  --color-blue-500: #0369a1;
  --color-purple-500: #8b5cf6;
  --color-cyan-500: #06b6d4;
  --color-red-600: #dc2626;

  /* Text colors */
  --text-primary: #0f172a;
  --text-secondary: #6b7280;
  --text-hover: #4b5563;

  /* Borders & shadows */
  --border-color: rgba(16,24,40,.08);
  --shadow-sm: 0 3px 10px rgba(16,24,40,.10);
  --shadow-lg: 0 18px 40px rgba(16,24,40,.16), 0 3px 10px rgba(16,24,40,.10);
  --shadow-hover-lg: 0 24px 56px rgba(16,24,40,.20);

  /* Radii & layout */
  --radius-card: 16px;
  --container-max: 1200px;
  --container-padding-desktop: 2rem;
  --container-padding-mobile: 1rem;

  /* Motion & focus */
  --transition-fast: 0.18s;
  --transition-normal: 0.3s;
  --ease: ease;
  --focus-outline-color: var(--color-green-500);
  --focus-outline-offset: 2px;

  /* Bootstrap theme overrides */
  --bs-success: #22c55e;
  --bs-success-rgb: 34, 197, 94;
  --bs-primary: #22c55e;
  --bs-primary-rgb: 34, 197, 94;
  --bs-info: #06b6d4;
  --bs-info-rgb: 6, 182, 212;
  --bs-danger: #dc2626;
  --bs-danger-rgb: 220, 38, 38;
}

/* Global styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-primary);
  line-height: 1.6; /* body line-height */
  background: linear-gradient(180deg, var(--color-bg-start) 0%, var(--color-bg-end) 100%);
}

#app { min-height: 100vh; }

main {
  min-height: calc(100vh - 200px);
}

/* Container width & padding */
main.container-fluid {
  max-width: var(--container-max);
  padding-left: var(--container-padding-desktop);
  padding-right: var(--container-padding-desktop);
  margin: 0 auto;
}

@media (max-width: 768px) {
  main.container-fluid {
    padding-left: var(--container-padding-mobile);
    padding-right: var(--container-padding-mobile);
  }
}

/* Accessibility: focus styles */
*:focus {
  outline: 2px solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* Page transition */
.page-enter-active, .page-leave-active {
  transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
}
.page-enter-from, .page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Cards & feature card */
.card, .feature-card {
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  background: #fff;
  transition: transform var(--transition-normal) var(--ease), box-shadow var(--transition-normal) var(--ease);
}
.card:hover, .feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover-lg);
}

/* Footer link styles */
.footer a, footer a {
  color: var(--text-secondary);
  font-size: 13px;
}
.footer a:hover, footer a:hover {
  color: var(--text-hover);
  text-decoration: underline;
}

/* Module color coding (kept for compatibility) */
.recipes-module { color: #007bff !important; }
.meal-plan-module { color: #28a745 !important; }
.auth-module { color: #6f42c1 !important; }

/* Skip to Content link styles */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus { top: 0; }

/* Buttons contrast */
button { background-color: var(--primary-color); color: #fff; }
</style>
