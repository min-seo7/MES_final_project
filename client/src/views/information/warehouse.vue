<script setup>
import warehouseSearchWidget from '@/components/information/warehouse/warehouseSearchWidget.vue';
import warehouseListWidget from '@/components/information/warehouse/warehouseListWidget.vue';
import warehouseRegistWidget from '@/components/information/warehouse/warehouseRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('warehouse.vue unmounted!');
});
</script>

<template>
    <section class="warehouse-container">
        <warehouseSearchWidget />
        <warehouseListWidget />
        <warehouseRegistWidget />
    </section>
</template>
