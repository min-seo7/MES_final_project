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
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable
        :value="tableData"
        :rows="5"
        :paginator="props.items.length > 5"
        showGridlines
        @row-click="onRowClick"
        selection-mode="single"
    >        <Column field="num" header="" />
        <Column field="productId" header="제품코드" />
        <Column field="productType" header="제품유형" />
        <Column field="productType" header="제품형태" />
        <Column field="productName" header="제품명" />
        <Column field="specification" header="규격" />
        <Column field="expiration" header="유통기한" />
        <Column field="storageCondition" header="보관조건" />
        <Column field="safetyStock" header="안전재고" />
        <Column field="manual" header="제품매뉴얼" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
