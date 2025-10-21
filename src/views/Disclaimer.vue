<template>
  <section class="py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="p-4 p-md-5 bg-white border rounded-4 shadow-sm">
            <h1 class="display-6 fw-bold mb-3">Disclaimer</h1>
            <p class="lead text-secondary mb-4">
              This website is a student project created for educational purposes only. The content and features
              are provided to demonstrate and practice web development skills.
            </p>
            <ul class="list-unstyled text-secondary mb-4">
              <li class="mb-2">- Information here is not professional nutrition or medical advice.</li>
              <li class="mb-2">- Some data may be simplified, incomplete, or simulated for learning.</li>
              <li class="mb-2">- Do not rely solely on this platform for health decisions.</li>
              <li class="mb-2">- Feedback is welcome to help improve the project.</li>
            </ul>
            <div class="d-flex gap-2">
              <router-link to="/" class="btn btn-outline-secondary">Back to Home</router-link>
              <router-link to="/auth" class="btn btn-success">Try NutriPlanner</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Disclaimer'
}
</script>

<style scoped>
section { background: var(--page-bg, #f8f9fa); }
</style>