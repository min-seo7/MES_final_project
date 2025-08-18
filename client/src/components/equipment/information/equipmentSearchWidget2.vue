<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    // 네트워크 장애 시를 위한 백업 데이터(선택)
    pickerData: { type: Array, default: () => [] }
});
const emit = defineEmits(['submit', 'clear']);

const search = ref({
    equipment_id: '',
    equipment_type: '',
    equipment_name: '',
    location: '',
    status: '사용'
});

function onSubmit() {
    emit('submit', { ...search.value });
}
function onClear() {
    search.value = { equipment_id: '', equipment_type: '', equipment_name: '', location: '', status: '사용' };
    emit('clear');
}

/* ===== 모달(돋보기) + 페이지네이션: 5개 고정 ===== */
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
    const fallback = () => {
        const all = [...new Set((props.pickerData || []).map((i) => i?.[currentField]).filter(Boolean))];
        pickerList.value = all.slice((p - 1) * size, p * size);
        total.value = all.length;
    };
    try {
        page.value = p;
        const { data } = await axios.get('/api/equipment/info2/distinct', {
            params: { field: currentField, page: p, size }
        });
        pickerList.value = data?.items ?? [];
        total.value = data?.total ?? pickerList.value.length;
        if (!data) fallback();
    } catch {
        fallback();
    }
}

function selectPicker(v) {
    if (!currentField) return;
    search.value[currentField] = v;
    showPicker.value = false;
}
</script>

<template>
    <div class="space-y-2">
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">조회</div>
            <div class="flex gap-2">
                <Button label="조회" rounded @click="onSubmit" />
                <Button label="초기화" severity="info" rounded @click="onClear" />
            </div>
        </div>

        <div class="flex items-center gap-6 border rounded-md p-4 bg-white mt-2 flex-wrap">
            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">설비코드</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.equipment_id" class="w-56" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('equipment_id')" />
                </IconField>
            </div>

            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">설비유형</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.equipment_type" class="w-56" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('equipment_type')" />
                </IconField>
            </div>

            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">설비명</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.equipment_name" class="w-56" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('equipment_name')" />
                </IconField>
            </div>

            <div class="flex items-center gap-2">
                <label class="whitespace-nowrap">설비위치</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.location" class="w-56" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('location')" />
                </IconField>
            </div>

            <div class="flex items-center gap-3">
                <label class="whitespace-nowrap mr-1">설비상태</label>
                <RadioButton inputId="st1" name="status" value="사용" v-model="search.status" />
                <label for="st1" class="mr-4">사용</label>
                <RadioButton inputId="st2" name="status" value="미사용" v-model="search.status" />
                <label for="st2">미사용</label>
            </div>
        </div>

        <!-- 모달 -->
        <Dialog v-model:visible="showPicker" header="검색 목록" :modal="true" :style="{ width: '28rem' }">
            <ul>
                <li v-for="(v, i) in pickerList" :key="i" class="p-2 border-b hover:bg-gray-100 cursor-pointer" @click="selectPicker(v)">
                    {{ v }}
                </li>
                <li v-if="pickerList.length === 0" class="p-2 text-gray-500 text-center">항목 없음</li>
            </ul>

            <!-- 모달 페이지네이션 (Prev / page / Next) -->
            <div v-if="total > size" class="flex justify-between items-center mt-3">
                <Button label="이전" :disabled="page === 1" @click="fetchPicker(page - 1)" />
                <span>{{ page }} / {{ Math.ceil(total / size) }}</span>
                <Button label="다음" :disabled="page * size >= total" @click="fetchPicker(page + 1)" />
            </div>
        </Dialog>
    </div>
</template>
