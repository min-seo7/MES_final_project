<script setup>
import lineSearchWidget from '@/components/information/line/lineSearchWidget.vue';
import lineListWidget from '@/components/information/line/lineListWidget.vue';
import lineRegistWidget from '@/components/information/line/lineRegistWidget.vue';
import lineDetailWidget from '@/components/information/line/lineDetailWidget.vue';
import lineDetailRegistWidget from '@/components/information/line/lineDetailRegistWidget.vue';

import { ref, onUnmounted } from 'vue';
const lineDetailData = ref([]);
const lineSelectedData = ref([]);

const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const lineSearchData = ref(
    Array(rowsPerPage).fill({
        num: '\u00A0',
        lineId: '\u00A0',
        lineName: '\u00A0',
        flowId: '\u00A0',
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
        lineId: item.line_id,
        lineName: item.line_name,
        flowId: item.flow_id,
        productId: item.product_id,
        productName: item.product_name,
        note: item.note,
        createDate: item.created_date,
        status: item.status
    }));

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            lineId: '\u00A0',
            lineName: '\u00A0',
            flowId: '\u00A0',
            productId: '\u00A0',
            productName: '\u00A0',
            note: '\u00A0',
            createDate: '\u00A0',
            status: '\u00A0'
        });
    }

    lineSearchData.value = mapped;
};

const handleLineDetail = (detail) => {
    const newDetail = { ...detail };
    lineDetailData.value = [...lineDetailData.value, newDetail];
};

const handleSelect = (row) => {
    lineSelectedData.value = [
        {
            lineId: row.lineId,
            lineName: row.lineName,
            flowId: row.flowId,
            productId: row.productId,
            productName: row.productName,
            note: row.note,
            status: row.status
        }
    ];
    console.log(lineSelectedData);
};

const handleResetForm = () => {
    lineSelectedData.value = {};
    lineDetailData.value = []; // 빈 객체에서 빈 배열로 수정
};

// lineDetailData를 빈 배열로 초기화
const handleResetDetail = () => {
    lineDetailData.value = [];
};

onUnmounted(() => {
    console.log('line.vue unmounted!');
});
</script>

<template>
        <lineSearchWidget @lineFilterSearch="handleSearch" @resetForm="handleResetForm"/>
        <lineListWidget :items="lineSearchData" @lineSelected="handleSelect" />
            <div class="mt-2"></div>

    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2 flex flex-col h-full">
            <lineDetailWidget :detailData="lineDetailData" :items="lineSelectedData" />
        </div>
        
        <div class="md:w-1/2 flex flex-col h-full">
            <div class="flex flex-col">
                <lineRegistWidget :detailData="lineDetailData" :items="lineSelectedData" @resetLine="handleResetDetail"/>
                <lineDetailRegistWidget @lineDetail="handleLineDetail" />
            </div>
        </div>
    </div>
</template>