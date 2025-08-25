<script setup>
import { ref } from 'vue'
import ManualSearchWidget from '@/components/equipment/information/manualSearchWidget.vue'
import ManualListWidget from '@/components/equipment/information/manualListWidget.vue'

const params = ref({ page:1, size:10 })

function handleSubmit(cond){
  params.value = { ...cond, page:1, size:10 }
}
function handleClear(){
  params.value = { page:1, size:10 }
}
</script>

<template>
  <div class="p-4">
    <ManualSearchWidget @submit="handleSubmit" @clear="handleClear"/>
    <ManualListWidget :params="params"/>
  </div>
</template>
