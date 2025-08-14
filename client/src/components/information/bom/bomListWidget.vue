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
        <Column field="bomId" header="BOM코드" />
        <Column field="prodId" header="제품코드" />
        <Column field="prodName" header="제품명" />
        <Column field="prodType" header="제품유형" />
        <Column field="createDate" header="생성일" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
