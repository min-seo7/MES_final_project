<script setup>
import { ref } from 'vue'
import RepairSearchWidget from '@/components/equipment/repair/repairSearchWidget.vue'
import RepairListWidget from '@/components/equipment/repair/repairListWidget.vue'

const params = ref({})

function handleSubmit(q) {
  params.value = { ...q, page: 1, size: 10 }
}
function handleClear() {
  params.value = { page: 1, size: 10 }
}
</script>

<template>
  <div class="space-y-4">
    <RepairSearchWidget @submit="handleSubmit" @clear="handleClear" />
    <RepairListWidget :params="params" />
  </div>
</template>
