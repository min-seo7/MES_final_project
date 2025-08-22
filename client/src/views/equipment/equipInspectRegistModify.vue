<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 위젯 임포트명 정확히
import InspectionSearchWidget from '@/components/equipment/inspection/inspectionSearchWidget.vue'
import inspectionRegistWidget from '@/components/equipment/inspection/inspectionRegistWidget.vue'

// ---- 고정 행 수
const DETAIL_ROWS = 5

// ---- 결과값 매핑(DB → UI 라디오)
const mapDbResultToUi = (v) => {
  const s = String(v ?? '').trim().toUpperCase()
  if (['양호','OK','GOOD','Y','1'].includes(s)) return '양호'
  if (['주의','WARN','WARNING','W','2'].includes(s)) return '주의'
  if (['불량','NG','BAD','N','3','FAIL'].includes(s)) return '불량'
  return '' // 라디오 미선택
}
// (필요시 DB 코드로 바꾸려면 여기서 매핑; 지금은 UI 문자열 그대로 저장)
const mapUiResultToDb = (v) => v

// ---- 유틸
const asDate = (v) => {
  if (!v) return null
  if (v instanceof Date) return v
  const d = new Date(String(v).slice(0,10))
  return isNaN(d) ? null : d
}
const fmt = (d) => {
  if (!d) return null
  if (typeof d === 'string') return d.slice(0,10)
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${dd}`
}
const padRows = (arr) => {
  const base = Array.isArray(arr) ? arr.slice(0, DETAIL_ROWS) : []
  while (base.length < DETAIL_ROWS) base.push({ item:'', result:'', action:'' })
  return base
}
const onlyFilled = (rows) =>
  (rows || []).filter(r => (r?.item?.trim()||'') || (r?.result?.trim()||'') || (r?.action?.trim()||''))

// ---- 폼
const form = ref({
  equipmentCode: '',
  inspectionCode: '',
  inspectionType: '정기점검',
  inspectionCycle: '',
  inspectionDate: null,
  nextDate: null,
  manager: '',
  note: '',
  details: padRows([])   // 화면은 항상 5행
})

const isEdit = ref(false)

/* 조회 → 단건 상세 바인딩 (행 5 고정) */
async function handleSearch(params) {
  try {
    const { data } = await axios.get('/api/equipment/inspection/find-one', {
      params: { insp_code: params.insp_code }
    })
    if (!data) { alert('조회 결과 없음'); return }

    const det = Array.isArray(data.details)
      ? data.details.map(d => ({
          item: d?.item ?? '',
          result: mapDbResultToUi(d?.result),
          action: d?.action ?? ''
        }))
      : []

    form.value = {
      equipmentCode: data.equipmentCode ?? '',
      inspectionCode: data.inspectionCode ?? params.insp_code ?? '',
      inspectionType: data.inspectionType ?? '정기점검',
      inspectionCycle: data.inspectionCycle ?? '',
      inspectionDate: asDate(data.inspectionDate),
      nextDate: asDate(data.nextDate),
      manager: data.manager ?? '',
      note: data.note ?? '',
      details: padRows(det) // ★ 5행 고정
    }
    isEdit.value = true
  } catch (e) {
    console.error(e)
    alert('조회 실패')
  }
}

/* 등록 */
async function handleSave(payload) {
  try {
    const body = {
      ...payload,
      inspectionDate: fmt(payload.inspectionDate),
      nextDate: fmt(payload.nextDate),
      // 빈 줄 제거 후 저장(DB에 공란 안쌓이게)
      details: onlyFilled(payload.details).map(r => ({ ...r, result: mapUiResultToDb(r.result) }))
    }
    await axios.post('/api/equipment/inspection/regist', body)
    alert('등록 성공')
    isEdit.value = false
  } catch (e) {
    console.error(e)
    alert(`등록 실패: ${e?.response?.data?.message || e.message}`)
  }
}

/* 수정 */
async function handleUpdate(payload) {
  try {
    const body = {
      ...payload,
      inspectionDate: fmt(payload.inspectionDate),
      nextDate: fmt(payload.nextDate),
      details: onlyFilled(payload.details).map(r => ({ ...r, result: mapUiResultToDb(r.result) }))
    }
    await axios.put('/api/equipment/inspection/update', body)
    alert('수정 성공')
    // 수정 후에도 화면은 5행 유지
    form.value.details = padRows(form.value.details)
  } catch (e) {
    console.error(e)
    alert(`수정 실패: ${e?.response?.data?.message || e.message}`)
  }
}

/* 초기화(신규 입력 모드) */
function handleReset() {
  isEdit.value = false
  form.value = {
    equipmentCode: '',
    inspectionCode: '',
    inspectionType: '정기점검',
    inspectionCycle: '',
    inspectionDate: null,
    nextDate: null,
    manager: '',
    note: '',
    details: padRows([])  // ★ 5행 고정
  }
}

/* 설비코드 돋보기 */
function openEqPicker() { /* 필요시 구현 */ }
</script>

<template>
  <div class="p-4 space-y-6">
    <InspectionSearchWidget @submit="handleSearch" />
    <inspectionRegistWidget
      v-model="form"
      :isEdit="isEdit"
      @save="handleSave"
      @update="handleUpdate"
      @reset="handleReset"
      @open:eqPicker="openEqPicker"
    />
  </div>
</template>
