<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

// API 호출 함수
const fetchMaterial = async () => {
    try {
        const response = await axios.get('/api/information/material');
        items.value = response.data.map((item, index) => ({
            num: index + 1,
            materialId: item.material_id,
            materialName: item.material_name,
            materialType: item.material_type,
            specification: item.specification + item.unit,
            storageCondition: item.storage_condition,
            safetyStock: item.safety_stock + item.safety_stock_unit,
            status: item.status
        }));
    } catch (error) {
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchMaterial();
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="materialId" header="자재코드" />
        <Column field="materialName" header="자재명" />
        <Column field="materialType" header="자재유형" />
        <Column field="specification" header="규격" />
        <Column field="storageCondition" header="보관조건" />
        <Column field="safetyStock" header="안전재고" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
