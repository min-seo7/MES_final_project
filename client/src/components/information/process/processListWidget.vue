<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

// API 호출 함수
const fetchProcess = async () => {
    try {
        const response = await axios.get('/api/information/process');
        items.value = response.data.list.map((item, index) => ({
            num: index + 1,
            processId: item.process_id,
            processName: item.process_name,
            isInspection: item.is_inspection,
            status: item.status
        }));
    } catch (error) {
        console.log(items.value);
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchProcess();
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="processId" header="공정코드" />
        <Column field="processName" header="공정명" />
        <Column field="isInspection" header="검사유무" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
