<script setup>
import lineSearchWidget from '@/components/information/line/lineSearchWidget.vue';
import lineListWidget from '@/components/information/line/lineListWidget.vue';
import lineRegistWidget from '@/components/information/line/lineRegistWidget.vue';
import lineDetailWidget from '@/components/information/line/lineDetailWidget.vue';
import lineDetailRegistWidget from '@/components/information/line/lineDetailRegistWidget.vue';

import { ref, onUnmounted } from 'vue';
const lineDetailData = ref([]);
const lineSearchData = ref([]);

const handleSearch = (result) => {
    lineSearchData.value = result.map((item, index) => ({
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
};

const handleLineDetail = (detail) => {
    const newDetail = { ...detail };
    lineDetailData.value = [...lineDetailData.value, newDetail];
};

onUnmounted(() => {
    console.log('line.vue unmounted!');
});
</script>

<template>
    <section class="line-container">
        <lineSearchWidget @lineFilterSearch="handleSearch"/>
        <lineListWidget :items="lineSearchData"/>
        <lineRegistWidget />

        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <lineDetailWidget :detailData="lineDetailData"/>
            </div>
            <div class="md:w-1/2">
                <lineDetailRegistWidget @lineDetail="handleLineDetail"/>
            </div>
        </div>
    </section>
</template>
