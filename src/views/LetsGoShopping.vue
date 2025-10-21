<template>
  <section class="py-5">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12 text-center">
          <h1 class="display-5 fw-bold">Lets Go Shopping</h1>
          <p class="text-secondary">Build and manage your weekly shopping list in one place.</p>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <InteractiveShoppingTable />
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 col-lg-10 mx-auto">
          <MapView />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import InteractiveShoppingTable from '@/components/InteractiveShoppingTable.vue'
import MapView from '@/components/MapView.vue'

export default {
  name: 'LetsGoShopping',
  components: { InteractiveShoppingTable, MapView }
}
</script>

<style scoped>
section { background: var(--page-bg, #f8f9fa); }
</style>