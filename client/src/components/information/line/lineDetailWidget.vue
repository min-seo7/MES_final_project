<script setup>
import { ref, watch, defineProps } from 'vue';
import axios from 'axios';

const item = ref([]); // 서버에서 받아온 데이터
const tableData = ref([]); // 화면에 표시할 데이터
const currentPage = ref(1); // 현재 페이지
const rowsPerPage = 5; // 페이지당 행 수

const form = ref({
    lineId: ''
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

// line 선택 시 detail 가져오기
watch(
    () => props.items,
    (newVal) => {
        if (newVal && newVal.length) {
            form.value = { ...newVal[0], lineId: newVal[0].lineId?.trim() || '' };
            getlineDetail(form.value);
        } else {
            form.value = { lineId: '' };
            updateTableData();
        }
    },
    { immediate: true }
);

watch(
    () => props.detailData,
    (newVal) => {
        if (newVal && newVal.length) {
            item.value = newVal.map((row, index) => ({
                num: index + 1,
                processId: row.processId || '\u00A0',
                processName: row.processName || '\u00A0',
                equipmentId: row.equipmentId || '\u00A0',
                equipmentName: row.equipmentName || '\u00A0',
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

// 서버에서 line detail 조회
const getlineDetail = async (lineInfo) => {
    try {
        const res = await axios.post('/api/information/line/detailList', lineInfo);
        item.value = res.data.list.map((item, index) => ({
            num: index + 1,
            processId: item.process_id,
            processName: item.process_name,
            equipmentId: item.equipment_id,
            equipmentName: item.equipment_name,
            order: item.use_order,
            status: item.status
        }));
        updateTableData();
    } catch (err) {
        console.log('line 검색실패', err);
        updateTableData();
    }
};

// 페이지 변경 이벤트
function onPage(event) {
    currentPage.value = event.page + 1;
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
            equipmentId: '\u00A0',
            equipmentName: '\u00A0',
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
    <div class="flex justify-between items-center mb-1">
        <h2 class="text-xl font-bold">라인 상세 목록</h2>
    </div>
    <div class="card mt-1 p-4 border rounded" style="height: 380px">
        <DataTable :value="tableData" :rows="rowsPerPage" :paginator="true" :totalRecords="tableData.length" showGridlines @row-click="onRowClick" @page="onPage" selection-mode="single" responsiveLayout="scroll">
            <Column field="num" header="No" style="width: 50px" />
            <Column field="processId" header="공정코드" style="width: 150px" />
            <Column field="processName" header="공정명" style="width: 150px" />
            <Column field="equipmentId" header="설비코드" style="width: 150px" />
            <Column field="equipmentName" header="설비명" style="width: 150px" />
            <Column field="order" header="사용순서" style="width: 100px" />
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
