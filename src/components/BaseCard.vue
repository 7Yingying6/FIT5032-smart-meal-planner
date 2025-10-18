<template>
  <div 
    :class="[
      'card',
      {
        'h-100': fullHeight,
        'shadow-sm': shadow === 'sm',
        'shadow': shadow === 'default',
        'shadow-lg': shadow === 'lg',
        'border-0': !border
      },
      customClass
    ]"
  >
    <!-- Card header -->
    <div 
      v-if="$slots.header || title"
      :class="[
        'card-header',
        headerClass
      ]"
    >
      <slot name="header">
        <h4 v-if="title" class="card-title mb-0">
          <Icon v-if="icon" :icon="icon" class="me-2" />
          {{ title }}
        </h4>
        <small v-if="subtitle" class="text-muted">{{ subtitle }}</small>
      </slot>
    </div>

    <!-- Card body -->
    <div 
      :class="[
        'card-body',
        bodyClass,
        { 'd-flex flex-column': fullHeight }
      ]"
    >
      <slot></slot>
    </div>

    <!-- Card footer -->
    <div 
      v-if="$slots.footer"
      :class="[
        'card-footer',
        footerClass
      ]"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'
export default {
  name: 'BaseCard',
  components: { Icon },
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    fullHeight: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: String,
      default: 'default',
      validator: value => ['none', 'sm', 'default', 'lg'].includes(value)
    },
    border: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    headerClass: {
      type: String,
      default: ''
    },
    bodyClass: {
      type: String,
      default: ''
    },
    footerClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: transform var(--transition-normal) var(--ease), box-shadow var(--transition-normal) var(--ease);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover-lg);
}
</style>