<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import EquipmentSearchWidget from '@/components/equipment/information/equipmentSearchWidget.vue';
import EquipmentRegistWidget from '@/components/equipment/information/equipmentRegistWidget.vue';

const registRef = ref();
const list = ref([]);
const total = ref(0);

/* 🔹 돋보기 데이터 소스 */
const pickerCache = ref([]);
const pickerData = computed(() => (list.value?.length ? list.value : pickerCache.value));

/* 최초 진입 시 돋보기 데이터 프리로드 */
onMounted(async () => {
    try {
        const { data } = await axios.get('/api/information/equipment/search', {
            params: { page: 1, size: 200 }
        });
        pickerCache.value = data.items ?? [];
    } catch (e) {
        console.error('picker preload failed:', e);
    }
});

/* 조회 */
async function handleSearch(q) {
    try {
        const { data } = await axios.get('/api/information/equipment/search', { params: q });
        list.value = data.items ?? [];
        total.value = data.total ?? 0;
    } catch (e) {
        console.error('search failed:', e);
    }
}

/* 초기화 */
function handleClear() {
    list.value = [];
    total.value = 0;
}

/* 목록 클릭 → 폼 로드 */
function handleRowSelect({ data: row }) {
    registRef.value?.load(row.eq_id);
}

/* 등록/수정 위젯 초기화 */
function handleReset() {
    registRef.value?.reset();
}
</script>

<template>
    <EquipmentSearchWidget :pickerData="pickerData" @submit="handleSearch" @clear="handleClear" />

    <DataTable :value="list" selectionMode="single" @rowSelect="handleRowSelect">
        <!-- 컬럼 정의 -->
    </DataTable>

    <EquipmentRegistWidget ref="registRef" @reset="handleReset" />
</template>
