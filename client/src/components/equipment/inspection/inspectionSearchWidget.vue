<script setup>
import { ref } from 'vue';

const props = defineProps({
    pickerData: { type: Array, default: () => [] }
});
const emit = defineEmits(['submit', 'clear']);

const search = ref({
    insp_code: '',
    eq_id: '',
    insp_type: '',
    insp_date: null,
    next_date: null
});

function onSubmit() {
    emit('submit', { ...search.value });
}
function onClear() {
    search.value = { insp_code: '', eq_id: '', insp_type: '', insp_date: null, next_date: null };
    emit('clear');
}

const showPicker = ref(false);
const pickerList = ref([]);
let currentField = '';

const unique = (arr) => [...new Set(arr.filter(Boolean))];

function openPicker(field) {
    currentField = field;
    pickerList.value = unique((props.pickerData || []).map((i) => i?.[field]));
    showPicker.value = true;
}

function selectPicker(val) {
    if (!currentField) return;
    search.value[currentField] = val;
    showPicker.value = false;
}
</script>

<template>
    <div class="space-y-2">
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">조회</div>
            <div class="flex items-center gap-2">
                <Button label="조회" rounded @click="onSubmit" />
                <Button label="초기화" severity="info" rounded @click="onClear" />
            </div>
        </div>

        <div class="flex items-center gap-6 border rounded-md p-4 bg-white mt-2 flex-wrap">
            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">점검코드</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.insp_code" class="w-56" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('insp_code')" />
                </IconField>
            </div>

            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">설비코드</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.eq_id" class="w-56" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('eq_id')" />
                </IconField>
            </div>

            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">점검유형</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.insp_type" class="w-56" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('insp_type')" />
                </IconField>
            </div>

            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">점검일</label>
                <Calendar v-model="search.insp_date" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-44" />
            </div>

            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">점검예정일</label>
                <Calendar v-model="search.next_date" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-44" />
            </div>
        </div>

        <Dialog v-model:visible="showPicker" header="검색 목록" :modal="true" :style="{ width: '28rem' }">
            <ul>
                <li v-for="(v, i) in pickerList" :key="i" class="p-2 border-b hover:bg-gray-100 cursor-pointer" @click="selectPicker(v)">
                    {{ v }}
                </li>
                <li v-if="pickerList.length === 0" class="p-2 text-gray-500 text-center">항목 없음</li>
            </ul>
        </Dialog>
    </div>
</template>



