<script setup>
import { ref } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Dialog from 'primevue/dialog';

const emit = defineEmits(['submit', 'clear']);

/* 검색 상태 */
const search = ref({
    equipment_id: '',
    equipment_type: '',
    equipment_name: '',
    location: '',
    status: ''
});

function onSubmit() {
    emit('submit', { ...search.value });
}
function onClear() {
    search.value = { equipment_id: '', equipment_type: '', equipment_name: '', location: '', status: '' };
    emit('clear');
}

/* ===== 모달 (돋보기 + 라디오선택 + 페이지네이션 + 선택완료) ===== */
const showPicker = ref(false);
const pickerList = ref([]);
const page = ref(1);
const total = ref(0);
const size = 5;
let currentField = '';
const selected = ref(''); // 라디오로 선택된 값

async function openPicker(field) {
    currentField = field;
    selected.value = ''; // 열릴 때 선택 초기화
    await fetchPicker(1);
    showPicker.value = true;
}

async function fetchPicker(p) {
    try {
        page.value = p;
        const { data } = await axios.get('/api/equipment/info2/distinct', {
            params: { field: currentField, page: p, size }
        });
        pickerList.value = (data?.items ?? []).filter((v) => v && v !== '-');
        total.value = data?.total ?? pickerList.value.length;
    } catch {
        pickerList.value = [];
        total.value = 0;
    }
}

function confirmSelect() {
    if (currentField && selected.value) {
        search.value[currentField] = selected.value;
    }
    showPicker.value = false;
}
</script>

<template>
    <div class="space-y-2">
        <!-- 제목 + 버튼 -->
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">조회</div>
            <div class="flex gap-2">
                <Button label="조회" rounded @click="onSubmit" />
                <Button label="초기화" severity="info" rounded @click="onClear" />
            </div>
        </div>

        <!-- 검색 영역 -->
        <div class="flex items-center gap-6 border rounded-md p-4 bg-white mt-2 flex-wrap">
            <!-- 설비코드 -->
            <div class="flex items-center gap-2">
                <label>설비코드</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.equipment_id" class="w-56" readonly />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('equipment_id')" />
                </IconField>
            </div>
            <!-- 설비유형 -->
            <div class="flex items-center gap-2">
                <label>설비유형</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.equipment_type" class="w-56" readonly />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('equipment_type')" />
                </IconField>
            </div>
            <!-- 설비명 -->
            <div class="flex items-center gap-2">
                <label>설비명</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.equipment_name" class="w-56" readonly />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('equipment_name')" />
                </IconField>
            </div>
            <!-- 설비위치 -->
            <div class="flex items-center gap-2">
                <label>설비위치</label>
                <IconField iconPosition="left">
                    <InputText v-model="search.location" class="w-56" readonly />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('location')" />
                </IconField>
            </div>
            <!-- 설비상태 -->
            <div class="flex items-center gap-3">
                <label class="mr-1">설비상태</label>
                <RadioButton inputId="st1" name="status" value="가동" v-model="search.status" />
                <label for="st1" class="mr-4">가동</label>
                <RadioButton inputId="st2" name="status" value="비가동" v-model="search.status" />
                <label for="st2">비가동</label>
            </div>
        </div>

        <!-- 모달 -->
        <Dialog
            v-model:visible="showPicker"
            :header="
                {
                    equipment_id: '설비코드',
                    equipment_type: '설비유형',
                    equipment_name: '설비명',
                    location: '설비위치'
                }[currentField]
            "
            :modal="true"
            :style="{ width: '30rem' }"
        >
            <!-- 리스트 (라디오 선택) -->
            <ul class="divide-y">
                <li v-for="(v, i) in pickerList" :key="i" class="p-2 flex items-center gap-3 cursor-pointer" @click="selected = v">
                    <RadioButton :inputId="`pick_${i}`" name="picker" :value="v" v-model="selected" />
                    <label :for="`pick_${i}`" class="truncate">{{ v }}</label>
                </li>
                <li v-if="pickerList.length === 0" class="p-4 text-center text-gray-500">항목 없음</li>
            </ul>

            <!-- 하단 컨트롤 -->
            <div class="relative mt-3 min-h-[42px]">
                <!-- 중앙 선택완료 버튼 -->
                <div class="absolute left-1/2 -translate-x-1/2">
                    <Button label="선택완료" class="text-[14px]" @click="confirmSelect" />
                </div>
                <!-- 오른쪽 페이지네이션 -->
                <div class="flex items-center gap-2 justify-end text-[14px]">
                    <Button label="이전" text @click="fetchPicker(page - 1)" :disabled="page <= 1" />
                    <span>{{ page }} / {{ Math.max(1, Math.ceil(total / size)) }}</span>
                    <Button label="다음" text @click="fetchPicker(page + 1)" :disabled="page * size >= total" />
                </div>
            </div>
        </Dialog>
    </div>
</template>
