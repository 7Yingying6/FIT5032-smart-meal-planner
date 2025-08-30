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
    <!-- Card Header -->
    <div 
      v-if="$slots.header || title"
      :class="[
        'card-header',
        headerClass
      ]"
    >
      <slot name="header">
        <h4 v-if="title" class="card-title mb-0">
          <i v-if="icon" :class="['me-2', icon]"></i>
          {{ title }}
        </h4>
        <small v-if="subtitle" class="text-muted">{{ subtitle }}</small>
      </slot>
    </div>

    <!-- Card Body -->
    <div 
      :class="[
        'card-body',
        bodyClass,
        { 'd-flex flex-column': fullHeight }
      ]"
    >
      <slot></slot>
    </div>

    <!-- Card Footer -->
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
export default {
  name: 'BaseCard',
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
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}
</style>