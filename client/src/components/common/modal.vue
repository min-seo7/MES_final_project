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

// 페이지별 최소 행 수를 맞추기 위해 빈 데이터 추가
const paddedItems = computed(() => {
    const currentItems = props.items || [];
    const pageCount = Math.ceil(currentItems.length / rowsPerPage);
    const totalRowsNeeded = pageCount * rowsPerPage;
    const emptyRowsCount = totalRowsNeeded - currentItems.length;

    if (emptyRowsCount > 0) {
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
        <!-- 상단 버튼 -->
        <div class="mt-5 flex justify-center">
            <Button label="선택 완료" @click="confirmSelection" />
        </div>

        <!-- 필터 영역 (사원번호 모달일 때만 표시) -->
        <div v-if="props.showFilter" class="mt-5 mb-4 space-x-2 flex justify-center">
            <label for="employeeName">사원명</label>
            <InputText id="employeeName" type="text" />
            <label for="department">부서</label>
            <InputText id="department" type="text" />
            <Button label="검색" />
            <Button label="초기화" />
        </div>

        <!-- 데이터 테이블 (페이지네이션 적용) -->
        <DataTable :value="paddedItems" tableStyle="min-width: 20rem;" class="mb-3" paginator :rows="rowsPerPage" dataKey="num">
            <Column header="">
                <template #body="slotProps">
                    <div v-if="!isEmptyRow(slotProps.data)">
                        <RadioButton :inputId="'select' + slotProps.index" name="modalSelect" :value="slotProps.data" :modelValue="props.selectedItem" @update:modelValue="onSelect(slotProps.data)" />
                    </div>
                    <div v-else style="height: 17px"></div>
                    <!-- 빈 행 공간 확보 -->
                </template>
            </Column>

            <Column v-for="col in props.columns" :key="col.field" :field="col.field" :header="col.header">
                <template #body="slotProps">
                    <span v-if="!isEmptyRow(slotProps.data)">{{ slotProps.data[col.field] }}</span>
                </template>
            </Column>
        </DataTable>
    </Dialog>
</template>

<style scoped>
/* 테이블 최소 높이 확보 */
.p-datatable .p-datatable-tbody {
    min-height: 400px;
}

/* 행 높이 고정 */
.p-datatable .p-datatable-tbody > tr {
    height: 40px !important;
    display: table;
    width: 100%;
    table-layout: fixed;
}

/* 빈 행 가운데 정렬 */
.p-datatable .p-datatable-tbody > tr > td {
    vertical-align: middle;
}
</style>
