<script setup>
import flowSearchWidget from '@/components/information/flowchart/flowSearchWidget.vue';
import flowListWidget from '@/components/information/flowchart/flowListWidget.vue';
import flowRegistWidget from '@/components/information/flowchart/flowRegistWidget.vue';
import flowDetailWidget from '@/components/information/flowchart/flowDetailWidget.vue';
import flowDetailRegistWidget from '@/components/information/flowchart/flowDetailRegistWidget.vue';

import { ref, onUnmounted } from 'vue';
const flowchartDetailData = ref([]);
const flowchartSearchData = ref([]);

const handleSearch = (result) => {
    flowchartSearchData.value = result.map((item, index) => ({
        num: index + 1,
        flowId: item.flow_id,
        flowName: item.flow_name,
        productId: item.product_id,
        productName: item.product_name,
        note: item.note,
        createDate: item.create_date,
        status: item.status
    }));
};

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
        <flowSearchWidget @flowchartFilterSearch="handleSearch" />
        <flowListWidget :items="flowchartSearchData" />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <flowDetailWidget :detailData="flowchartDetailData" />
            </div>
            <div class="md:w-1/2">
                <flowRegistWidget :detailData="flowchartDetailData" />
                <flowDetailRegistWidget @flowchartDetail="handleFlowchartDetail" />
            </div>
        </div>
    </section>
</template>
