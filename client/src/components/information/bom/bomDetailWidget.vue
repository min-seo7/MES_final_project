<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

const fetchBomDetail = async () => {
    try {
        const response = await axios.get('/api/information/bom');
        items.value = response.data.list2.map((item, index) => ({
            num: index + 1,
            mId: item.material_id,
            mName: item.material_name,
            unit: item.unit,
            mixRatio: item.mix_ratio,
            requiredQty: item.required_qty,
            totalQty: item.total_qty,
            status: item.status
        }));
    } catch (error) {
        console.log(items.value);
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchBomDetail();
});
</script>

<template>
    <!--
    <div class="flex flex-col">
        <div class="card">
            
    <div class="p-4">
                    -->
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="10" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="mId" header="자재코드" />
        <Column field="mName" header="자재명" />
        <Column field="unit" header="단위" />
        <Column field="mixRatio" header="혼합율" />
        <Column field="requiredQty" header="소요량" />
        <Column field="totalQty" header="총소요량" />
        <Column field="status" header="상태" />
    </DataTable>

    <!--
        </div>
        </div>
    </div>
    -->
</template>
