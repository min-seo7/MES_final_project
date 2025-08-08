<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

const fetchBom = async () => {
    try {
        const response = await axios.get('/api/information/bom');
        items.value = response.data.list.map((item, index) => ({
            num: index + 1,
            bomId: item.bom_id,
            prodId: item.product_id,
            prodName: item.product_name,
            prodType: item.product_type,
            createDate: item.created_date,
            status: item.status
        }));
    } catch (error) {
        console.log(items.value);
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchBom();
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="bomId" header="BOM코드" />
        <Column field="prodId" header="제품코드" />
        <Column field="prodName" header="제품명" />
        <Column field="prodType" header="제품유형" />
        <Column field="createDate" header="생성일" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
