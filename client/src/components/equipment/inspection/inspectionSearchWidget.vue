<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    pickerData: { type: Array, default: () => [] } // 기존 유지(백업용)
});
const emit = defineEmits(['submit', 'clear']);

const search = ref({
    insp_code: '',
    eq_id: '',
    insp_type: '',
    insp_date: null,
    next_date: null
});

// 조회 버튼
// function onSubmit() {
//     const cond = { ...search.value };
//     // 빈 문자열은 null로 교체
//     Object.keys(cond).forEach((k) => {
//         if (!cond[k]) cond[k] = null;
//     });
//     emit('submit', cond);
// }

function onSubmit() {
    const cond = { ...search.value };
    console.log('[SearchWidget] submit payload:', cond); // ✅ 여기
    emit('submit', cond);
}

// 초기화 버튼
function onClear() {
    search.value = { insp_code: '', eq_id: '', insp_type: '', insp_date: null, next_date: null };
    emit('clear');
}

/* ---------------------------
   돋보기 모달 + 페이지네이션(5개 고정)
   openPicker: 모달 오픈 & 1페이지 로드
   fetchPicker: 서버에서 distinct 목록 페이징 조회
   selectPicker: 선택값 반영
--------------------------- */
const showPicker = ref(false);
const pickerList = ref([]);
const page = ref(1);
const total = ref(0);
const size = 5;
let currentField = '';

async function openPicker(field) {
    currentField = field;
    await fetchPicker(1);
    showPicker.value = true;
}

async function fetchPicker(p) {
    try {
        page.value = p;
        const { data } = await axios.get('/api/equipment/inspection/distinct', {
            params: { field: currentField, page: p, size }
        });
        // 서버 응답 우선, 실패 시 기존 pickerData로 fallback
        pickerList.value = data?.items ?? [];
        total.value = data?.total ?? pickerList.value.length;
        if (!data) {
            const backup = [...new Set((props.pickerData || []).map((i) => i?.[currentField]).filter(Boolean))];
            pickerList.value = backup.slice((p - 1) * size, p * size);
            total.value = backup.length;
        }
    } catch (e) {
        // 네트워크 이슈 시에도 기존 방식으로 안전하게 동작
        const backup = [...new Set((props.pickerData || []).map((i) => i?.[currentField]).filter(Boolean))];
        pickerList.value = backup.slice((p - 1) * size, p * size);
        total.value = backup.length;
    }
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

            <!-- 모달 페이지네이션 -->
            <div v-if="total > size" class="flex justify-between items-center mt-3">
                <Button label="이전" :disabled="page === 1" @click="fetchPicker(page - 1)" />
                <span>{{ page }} / {{ Math.ceil(total / size) }}</span>
                <Button label="다음" :disabled="page * size >= total" @click="fetchPicker(page + 1)" />
            </div>
        </Dialog>
    </div>
</template>
