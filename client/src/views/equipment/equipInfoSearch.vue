<script setup>
import { ref } from 'vue';
import EquipmentSearchWidget from '@/components/equipment/information/equipmentSearchWidget.vue';
import EquipmentListWidget from '@/components/equipment/information/equipmentListWidget.vue';

/* ---- 돋보기/조회 공용 세트 데이터 ---- */
const pickerData = [
  { eq_id: 'EQ-001', eq_type: '혼합기',  eq_name: '리본 블렌더',   loc: 'A동-1라인' },
  { eq_id: 'EQ-002', eq_type: '분쇄기',  eq_name: '해머 밀',       loc: 'A동-2라인' },
  { eq_id: 'EQ-003', eq_type: '포장기',  eq_name: '자동 포장기',   loc: 'B동-1라인' },
  { eq_id: 'EQ-004', eq_type: '컨베이어', eq_name: '체인 컨베이어', loc: 'B동-2라인' },
  { eq_id: 'EQ-005', eq_type: '건조기',  eq_name: '로터리 건조기', loc: 'C동-1라인' }
];

/* ---- 목록 전체 데이터(화면 확인용 더미) ---- */
const allRows = ref([
  { eq_id:'EQ-001', eq_type:'혼합기',   eq_name:'리본 블렌더',   manufacturer:'○○산업', serial:'MX2021-0782-KR', in_date:'2022-01-11', start_date:'2022-02-01', loc:'A동-1라인', status:'사용' },
  { eq_id:'EQ-002', eq_type:'분쇄기',   eq_name:'해머 밀',       manufacturer:'○○설비', serial:'MX2021-0115-CN', in_date:'2022-01-11', start_date:'2022-01-27', loc:'A동-2라인', status:'사용' },
  { eq_id:'EQ-003', eq_type:'포장기',   eq_name:'자동 포장기',   manufacturer:'○○산업', serial:'MX2023-0814-KR', in_date:'2023-07-03', start_date:'2023-08-01', loc:'B동-1라인', status:'미사용' },
  { eq_id:'EQ-004', eq_type:'컨베이어', eq_name:'체인 컨베이어', manufacturer:'△△기계', serial:'CV2020-0042-JP', in_date:'2021-10-12', start_date:'2021-11-01', loc:'B동-2라인', status:'사용' },
  { eq_id:'EQ-005', eq_type:'건조기',   eq_name:'로터리 건조기', manufacturer:'□□테크', serial:'DR2022-0917-US', in_date:'2022-09-20', start_date:'2022-10-02', loc:'C동-1라인', status:'사용' },
]);

/* ---- 현재 화면에 보여줄 목록 ---- */
const rows = ref([...allRows.value]);

/* ---- 조건검색 / 초기화 / 전체검색 ---- */
function handleSearch(params) {
  const { eq_id, eq_type, eq_name, loc, status } = params;
  rows.value = allRows.value.filter(r => {
    const f1 = eq_id   ? r.eq_id.includes(eq_id)     : true;
    const f2 = eq_type ? r.eq_type.includes(eq_type) : true;
    const f3 = eq_name ? r.eq_name.includes(eq_name) : true;
    const f4 = loc     ? r.loc.includes(loc)         : true;
    const f5 = status  ? r.status === status         : true;
    return f1 && f2 && f3 && f4 && f5;
  });
}
function handleClear() {
  rows.value = [...allRows.value]; // 검색폼 초기화 시 전체보기
}
function showAll() {
  rows.value = [...allRows.value]; // 전체검색 버튼
}
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- 상단 조회(위젯: 모달 포함 자체 처리) -->
    <EquipmentSearchWidget
      :pickerData="pickerData"
      @submit="handleSearch"
      @clear="handleClear"
    />

    <!-- 목록 우측: 전체검색 버튼 -->
    <div class="flex items-center justify-end">
      <Button label="전체검색" outlined rounded @click="showAll" />
    </div>

    <!-- 목록 -->
    <EquipmentListWidget :items="rows" />
    
  </div>
  
</template>
