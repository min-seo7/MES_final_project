<script setup>
import flowSearchWidget from '@/components/information/flowchart/flowSearchWidget.vue';
import flowListWidget from '@/components/information/flowchart/flowListWidget.vue';
import flowRegistWidget from '@/components/information/flowchart/flowRegistWidget.vue';
import flowDetailWidget from '@/components/information/flowchart/flowDetailWidget.vue';
import flowDetailRegistWidget from '@/components/information/flowchart/flowDetailRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('flow.vue unmounted!');
});
</script>

<template>
    <section class="flow-container">
        <flowRegistWidget />
        <flowSearchWidget />
        <flowListWidget />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <flowDetailWidget />
            </div>
            <div class="md:w-1/2">
                <flowDetailRegistWidget />
            </div>
        </div>
    </section>
</template>
