<script setup>
import { ref } from 'vue';

/** 팝업 검색에 쓸 더미/실데이터 세트는 상위에서 내려주세요.
 * 예: [{ eq_id, eq_type, eq_name, loc }, ...]
 */
const props = defineProps({
    pickerData: { type: Array, default: () => [] }
});

const emit = defineEmits(['submit', 'clear']);

const search = ref({
    eq_id: '',
    eq_type: '',
    eq_name: '',
    loc: '',
    status: '사용'
});

/* ------- 돋보기 팝업 ------- */
const showPicker = ref(false);
const pickerList = ref([]); // string[]
let currentField = ''; // 'eq_id' | 'eq_type' | 'eq_name' | 'loc'

const unique = (arr) => [...new Set(arr)];

function openPicker(field) {
    currentField = field;
    if (!props.pickerData.length) return;
    pickerList.value = unique(props.pickerData.map((i) => i[field]));
    showPicker.value = true;
}
function selectPicker(v) {
    if (!currentField) return;
    search.value[currentField] = v; // 해당 입력칸만 채움
    showPicker.value = false;
}

/* ------- 조회/초기화 ------- */
function onSubmit() {
    emit('submit', { ...search.value });
}
function onClear() {
    search.value = { eq_id: '', eq_type: '', eq_name: '', loc: '', status: '사용' };
    emit('clear');
}
</script>

<template>
    <!-- 상단 타이틀 + 버튼 -->
    <div class="flex items-center justify-between mb-2">
        <div class="font-bold text-[18.5px]">조회</div>
        <div class="flex gap-2">
            <Button label="조회" rounded @click="onSubmit" />
            <Button label="초기화" severity="info" rounded @click="onClear" />
        </div>
    </div>

    <!-- 검색 폼 -->
    <div class="flex items-center gap-6 border rounded-md p-4 bg-white flex-nowrap overflow-x-auto">
        <!-- 설비코드 -->
        <div class="flex items-center gap-2 shrink-0">
            <label class="whitespace-nowrap flex items-center h-10">설비코드</label>
            <IconField iconPosition="left" class="w-56 min-w-[14rem]">
                <InputText v-model="search.eq_id" class="w-full" />
                <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('eq_id')" />
            </IconField>
        </div>

        <!-- 설비유형 -->
        <div class="flex items-center gap-2 shrink-0">
            <label class="whitespace-nowrap flex items-center h-10">설비유형</label>
            <IconField iconPosition="left" class="w-56 min-w-[14rem]">
                <InputText v-model="search.eq_type" class="w-full" />
                <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('eq_type')" />
            </IconField>
        </div>

        <!-- 설비명 -->
        <div class="flex items-center gap-2 shrink-0">
            <label class="whitespace-nowrap flex items-center h-10">설비명</label>
            <IconField iconPosition="left" class="w-56 min-w-[14rem]">
                <InputText v-model="search.eq_name" class="w-full" />
                <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('eq_name')" />
            </IconField>
        </div>

        <!-- 설비위치 -->
        <div class="flex items-center gap-2 shrink-0">
            <label class="whitespace-nowrap flex items-center h-10">설비위치</label>
            <IconField iconPosition="left" class="w-56 min-w-[14rem]">
                <InputText v-model="search.loc" class="w-full" />
                <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('loc')" />
            </IconField>
        </div>

        <!-- 설비상태 -->
        <div class="flex items-center gap-3 shrink-0">
            <label class="whitespace-nowrap flex items-center h-10 mr-1">설비상태</label>
            <RadioButton inputId="st1" name="eq_status" value="사용" v-model="search.status" />
            <label for="st1" class="mr-4">사용</label>
            <RadioButton inputId="st2" name="eq_status" value="미사용" v-model="search.status" />
            <label for="st2">미사용</label>
        </div>
    </div>

    <!-- 돋보기 선택 모달 -->
    <Dialog v-model:visible="showPicker" header="검색 목록" :modal="true" :style="{ width: '28rem' }">
        <ul>
            <li v-for="(v, i) in pickerList" :key="i" class="p-2 border-b hover:bg-gray-100 cursor-pointer" @click="selectPicker(v)">
                {{ v }}
            </li>
        </ul>
    </Dialog>
</template>
