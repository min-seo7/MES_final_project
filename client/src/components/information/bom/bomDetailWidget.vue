<script setup>
import { ref, watch, defineProps } from 'vue';
import axios from 'axios';

const item = ref([]); // 실제 데이터
const tableData = ref([]); // 테이블 표시용 데이터 (빈 행 포함)
const currentPage = ref(1);
const rowsPerPage = 5;

const form = ref({
    bomId: ''
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
            form.value = { ...newVal[0], bomId: newVal[0].bomId?.trim() || '' };
            getBomDetail(form.value);
        } else {
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
                materialId: row.materialId || '\u00A0',
                materialName: row.materialName || '\u00A0',
                unit: row.unit || '\u00A0',
                mixRatio: row.mixRatio || '\u00A0',
                requiredQty: row.requiredQty || '\u00A0',
                totalQty: row.totalQty || '\u00A0',
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

// BOM 상세 조회
const getBomDetail = async (bomInfo) => {
    try {
        const res = await axios.post('/api/information/bom/detailList', bomInfo);
        item.value = res.data.list.map((row, index) => ({
            num: index + 1,
            materialId: row.material_id || '\u00A0',
            materialName: row.material_name || '\u00A0',
            unit: row.unit || '\u00A0',
            mixRatio: row.mix_ratio || '\u00A0',
            requiredQty: row.required_qty || '\u00A0',
            totalQty: row.total_qty || '\u00A0',
            status: row.status || '\u00A0'
        }));
        updateTableData();
    } catch (err) {
        console.log('BOM 검색 실패', err);
        updateTableData(); // 실패해도 빈 행 표시
    }
};

// 페이지 변경 이벤트
function onPage(event) {
    currentPage.value = event.page + 1;
}

// 행 클릭 이벤트 (예시)
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
            materialId: '\u00A0',
            materialName: '\u00A0',
            unit: '\u00A0',
            mixRatio: '\u00A0',
            requiredQty: '\u00A0',
            totalQty: '\u00A0',
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
        <h2 class="text-xl font-bold">BOM 상세</h2>
    </div>
    <div class="card mt-4 p-4 border rounded" style="height: 300px">
        <DataTable :value="tableData" :rows="rowsPerPage" :paginator="true" :totalRecords="tableData.length" showGridlines @row-click="onRowClick" @page="onPage" selection-mode="single" responsiveLayout="scroll">
            <Column field="num" header="" style="width: 50px" />
            <Column field="materialId" header="자재코드" />
            <Column field="materialName" header="자재명" />
            <Column field="unit" header="단위" />
            <Column field="mixRatio" header="혼합율" />
            <Column field="requiredQty" header="소요량" />
            <Column field="totalQty" header="총소요량" />
            <Column field="status" header="상태" />
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
