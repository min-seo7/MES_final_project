<script setup>
import lineSearchWidget from '@/components/information/line/lineSearchWidget.vue';
import lineListWidget from '@/components/information/line/lineListWidget.vue';
import lineRegistWidget from '@/components/information/line/lineRegistWidget.vue';
import lineDetailWidget from '@/components/information/line/lineDetailWidget.vue';
import lineDetailRegistWidget from '@/components/information/line/lineDetailRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('line.vue unmounted!');
});
</script>

<template>
    <section class="line-container">
        <lineRegistWidget />
        <lineSearchWidget />
        <lineListWidget />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <lineDetailWidget />
            </div>
            <div class="md:w-1/2">
                <lineDetailRegistWidget />
            </div>
        </div>
    </section>
</template>
