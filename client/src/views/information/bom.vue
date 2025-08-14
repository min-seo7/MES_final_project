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

const bomSearchData = ref([]);

const handleSearch = (result) => {
    bomSearchData.value = result.map((item, index) => ({
        num: index + 1,
        bomId: item.bom_id,
        prodId: item.product_id,
        prodName: item.product_name,
        prodType: item.product_type,
        createDate: item.created_date,
        status: item.status
    }));
};

onUnmounted(() => {
    console.log('employee.vue unmounted!');
});
</script>

<template>
    <section class="employee-container">
        <BomSearchWidget @bomFilterSearch="handleSearch" />
        <BomListWidget :items="bomSearchData" />
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
