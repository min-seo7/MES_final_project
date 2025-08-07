<script setup>
import orderRegistSearch from '@/components/sales/orderRegist/orderRegistSearch.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>
<template>
    <section>
        <orderRegistSearch />
    </section>
</template>
