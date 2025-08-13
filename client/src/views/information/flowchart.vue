<script setup>
import flowSearchWidget from '@/components/information/flowchart/flowSearchWidget.vue';
import flowListWidget from '@/components/information/flowchart/flowListWidget.vue';
import flowRegistWidget from '@/components/information/flowchart/flowRegistWidget.vue';
import flowDetailWidget from '@/components/information/flowchart/flowDetailWidget.vue';
import flowDetailRegistWidget from '@/components/information/flowchart/flowDetailRegistWidget.vue';

import { ref, onUnmounted } from 'vue';
const flowchartDetailData = ref([]);

const handleFlowchartDetail = (detail) => {
    const newDetail = { ...detail };
    flowchartDetailData.value = [...flowchartDetailData.value, newDetail];
};

onUnmounted(() => {
    console.log('flow.vue unmounted!');
});
</script>

<template>
    <section class="flow-container">
        <flowSearchWidget />
        <flowListWidget />
        <flowRegistWidget :detailData="flowchartDetailData" />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <flowDetailWidget :detailData="flowchartDetailData" />
            </div>
            <div class="md:w-1/2">
                <flowDetailRegistWidget @flowchartDetail="handleFlowchartDetail" />
            </div>
        </div>
    </section>
</template>
