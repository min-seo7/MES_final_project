<script setup>
import productSearchWidget from '@/components/information/product/productSearchWidget.vue';
import productListWidget from '@/components/information/product/productListWidget.vue';
import productRegistWidget from '@/components/information/product/productRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('product.vue unmounted!');
});
</script>

<template>
    <section class="product-container">
        <productSearchWidget />
        <productListWidget />
        <productRegistWidget />
    </section>
</template>
