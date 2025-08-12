<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

// API 호출 함수
const fetchWarehouse = async () => {
    try {
        const response = await axios.get('/api/information/warehouse');
        items.value = response.data.map((item, index) => ({
            num: index + 1,
            warehouseId: item.warehouse_id,
            warehouse: item.warehouse,
            zone: item.zone,
            subZone: item.sub_zone,
            floor: item.floor,
            location: item.location,
            warehouseType: item.warehouse_type,
            status: item.status
        }));
    } catch (error) {
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchWarehouse();
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="warehouseId" header="창고코드" />
        <Column field="warehouse" header="창고" />
        <Column field="zone" header="구역" />
        <Column field="subZone" header="세부구역" />
        <Column field="floor" header="층" />
        <Column field="location" header="위치" />
        <Column field="warehouseType" header="창고유형" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
