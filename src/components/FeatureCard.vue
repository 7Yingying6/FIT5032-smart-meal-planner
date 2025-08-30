<template>
  <div class="feature-card h-100 p-4 rounded-4 shadow-lg border-0">
    <div class="text-center mb-4">
      <div class="feature-icon-wrapper">
        <i :class="['fa-3x text-success', iconClass]"></i>
      </div>
    </div>
    <h4 class="text-center mb-3 fw-bold">{{ title }}</h4>
    <p class="text-muted text-center">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'FeatureCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    iconClass: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.feature-card {
  background: white;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
}

.feature-icon-wrapper {
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon-wrapper {
  transform: scale(1.1);
}
</style>