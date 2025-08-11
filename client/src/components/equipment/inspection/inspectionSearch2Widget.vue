<script setup>
import { ref } from 'vue';

const props = defineProps({
    // [{ insp_code, eq_id, insp_type, insp_date, ... }]
    pickerData: { type: Array, default: () => [] }
});
const emit = defineEmits(['submit', 'clear']);

const search = ref({
    insp_code: '', // 점검코드
    eq_id: '', // 설비코드
    insp_type: '', // 점검유형
    insp_date: null // 점검일(Date | 'YYYY-MM-DD')
});

function onSubmit() {
    emit('submit', { ...search.value });
}
function onClear() {
    search.value = { insp_code: '', eq_id: '', insp_type: '', insp_date: null };
    emit('clear');
}

/* ===== 돋보기 픽커 ===== */
const showPicker = ref(false);
const pickerList = ref([]); // string[]
let currentField = ''; // 'insp_code' | 'eq_id' | 'insp_type'
const unique = (arr) => [...new Set(arr.filter(Boolean))];

function openPicker(field) {
    currentField = field;
    if (!props.pickerData?.length) return;
    pickerList.value = unique(props.pickerData.map((r) => r[field]));
    showPicker.value = true;
}
function selectPicker(v) {
    if (!currentField) return;
    search.value[currentField] = v;
    showPicker.value = false;
}

// 통일된 UI 크기
const ui = {
    label: 'text-[17px]',
    input: 'w-72 h-10 text-[15px]'
};
</script>

<template>
    <div class="space-y-2">
        <!-- 제목/버튼 -->
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">조회</div>
            <div class="flex items-center gap-2">
                <Button label="조회" rounded @click="onSubmit" />
                <Button label="초기화" severity="info" rounded @click="onClear" />
            </div>
        </div>

        <!-- 검색 라인 -->
        <div class="flex items-center gap-8 border rounded-md p-4 bg-white mt-2 flex-wrap text-[15px]">
            <!-- 점검코드 -->
            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">점검코드</label>
                <IconField iconPosition="left" class="w-72">
                    <InputText v-model="search.insp_code" :class="ui.input" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('insp_code')" />
                </IconField>
            </div>

            <!-- 설비코드 -->
            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">설비코드</label>
                <IconField iconPosition="left" class="w-72">
                    <InputText v-model="search.eq_id" :class="ui.input" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('eq_id')" />
                </IconField>
            </div>

            <!-- 점검유형 -->
            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">점검유형</label>
                <IconField iconPosition="left" class="w-72">
                    <InputText v-model="search.insp_type" :class="ui.input" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('insp_type')" />
                </IconField>
            </div>

            <!-- 점검일 -->
            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">점검일</label>
                <Calendar v-model="search.insp_date" dateFormat="yy-mm-dd" showIcon iconDisplay="input" :pt="{ input: { class: ui.input } }" />
            </div>
        </div>

        <!-- 픽커 모달 -->
        <Dialog v-model:visible="showPicker" header="검색 목록" :modal="true" :style="{ width: '28rem' }">
            <ul>
                <li v-for="(v, i) in pickerList" :key="i" class="p-2 border-b hover:bg-gray-100 cursor-pointer" @click="selectPicker(v)">
                    {{ v }}
                </li>
            </ul>
        </Dialog>
    </div>
</template>
