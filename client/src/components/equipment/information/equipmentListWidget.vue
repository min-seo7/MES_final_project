<template>
  <DataTable
    :value="items"
    :rowHover="true"
    class="bg-white rounded-md border"
    size="small"
    :scrollable="true"
    :scrollHeight="scrollHeight"
  >
    <!-- 행 번호 -->
    <Column
      header="#"
      :body="(_, opt) => opt.rowIndex + 1"
      style="width: 60px; text-align:center"
    />

    <Column field="eq_id" header="설비코드" />
    <Column field="eq_type" header="설비유형" />
    <Column field="eq_name" header="설비명" />
    <Column field="manufacturer" header="제조사" />
    <Column field="serial" header="제조번호" />
    <Column field="in_date" header="도입일" />
    <Column field="start_date" header="사용시작일" />
    <Column field="loc" header="설비위치" />
    <Column field="status" header="설비상태" />
  </DataTable>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  items: { type: Array, default: () => [] },
  maxHeight: { type: Number, default: 520 },
  rowHeight: { type: Number, default: 42 },
  headerHeight: { type: Number, default: 56 }
});
const scrollHeight = computed(() => {
  const total = props.items.length * props.rowHeight + props.headerHeight;
  return Math.min(total, props.maxHeight) + 'px';
});
</script>

<style scoped>
/* 헤더: 위 간격 늘림 */
:deep(.p-datatable-thead > tr > th) {
  padding-top: 18px; /* 위 간격 */
  padding-bottom: 12px;
  padding-left: 18px;
  padding-right: 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  background-color: #f9fafb;
}

/* 바디 */
:deep(.p-datatable-tbody > tr > td) {
  padding: 10px 12px;
  padding-left: 18px;
  text-align: left;
}

/* 번호 컬럼 중앙정렬 */
:deep(.p-datatable-thead > tr > th:first-child),
:deep(.p-datatable-tbody > tr > td:first-child) {
  padding-left: 0;
  text-align: center;
}
</style>
