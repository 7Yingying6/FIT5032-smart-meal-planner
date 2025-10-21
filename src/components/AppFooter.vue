<template>
  <footer class="app-footer text-center py-4 mt-5">
    <div class="container">
      <nav class="footer-links d-flex justify-content-center flex-wrap gap-3" aria-label="Footer links">
        <!-- <a href="#" class="footer-link">Privacy Policy</a> -->
        <!-- <a href="#" class="footer-link">Terms</a> -->
        <router-link to="/disclaimer" class="footer-link">Disclaimer</router-link>
        <a href="#" class="footer-link">Contact</a>
      </nav>
      <div class="footer-copy mt-2 text-secondary">&copy; 2025 NutriPlanner</div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  background: transparent;
}

.footer-link {
  color: var(--text-secondary);
  font-size: 13px;
  text-decoration: none;
}

.footer-link:hover {
  color: var(--text-hover);
  text-decoration: underline;
}

.footer-link:focus {
  outline: 2px solid var(--focus-outline-color);
  outline-offset: var(--focus-outline-offset);
  border-radius: 6px;
}
</style>