<script setup>
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

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
        <!-- 필터 영역 (사원번호 모달일 때만 표시) -->
        <div v-if="props.showFilter" class="mt-5 mb-4 space-x-2 flex justify-center">
            <label for="employeeName">사원명</label>
            <InputText id="employeeName" type="text" />
            <label for="department">부서</label>
            <InputText id="department" type="text" />
            <Button label="검색" />
            <Button label="초기화" />
        </div>

        <!-- 데이터 테이블 -->
        <DataTable :value="props.items" tableStyle="min-width: 20rem" class="mb-3">
            <Column header="">
                <template #body="slotProps">
                    <RadioButton :inputId="'select' + slotProps.index" name="modalSelect" :value="slotProps.data" :modelValue="props.selectedItem" @update:modelValue="onSelect(slotProps.data)" />
                </template>
            </Column>
            <Column v-for="col in props.columns" :key="col.field" :field="col.field" :header="col.header" />
        </DataTable>

        <!-- 하단 버튼 -->
        <div class="mt-5 flex justify-center">
            <Button label="선택 완료" @click="confirmSelection" />
        </div>
    </Dialog>
</template>
