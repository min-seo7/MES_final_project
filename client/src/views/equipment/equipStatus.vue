<script setup>
import { ref } from 'vue';
import DowntimeSearchWidget from '@/components/equipment/downtime/downtimeSearchWidget.vue';
import DowntimeListWidget from '@/components/equipment/downtime/downtimeListWidget.vue';
import DowntimeRegistWidget from '@/components/equipment/downtime/downtimeRegistWidget.vue';

/* ===== 상태 ===== */
const searchParams = ref({ page: 1, size: 10 }); // 검색 조건
const selectedRow = ref(null); // 리스트에서 클릭한 row
const registRef = ref(null);

/* ===== 검색 실행 ===== */
function handleSearch(params) {
    searchParams.value = { ...params, page: 1, size: 10 };
}

/* ===== 검색 초기화 ===== */
function handleClear() {
    searchParams.value = { page: 1, size: 10 };
}

/* ===== 리스트에서 row 선택 시 → 등록/수정폼으로 바인딩 ===== */
function handlePick(row) {
    selectedRow.value = row;
    registRef.value?.load(row);
}

/* ===== 등록 성공 → 리스트 리프레시 ===== */
function handleSaved(newData) {
    console.log('등록완료', newData);
    searchParams.value = { ...searchParams.value }; // watch 다시 돌리도록 트리거
}

/* ===== 수정 성공 → 리스트 리프레시 ===== */
function handleUpdated(updData) {
    console.log('수정완료', updData);
    searchParams.value = { ...searchParams.value };
}
</script>

<template>
    <div class="space-y-8">
        <!-- 검색 -->
        <DowntimeSearchWidget @submit="handleSearch" @clear="handleClear" />

        <!-- 리스트 -->
        <DowntimeListWidget :params="searchParams" @pick="handlePick" />

        <!-- 등록/수정 -->
        <DowntimeRegistWidget ref="registRef" v-model="selectedRow" @saved="handleSaved" @updated="handleUpdated" @reset="selectedRow = null" />
    </div>
</template>
