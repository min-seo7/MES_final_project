<script setup>
import flowSearchWidget from '@/components/information/flowchart/flowSearchWidget.vue';
import flowListWidget from '@/components/information/flowchart/flowListWidget.vue';
import flowRegistWidget from '@/components/information/flowchart/flowRegistWidget.vue';
import flowDetailWidget from '@/components/information/flowchart/flowDetailWidget.vue';
import flowDetailRegistWidget from '@/components/information/flowchart/flowDetailRegistWidget.vue';

import { ref, onUnmounted } from 'vue';
const flowchartDetailData = ref([]);
const flowchartSelectedData = ref([]);
const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const flowchartSearchData = ref(
    Array(rowsPerPage).fill({
        num: '\u00A0',
        flowId: '\u00A0',
        flowName: '\u00A0',
        productId: '\u00A0',
        productName: '\u00A0',
        note: '\u00A0',
        createDate: '\u00A0',
        status: '\u00A0'
    })
);

const handleSearch = (result) => {
    const mapped = result.map((item, index) => ({
        num: index + 1,
        flowId: item.flow_id,
        flowName: item.flow_name,
        productId: item.product_id,
        productName: item.product_name,
        note: item.note,
        createDate: item.create_date,
        status: item.status
    }));

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            flowId: '\u00A0',
            flowName: '\u00A0',
            productId: '\u00A0',
            productName: '\u00A0',
            note: '\u00A0',
            createDate: '\u00A0',
            status: '\u00A0'
        });
    }

    flowchartSearchData.value = mapped;
};

const handleFlowchartDetail = (detail) => {
    const newDetail = { ...detail };
    flowchartDetailData.value = [...flowchartDetailData.value, newDetail];
};

const handleSelect = (row) => {
    flowchartSelectedData.value = [
        {
            flowId: row.flowId,
            flowName: row.flowName,
            productId: row.productId,
            productName: row.productName,
            note: row.note,
            status: row.status
        }
    ];
    console.log(flowchartSelectedData);
};

onUnmounted(() => {
    console.log('flow.vue unmounted!');
});
</script>

<template>
    <section class="flow-container">
        <flowSearchWidget @flowchartFilterSearch="handleSearch" />
        <flowListWidget :items="flowchartSearchData" @flowchartSelected="handleSelect" />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <flowDetailWidget :detailData="flowchartDetailData" :items="flowchartSelectedData" />
            </div>
            <div class="md:w-1/2">
                <flowRegistWidget :detailData="flowchartDetailData" :items="flowchartSelectedData" />
                <flowDetailRegistWidget @flowchartDetail="handleFlowchartDetail" />
            </div>
        </div>
    </section>
</template>
