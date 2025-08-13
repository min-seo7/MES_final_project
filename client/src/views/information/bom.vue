<script setup>
import BomSearchWidget from '@/components/information/bom/bomSearchWidget.vue';
import BomListWidget from '@/components/information/bom/bomListWidget.vue';
import BomRegistWidget from '@/components/information/bom/bomRegistWidget.vue';
import BomDetailWidget from '@/components/information/bom/bomDetailWidget.vue';
import BomDetailRegistWidget from '@/components/information/bom/bomDetailRegistWidget.vue';

import { ref, onUnmounted } from 'vue';
const bomDetailData = ref([]);

const handleBomDetail = (detail) => {
    const newDetail = { ...detail };
    bomDetailData.value = [...bomDetailData.value, newDetail];
};

onUnmounted(() => {
    console.log('employee.vue unmounted!');
});
</script>

<template>
    <section class="employee-container">
        <BomSearchWidget />
        <BomListWidget />
        <BomRegistWidget :detailData="bomDetailData" />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <BomDetailWidget :detailData="bomDetailData" />
            </div>
            <div class="md:w-1/2">
                <BomDetailRegistWidget @bomDetail="handleBomDetail" />
            </div>
        </div>
    </section>
</template>
