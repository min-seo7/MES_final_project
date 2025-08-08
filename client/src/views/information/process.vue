<script setup>
import processSearchWidget from '@/components/information/process/processSearchWidget.vue';
import processListWidget from '@/components/information/process/processListWidget.vue';
import processRegistWidget from '@/components/information/process/processRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('process.vue unmounted!');
});
</script>

<template>
    <section class="process-container">
        <processSearchWidget />
        <processListWidget />
        <processRegistWidget />
    </section>
</template>
