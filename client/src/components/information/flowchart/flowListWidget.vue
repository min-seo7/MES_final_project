<script setup>
import { defineProps } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    }
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="props.items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="flowId" header="흐름도코드" />
        <Column field="flowName" header="흐름도명" />
        <Column field="productId" header="제품코드" />
        <Column field="productName" header="제품명" />
        <Column field="note" header="비고" />
        <Column field="createDate" header="등록일자" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
