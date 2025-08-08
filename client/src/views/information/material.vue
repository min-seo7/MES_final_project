<script setup>
import materialSearchWidget from '@/components/information/material/materialSearchWidget.vue';
import materialListWidget from '@/components/information/material/materialListWidget.vue';
import materialRegistWidget from '@/components/information/material/materialRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('material.vue unmounted!');
});
</script>

<template>
    <section class="material-container">
        <materialSearchWidget />
        <materialListWidget />
        <materialRegistWidget />
    </section>
</template>
