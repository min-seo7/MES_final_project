<script setup>
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const rowsPerPage = 10; // 페이지당 행 수

const props = defineProps({
    visible: Boolean,
    modalType: String,
    items: Array,
    columns: Array,
    selectedItem: Object,
    showFilter: Boolean
});

const emits = defineEmits(['update:visible', 'update:selectedItem', 'confirm']);

// 라디오 버튼 선택
const onSelect = (row) => {
    emits('update:selectedItem', row);
};

// 모달 닫기
const close = () => {
    emits('update:visible', false);
};

// 확인 버튼 클릭
const confirmSelection = () => {
    emits('confirm', props.selectedItem);
    close();
};

// 컬럼 수에 따라 모달 너비 동적 계산
const dynamicWidth = computed(() => {
    const baseWidth = 40; // 기본 너비 (vw)
    const columnWidth = 5; // 컬럼당 추가되는 너비 (vw)
    const numColumns = props.columns?.length || 0;
    const calculatedWidth = baseWidth + Math.max(0, numColumns - 4) * columnWidth;
    return `${Math.min(70, Math.max(baseWidth, calculatedWidth))}vw`;
});

// modalType에 따라 모달 제목 동적 설정
const modalTitle = computed(() => {
    const titles = {
        employeeId: '사원코드 선택',
        productId: '제품코드 선택',
        department: '부서 선택',
        processId: '공정코드 선택',
        equipmentId: '설비코드 선택',
        productName: '제품명 선택',
        processName: '공정명 선택',
        materialId: '자재코드 선택',
        materialName: '자재명 선택',
        partnerName: '거래처명 선택',
        flowName: '흐름도명 선택',
        lineName: '라인명 선택',
        warehouse: '창고 선택',
        location: '위치 선택',
        warehouseType: '창고유형 선택'




        // 다른 모달 타입에 대한 제목을 여기에 추가
    };
    return titles[props.modalType] || props.modalType;
});
</script>

<template>
    <Dialog
        :visible="props.visible"
        modal
        :header="modalTitle"
        :style="{ width: dynamicWidth }"
        @update:visible="emits('update:visible', $event)"
    >
        <div v-if="props.showFilter" class="mt-5 mb-4 space-x-2 flex justify-center">
            <label for="employeeName">사원명</label>
            <InputText id="employeeName" type="text" />
            <label for="department">부서</label>
            <InputText id="department" type="text" />
            <Button label="검색" />
            <Button label="초기화" />
        </div>

        <DataTable :value="props.items" tableStyle="min-width: 20rem;" class="mb-3" paginator :rows="rowsPerPage" dataKey="num">
            <Column header="">
                <template #body="slotProps">
                    <div>
                        <RadioButton :inputId="'select' + slotProps.index" name="modalSelect" :value="slotProps.data" :modelValue="props.selectedItem" @update:modelValue="onSelect(slotProps.data)" />
                    </div>
                </template>
            </Column>

            <Column v-for="col in props.columns" :key="col.field" :field="col.field" :header="col.header">
                <template #body="slotProps">
                    <span>{{ slotProps.data[col.field] }}</span>
                </template>
            </Column>
        </DataTable>
        <div class="mt-5 flex justify-center">
            <Button label="선택 완료" @click="confirmSelection" />
        </div>
    </Dialog>
</template>

<style scoped>
/* --- 모달 전역 스타일 (유지) --- */
:deep(.p-dialog .p-dialog-header) {
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    padding: 1rem 1.5rem;
}

:deep(.p-dialog .p-dialog-title) {
    font-weight: 600;
    font-size: 1.1rem;
}

:deep(.p-dialog .p-dialog-content) {
    padding: 1.5rem;
    background: #ffffff;
}

/* --- 상단 버튼 영역 (여백 유지) --- */
.mt-5.flex.justify-center {
    padding: 0 0 1.5rem 0;
    margin: 0;
}

/* --- 데이터 테이블 스타일 --- */
:deep(.p-datatable .p-datatable-tbody) {
    min-height: 400px;
}

/* [수정] 스크립트에서 추가하는 빈 행(empty row)을 화면에 보이지 않게 처리하여
    실제 데이터가 있는 만큼만 테이블 높이가 잡히도록 합니다.
*/
:deep(.p-datatable .p-datatable-tbody > tr:has(div[style='height: 40px'])) {
    display: table-row;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    text-align: center;
    font-weight: 500;
    color: #495057;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    border-bottom: 1px solid #e9ecef;
    text-align: center;
    padding: 0.5rem 0.75rem;
}

:deep(.p-datatable-wrapper) {
    border: 1px solid #dee2e6;
}

:deep(.p-datatable .p-datatable-tbody > tr:not([aria-selected='true']):hover) {
    background-color: #f1f3f5 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr[aria-selected='true']) {
    background-color: #e3f2fd !important;
    color: #0d47a1;
}

/* --- 페이지네이션 (유지) --- */
:deep(.p-paginator) {
    justify-content: center;
    border-top: 1px solid #dee2e6;
    margin-top: 1rem;
}

/* --- 기존 스타일 수정 --- */
.p-datatable .p-datatable-tbody > tr {
    height: 40px !important;
    display: table;
    width: 100%;
    table-layout: fixed;
}

.p-datatable .p-datatable-tbody > tr > td {
    vertical-align: middle;
}
</style>