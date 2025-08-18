<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['warehouseSelected']);

// row 클릭 시
const onRowClick = async (event) => {
    emit('warehouseSelected', event.data);
};

// 페이지당 표시할 행 수
const rowsPerPage = 5;

// 현재 페이지 (PrimeVue paginator는 0부터 시작)
const currentPage = ref(1);

// 페이지 변경 시
const onPage = (event) => {
    currentPage.value = event.page + 1;
};

const tableData = computed(() => {
    const totalPages = Math.ceil(props.items.length / rowsPerPage);
    const pages = [];

    for (let page = 0; page < totalPages; page++) {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        const pageItems = props.items.slice(start, end);

        // 각 페이지마다 최소 5행 유지
        while (pageItems.length < rowsPerPage) {
            pageItems.push({
                num: '\u00A0', // 공백 문자
                productId: '\u00A0',
                productType: '\u00A0',
                productName: '\u00A0',
                specification: '\u00A0',
                expiration: '\u00A0',
                storageCondition: '\u00A0',
                safetyStock: '\u00A0',
                manual: '\u00A0',
                status: '\u00A0'
            });
        }
        pages.push(...pageItems);
    }
    return pages;
});
</script>

<template>
    <DataTable :value="tableData" :rows="rowsPerPage" :paginator="true" :totalRecords="props.items.length" showGridlines @row-click="onRowClick" @page="onPage" selection-mode="single" responsiveLayout="scroll">
        <Column field="num" header="" style="width: 50px" />
        <Column field="warehouseId" header="창고코드" style="width: 150px" />
        <Column field="warehouse" header="창고" style="width: 150px" />
        <Column field="zone" header="구역" style="width: 150px" />
        <Column field="subZone" header="세부구역" style="width: 150px" />
        <Column field="floor" header="층" style="width: 150px" />
        <Column field="location" header="위치" style="width: 150px" />
        <Column field="warehouseType" header="창고유형" style="width: 150px" />
        <Column field="status" header="상태" style="width: 100px" />
    </DataTable>
</template>

<style scoped>
/* tbody tr 높이 고정 */
.p-datatable .p-datatable-tbody > tr {
    height: 50px !important; /* !important로 override */
}

/* thead tr 높이 고정 (필요 시) */
.p-datatable .p-datatable-thead > tr {
    height: 50px !important;
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 0 10px !important; /* 상하 패딩 최소화 */
    line-height: 50px !important; /* tr 높이에 맞춤 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
