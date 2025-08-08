<script setup>
import BomSearchWidget from '@/components/information/bom/bomSearchWidget.vue';
import BomListWidget from '@/components/information/bom/bomListWidget.vue';
import BomRegistWidget from '@/components/information/bom/bomRegistWidget.vue';
import BomDetailWidget from '@/components/information/bom/bomDetailWidget.vue';
import BomDetailRegistWidget from '@/components/information/bom/bomDetailRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('employee.vue unmounted!');
});
</script>

<template>
    <section class="employee-container">
        <BomRegistWidget />
        <BomSearchWidget />
        <BomListWidget />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <BomDetailWidget />
            </div>
            <div class="md:w-1/2">
                <BomDetailRegistWidget />
            </div>
        </div>
    </section>
</template>
