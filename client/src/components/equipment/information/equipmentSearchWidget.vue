<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['submit', 'clear']);

/* 검색폼: 설비코드만 */
const search = ref({
    equipment_id: ''
});

/* 조회 버튼 */
function onSubmit() {
    if (!search.value.equipment_id?.trim()) {
        alert('설비코드를 선택하세요.');
        return;
    }
    emit('submit', { ...search.value });
}

/* 초기화 */
function onClear() {
    search.value = { equipment_id: '' };
    emit('clear');
}

/* ===== 돋보기 모달 (모달 내부에만 페이지네이션) ===== */
const showPicker = ref(false);
const picker = {
    page: ref(1),
    size: 5, // 한 페이지 6개 (원하면 바꿔도 됨)
    total: ref(0),
    list: ref([]),
    selected: ref('') // 라디오 선택값
};

async function openPicker() {
    picker.selected.value = search.value.equipment_id || '';
    await fetchPage(1);
    showPicker.value = true;
}

async function fetchPage(p) {
    picker.page.value = p;
    try {
        const { data } = await axios.get('/api/equipment/info2/distinct', {
            params: { field: 'equipment_id', page: p, size: picker.size }
        });
        picker.list.value = data?.items ?? [];
        picker.total.value = data?.total ?? picker.list.value.length;
    } catch (e) {
        console.error(e);
        picker.list.value = [];
        picker.total.value = 0;
    }
}

function selectComplete() {
    if (!picker.selected.value) {
        alert('선택할 설비코드를 고르세요.');
        return;
    }
    search.value.equipment_id = picker.selected.value; // 입력칸만 채움(자동조회 X)
    showPicker.value = false;
}


</script>

<template>
    <!-- 조회 헤더 (그대로 유지) -->
    <div class="flex items-center justify-between mb-2">
        <div class="font-bold text-[18.5px]">조회</div>
        <div class="flex gap-2">
            <Button label="조회" rounded @click="onSubmit" />
            <Button label="초기화" severity="info" rounded @click="onClear" />
        </div>
    </div>

    <!-- 검색폼: 설비코드만 (약간 넓게 + 테두리 컴팩트) -->
    <div class="inline-flex items-center gap-2 border rounded-md p-2 bg-white">
        <label class="whitespace-nowrap">설비코드</label>
        <IconField iconPosition="left" class="w-80">
            <InputText v-model="search.equipment_id" class="w-full" readonly />
            <InputIcon class="pi pi-search cursor-pointer" @click="openPicker" />
        </IconField>
    </div>

    <!-- 모달: 라디오 + 페이지네이션(모달 내부만) + 중앙 선택완료 -->
    <Dialog v-model:visible="showPicker" header="설비코드 선택" :modal="true" :style="{ width: '30rem' }">
        <!-- 리스트 -->
        <ul class="divide-y">
            <li v-for="(code, idx) in picker.list.value" :key="idx" class="p-2 flex items-center gap-3 cursor-pointer" @click="picker.selected.value = code">
                <RadioButton :inputId="`eq_${idx}`" name="eq_pick" :value="code" v-model="picker.selected.value" />
                <label :for="`eq_${idx}`" class="truncate">{{ code }}</label>
            </li>

            <li v-if="picker.list.value.length === 0" class="p-4 text-center text-gray-500">항목 없음</li>
        </ul>

        <!-- 하단 컨트롤: 선택완료(정중앙, 14px) + 페이지네이션(오른쪽, 14px) -->
        <div class="relative mt-3 min-h-[42px]">
            <!-- 중앙 버튼 -->
            <div class="absolute left-1/2 -translate-x-1/2">
                <Button label="선택완료" class="text-[14px]" @click="selectComplete" />
            </div>

            <!-- 오른쪽 페이지네이션 -->
            <div class="flex items-center gap-2 justify-end text-[14px]">
                <Button label="이전" text @click="fetchPage(picker.page.value - 1)" :disabled="picker.page.value <= 1" />
                <span>{{ picker.page.value }} / {{ Math.max(1, Math.ceil(picker.total.value / picker.size)) }}</span>
                <Button label="다음" text @click="fetchPage(picker.page.value + 1)" :disabled="picker.page.value * picker.size >= picker.total.value" />
            </div>
        </div>
    </Dialog>
</template>
