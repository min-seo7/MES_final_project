<script setup>
import { ref, watch, defineProps } from 'vue';
import axios from 'axios';

const item = ref([]); // 실제 데이터
const tableData = ref([]); // 테이블 표시용 데이터 (빈 행 포함)
const currentPage = ref(1);
const rowsPerPage = 5;

const form = ref({
    flowId: ''
});

const props = defineProps({
    detailData: {
        type: [Array, Object],
        default: () => []
    },
    items: {
        type: Array,
        default: () => []
    }
});

// 부모에서 items 들어올 때 (조회)
watch(
    () => props.items,
    (newVal) => {
        currentPage.value = 1;
        if (newVal && newVal.length) {
            form.value = { ...newVal[0], flowId: newVal[0].flowId?.trim() || '' };
            getflowchartDetail(form.value);
        } else {
            form.value = { flowId: '' };
            item.value = [];
            updateTableData();
        }
    },
    { immediate: true }
);

// 부모에서 detailData 들어올 때 (등록/변경)
watch(
    () => props.detailData,
    (newVal) => {
        if (newVal && newVal.length) {
            item.value = newVal.map((row, index) => ({
                num: index + 1,
                processId: row.processId || '\u00A0',
                processName: row.processName || '\u00A0',
                order: row.useOrder || '\u00A0',
                status: row.status || '\u00A0'
            }));
            const totalPages = Math.ceil(item.value.length / rowsPerPage);
            currentPage.value = totalPages; // 마지막 페이지
        } else {
            item.value = [];
            currentPage.value = 1;
        }
        updateTableData();
    },
    { immediate: true }
);

//상세 조회
const getflowchartDetail = async (flowInfo) => {
    try {
        const res = await axios.post('/api/information/flowchart/detailList', flowInfo);
        item.value = res.data.list.map((row, index) => ({
            num: index + 1,
            processId: row.process_id || '\u00A0',
            processName: row.process_name || '\u00A0',
            order: row.use_order || '\u00A0',
            status: row.status || '\u00A0'
        }));
        updateTableData();
    } catch (err) {
        console.log('flowchart 검색실패', err);
        updateTableData();
    }
};

// 페이지 전환
function onPage(event) {
    currentPage.value = event.page + 1;
}

// 행 클릭
function onRowClick(event) {
    console.log('선택된 행:', event.data);
}

// 테이블 표시용 데이터 업데이트 (빈 행 포함)
function updateTableData() {
    const totalPages = Math.ceil(item.value.length / rowsPerPage) || 1;
    const totalNeeded = totalPages * rowsPerPage;

    const paddedItems = [...item.value];
    while (paddedItems.length < totalNeeded) {
        paddedItems.push({
            num: '\u00A0',
            processId: '\u00A0',
            processName: '\u00A0',
            order: '\u00A0',
            status: '\u00A0'
        });
    }

    tableData.value = paddedItems;
}

// 초기 상태에서도 테이블 고정
updateTableData();
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">공정흐름도 목록</h2>
    </div>
    <div class="card mt-4 p-4 border rounded" style="height: 400px">
        <DataTable :value="tableData" :rows="rowsPerPage" :paginator="true" :totalRecords="item.length" showGridlines @row-click="onRowClick" @page="onPage" selection-mode="single" responsiveLayout="scroll">
            <Column field="num" header="No" style="width: 60px" />
            <Column field="processId" header="공정코드" style="width: 150px" />
            <Column field="processName" header="공정명" style="width: 200px" />
            <Column field="order" header="순서" style="width: 100px" />
            <Column field="status" header="상태" style="width: 100px" />
        </DataTable>
    </div>
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
