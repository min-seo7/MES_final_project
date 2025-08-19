<script setup>
import BomSearchWidget from '@/components/information/bom/bomSearchWidget.vue';
import BomListWidget from '@/components/information/bom/bomListWidget.vue';
import BomRegistWidget from '@/components/information/bom/bomRegistWidget.vue';
import BomDetailWidget from '@/components/information/bom/bomDetailWidget.vue';
import BomDetailRegistWidget from '@/components/information/bom/bomDetailRegistWidget.vue';

import { ref, onUnmounted } from 'vue';
const bomDetailData = ref([]);
const bomSelectedData = ref([]);
const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const bomSearchData = ref(
    Array(rowsPerPage).fill({
        num: '\u00A0',
        bomId: '\u00A0',
        prodId: '\u00A0',
        prodName: '\u00A0',
        prodType: '\u00A0',
        createDate: '\u00A0',
        status: '\u00A0'
    })
);

const handleBomDetail = (detail) => {
    const newDetail = { ...detail };
    bomDetailData.value = [...bomDetailData.value, newDetail];
};

const handleSearch = (result) => {
    const mapped = result.map((item, index) => ({
        num: index + 1,
        bomId: item.bom_id,
        prodId: item.product_id,
        prodName: item.product_name,
        prodType: item.product_type,
        createDate: item.created_date,
        status: item.status
    }));

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            bomId: '\u00A0',
            prodId: '\u00A0',
            prodName: '\u00A0',
            prodType: '\u00A0',
            createDate: '\u00A0',
            status: '\u00A0'
        });
    }

    bomSearchData.value = mapped;
};

const handleSelect = (row) => {
    bomSelectedData.value = [
        {
            bomId: row.bomId,
            prodName: row.prodName,
            prodId: row.prodId,
            status: row.status
        }
    ];
    console.log(bomSelectedData);
};

onUnmounted(() => {
    console.log('employee.vue unmounted!');
});
</script>

<template>
    <section class="employee-container">
        <BomSearchWidget @bomFilterSearch="handleSearch" />
        <BomListWidget :items="bomSearchData" @bomSelected="handleSelect" />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <BomDetailWidget :detailData="bomDetailData" :items="bomSelectedData" />
            </div>
            <div class="md:w-1/2">
                <BomRegistWidget :detailData="bomDetailData" :items="bomSelectedData" />

                <BomDetailRegistWidget @bomDetail="handleBomDetail" />
            </div>
        </div>
    </section>
</template>
