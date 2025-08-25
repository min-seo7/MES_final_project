<script setup>
import { ref } from 'vue'
import DowntimeSearchWidget from '@/components/equipment/downtime/downtimeSearchWidget.vue'
import DowntimeListWidget from '@/components/equipment/downtime/downtimeListWidget.vue'
import DowntimeRegistWidget from '@/components/equipment/downtime/downtimeRegistWidget.vue'

/* ===== 상태 ===== */
const searchParams = ref({ page: 1, size: 10 }) // 검색 조건
const selectedRow = ref(null)                  // 리스트에서 클릭한 row
const registRef = ref(null)

/* ===== 검색 실행 ===== */
function handleSearch(params) {
  searchParams.value = { ...params, page: 1, size: 10 }
}

/* ===== 검색 초기화 ===== */
function handleClear() {
  searchParams.value = { page: 1, size: 10 }
}

/* ===== 리스트에서 row 선택 시 → 등록/수정폼으로 바인딩 ===== */
function handlePick(row) {
  selectedRow.value = row
  registRef.value?.load(row)
}

/* ===== 등록 성공 → 리스트 리프레시 ===== */
function handleSaved() {
  searchParams.value = { ...searchParams.value } // watch 트리거
}

/* ===== 수정 성공 → 리스트 리프레시 ===== */
function handleUpdated() {
  searchParams.value = { ...searchParams.value }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 검색 -->
    <DowntimeSearchWidget @submit="handleSearch" @clear="handleClear" />

    <!-- 메인 그리드 -->
    <div class="grid grid-cols-[3fr_1fr] gap-6 items-start">
      <!-- 좌측: 목록 (위젯 안에 이미 '목록' 텍스트 있음) -->
      <DowntimeListWidget :params="searchParams" @pick="handlePick" />

      <!-- 우측: 등록/수정 (위젯 안에 '비가동 등록/수정' 있음) -->
      <DowntimeRegistWidget
        ref="registRef"
        v-model="selectedRow"
        @saved="handleSaved"
        @updated="handleUpdated"
        @reset="selectedRow = null"
      />
    </div>
  </div>
</template>
