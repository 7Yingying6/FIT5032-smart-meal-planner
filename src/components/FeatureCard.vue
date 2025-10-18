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
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-normal) var(--ease), box-shadow var(--transition-normal) var(--ease);
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover-lg);
}

.feature-icon-wrapper {
  margin-bottom: 1rem;
}
</style>