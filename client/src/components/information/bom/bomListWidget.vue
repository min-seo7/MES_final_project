<script setup>
import { defineProps, ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    }
});

// 선택된 master 행
const selectedMaster = ref(null);

// row 클릭 시
const onRowClick = async (event) => {
    selectedMaster.value = event.data;
    // detail 데이터 fetch 가능
};

// 최소 5행으로 맞춘 데이터
const tableData = computed(() => {
    const rows = [...props.items];
    while (rows.length < 5) {
        rows.push({}); // 빈 객체를 넣어 빈 행 표시
    }
    return rows;
});
</script>

<template>
    <DataTable
        :value="tableData"
        :rows="5"
        :paginator="props.items.length > 5"
        showGridlines
        @row-click="onRowClick"
        selection-mode="single"
    >
        <Column field="num" header="" />
        <Column field="bomId" header="BOM코드" />
        <Column field="prodId" header="제품코드" />
        <Column field="prodName" header="제품명" />
        <Column field="prodType" header="제품유형" />
        <Column field="createDate" header="생성일" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
