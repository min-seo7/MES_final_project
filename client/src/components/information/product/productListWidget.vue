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

const emit = defineEmits(['productSelected']);

// row 클릭 시
const onRowClick = (event) => {
    emit('productSelected', event.data);
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
                num: '\u00A0',
                productId: '\u00A0',
                productType: '\u00A0',
                productForm: '\u00A0',
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
        <Column field="productId" header="제품코드" style="width: 150px" />
        <Column field="productType" header="제품유형" style="width: 150px" />
        <Column field="productForm" header="제품형태" style="width: 150px" />
        <Column field="productName" header="제품명" style="width: 150px" />
        <Column field="specification" header="규격" style="width: 150px" />
        <Column field="expiration" header="유통기한" style="width: 150px" />
        <Column field="storageCondition" header="보관조건" style="width: 150px" />
        <Column field="safetyStock" header="안전재고" style="width: 150px" />
        <Column field="manual" header="제품카테고리" style="width: 150px" />
        <Column field="status" header="상태" style="width: 100px" />
    </DataTable>
</template>

<style scoped>
.p-datatable .p-datatable-tbody > tr {
    height: 50px !important;
}
.p-datatable .p-datatable-thead > tr {
    height: 50px !important;
}
.p-datatable .p-datatable-tbody > tr > td {
    padding: 0 10px !important;
    line-height: 50px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
