<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

const fetchLine = async () => {
    try {
        const response = await axios.get('/api/information/line');
        items.value = response.data.list.map((item, index) => ({
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
    } catch (error) {
        console.log(items.value);
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchLine();
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="lineId" header="라인코드" />
        <Column field="lineName" header="라인명" />
        <Column field="flowId" header="흐름도코드" />
        <Column field="productId" header="제품코드" />
        <Column field="productName" header="제품명" />
        <Column field="note" header="비고" />
        <Column field="createDate" header="생성일" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
