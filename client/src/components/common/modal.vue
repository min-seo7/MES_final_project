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

const paddedItems = computed(() => {
    const currentItems = props.items || [];
    const emptyRowsCount = rowsPerPage - (currentItems.length % rowsPerPage);

    // 전체 데이터 수가 10개 미만이면 패딩을 추가하지 않음
    if (currentItems.length < rowsPerPage) {
        return currentItems;
    }

    if (emptyRowsCount > 0 && emptyRowsCount !== rowsPerPage) {
        const emptyRows = Array.from({ length: emptyRowsCount }, () => ({ empty: true }));
        return [...currentItems, ...emptyRows];
    }
    return currentItems;
});

const isEmptyRow = (row) => row.empty;
</script>

<template>
    <Dialog
        :visible="props.visible"
        modal
        :header="
            {
                employeeId: '사원번호',
                employeeName: '사원명',
                department: '부서명',
                auth: '권한',
                status: '상태'
            }[props.modalType]
        "
        :style="{ width: '40vw' }"
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

        <DataTable :value="paddedItems" tableStyle="min-width: 20rem;" class="mb-3" paginator :rows="rowsPerPage" dataKey="num">
            <Column header="">
                <template #body="slotProps">
                    <div v-if="!isEmptyRow(slotProps.data)">
                        <RadioButton :inputId="'select' + slotProps.index" name="modalSelect" :value="slotProps.data" :modelValue="props.selectedItem" @update:modelValue="onSelect(slotProps.data)" />
                    </div>
                    <div v-else style="height: 40px"></div>
                </template>
            </Column>

            <Column v-for="col in props.columns" :key="col.field" :field="col.field" :header="col.header">
                <template #body="slotProps">
                    <span v-if="!isEmptyRow(slotProps.data)">{{ slotProps.data[col.field] }}</span>
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
    /* 10개 행 * 40px/행 = 400px */
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
.p-datatable .p-datatable-tbody {
    /* [수정] min-height 속성을 제거하여 테이블 높이가 내용에 따라 유동적으로 변하게 합니다. */
}

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
