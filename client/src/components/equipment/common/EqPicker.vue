<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

/* ===== props & emit ===== */
const props = defineProps({
    visible: { type: Boolean, default: false }, // 모달 표시 여부
    size: { type: Number, default: 5 } // 페이지당 개수
});
const emit = defineEmits(['update:visible', 'selected']);

/* ===== v-model 대체용 computed ===== */
const dialogVisible = computed({
    get: () => props.visible,
    set: (v) => emit('update:visible', v)
});

/* ===== 데이터 상태 ===== */
const list = ref([]);
const page = ref(1);
const total = ref(0);
const selected = ref('');

/* ===== API 호출 ===== */
async function fetchPage(p = 1) {
    try {
        const { data } = await axios.get('/api/equipment/code-list', {
            params: { page: p, size: props.size }
        });
        list.value = data?.items ?? [];
        total.value = data?.total ?? 0;
        page.value = p;
    } catch (err) {
        console.error('설비코드 조회 실패', err);
        list.value = [];
    }
}

/* ===== 선택 완료 ===== */
function selectComplete() {
    if (!selected.value) return;
    emit('selected', selected.value);
    dialogVisible.value = false;
}
</script>

<template>
    <Dialog v-model:visible="dialogVisible" header="설비코드 선택" modal :style="{ width: '30rem' }" @show="fetchPage(1)">
        <ul class="divide-y">
            <li v-for="(eq, idx) in list" :key="eq.eq_id" class="p-2 flex items-center gap-3 cursor-pointer" @click="selected = eq.eq_id">
                <RadioButton :inputId="`eq_${idx}`" :value="eq.eq_id" v-model="selected" />
                <label :for="`eq_${idx}`">{{ eq.eq_id }} - {{ eq.eq_name }}</label>
            </li>
            <li v-if="!list.length" class="p-4 text-center text-gray-500">항목 없음</li>
        </ul>

        <!-- 모달 하단 -->
        <div class="flex items-center justify-between mt-3 text-sm">
            <Button label="이전" text @click="fetchPage(page - 1)" :disabled="page <= 1" />
            <Button label="선택완료" @click="selectComplete" />
            <Button label="다음" text @click="fetchPage(page + 1)" :disabled="page * props.size >= total" />
        </div>
    </Dialog>
</template>
