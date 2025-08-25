<script setup>
import { ref } from 'vue'
import axios from 'axios'
import RepairRegistWidget from '@/components/equipment/repair/repairRegistWidget.vue'
import RepairSearchWidget from '@/components/equipment/repair/repairSearchWidget.vue'

const form = ref({
  equipmentCode: '',
  repairCode: '',
  faultDate: null,
  restartDate: null,
  repairStartDate: null,
  repairEndDate: null,
  manager: '',
  repairReason: '',
  status: '대기',
  details: [{ item: '', result: '', action: '' }]
})

const isEdit = ref(false)

/* ===== 조회 버튼 → 단건 조회 후 폼 바인딩 ===== */
async function handleSearch(q) {
  try {
    const { data } = await axios.get('/api/equipment/repair/find-one', { params: q })
    if (!data) {
      alert('검색 결과가 없습니다.')
      return
    }
    // 바인딩
    form.value = {
      equipmentCode: data.equipmentCode || '',
      repairCode: data.repairCode || '',
      faultDate: data.faultDate || null,           // 'YYYY-MM-DDTHH:MM' 형태
      restartDate: data.restartDate || null,       // 'YYYY-MM-DDTHH:MM' 형태(없으면 null)
      repairStartDate: data.repairStartDate || null, // 'YYYY-MM-DD'
      repairEndDate: data.repairEndDate || null,     // 'YYYY-MM-DD'
      manager: data.manager || '',
      repairReason: data.repairReason || '',
      status: data.status || '대기',
      details: Array.isArray(data.details) && data.details.length
        ? data.details
        : [{ item: '', result: '', action: '' }]
    }
    // 바인딩 시 수정모드로 전환 → 등록 버튼 비활성화
    isEdit.value = true
  } catch (err) {
    console.error(err)
    alert('조회 중 오류가 발생했습니다.')
  }
}

/* ===== 검색폼 초기화 → 신규 등록모드 ===== */
function handleClear() {
  form.value = {
    equipmentCode: '',
    repairCode: '',
    faultDate: null,
    restartDate: null,
    repairStartDate: null,
    repairEndDate: null,
    manager: '',
    repairReason: '',
    status: '대기',
    details: [{ item: '', result: '', action: '' }]
  }
  isEdit.value = false
}
</script>

<template>
  <div class="p-4 space-y-6">
    <!-- ✅ 검색 위젯 이벤트 연결 -->
    <RepairSearchWidget @submit="handleSearch" @clear="handleClear" />

    <!-- ✅ 바인딩되면 isEdit=true → 등록 버튼 비활성화(이미 위젯에 구현되어 있음) -->
    <RepairRegistWidget v-model="form" :isEdit="isEdit" />
  </div>
</template>
