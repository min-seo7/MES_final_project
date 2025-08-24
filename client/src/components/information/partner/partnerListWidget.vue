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

const emit = defineEmits(['partnerSelected']);

// row 클릭 시
const onRowClick = (event) => {
    emit('partnerSelected', event.data);
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
                partnerId: '\u00A0',
                partnerType: '\u00A0',
                partnerName: '\u00A0',
                manager: '\u00A0',
                mainTel: '\u00A0',
                email: '\u00A0',
                address: '\u00A0',
                businessNo: '\u00A0',
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
        <Column field="num" header="No" style="width: 50px" />
        <Column field="partnerId" header="거래처코드" style="width: 150px" />
        <Column field="partnerType" header="거래처유형" style="width: 100px" />
        <Column field="partnerName" header="거래처명" style="width: 150px" />
        <Column field="manager" header="담당자" style="width: 100px" />
        <Column field="mainTel" header="대표번호" style="width: 150px" />
        <Column field="email" header="E-Mail" style="width: 200px" />
        <Column field="address" header="거래처주소" style="width: 300px" />
        <Column field="businessNo" header="사업자번호" style="width: 150px" />
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
