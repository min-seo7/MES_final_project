<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';

function formatDate(val) {
  if (!val) return '';
  return new Date(val).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

const props = defineProps({
  params: { type: Object, default: () => ({ page: 1, size: 5 }) }
});
const emit = defineEmits(['loaded']);

const rows = ref([]);
const total = ref(0);
const page = ref(1);
const size = ref(5);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / size.value))
);

/* 단순 조회 */
async function fetchSimple(p, s) {
  const { data } = await axios.get('/api/equipment/inspection', {
    params: { page: p, size: s }
  });
  rows.value = Array.isArray(data?.items) ? data.items : data; // items 있으면 items, 없으면 배열
  total.value = data?.total ?? rows.value.length;
  page.value = p;
  size.value = s;
  emit('loaded', rows.value);
}

/* 조건 검색 */
async function fetchSearch(p) {
  const { data } = await axios.get('/api/equipment/inspection/search', {
    params: { ...p }
  });
  rows.value = Array.isArray(data?.items) ? data.items : data;
  total.value = data?.total ?? rows.value.length;
  page.value = p.page || 1;
  size.value = p.size || 5;
  emit('loaded', rows.value);
}

/* 파라미터 감시 */
watch(
  () => props.params,
  (p) => {
    const hasFilter = [
      'insp_code',
      'eq_id',
      'insp_type',
      'date_from',
      'date_to',
      'next_from',
      'next_to'
    ].some((k) => p && p[k]);
    if (hasFilter) fetchSearch({ ...p, page: p.page || 1, size: p.size || 5 });
    else fetchSimple(p.page || 1, p.size || 5);
  },
  { immediate: true, deep: true }
);

function prev() {
  if (page.value > 1) goto(page.value - 1);
}
function next() {
  if (page.value < totalPages.value) goto(page.value + 1);
}
function goto(p) {
  const hasFilter = [
    'insp_code',
    'eq_id',
    'insp_type',
    'date_from',
    'date_to',
    'next_from',
    'next_to'
  ].some((k) => props.params && props.params[k]);
  if (hasFilter) fetchSearch({ ...props.params, page: p, size: size.value });
  else fetchSimple(p, size.value);
}
</script>

<template>
  <div class="border rounded-md bg-white overflow-hidden">
    <table class="w-full table-fixed border-t border-gray-200">
      <thead class="bg-gray-50 text-[14px]">
        <tr>
          <th class="h-11 text-left pl-4 border-b">점검코드</th>
          <th class="text-left border-b">설비코드</th>
          <th class="text-left border-b">점검유형</th>
          <th class="text-left border-b">점검일</th>
          <th class="text-left border-b">점검예정일</th>
          <th class="text-left border-b">점검주기</th>
          <th class="text-left border-b">최근점검결과</th>
          <th class="text-left border-b">점검책임자</th>
          <th class="text-left pr-4 border-b">비고</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i">
          <td class="h-11 pl-4 border-b">{{ row.inspCode }}</td>
          <td class="border-b">{{ row.eqId }}</td>
          <td class="border-b">{{ row.inspType }}</td>
          <td class="border-b">{{ formatDate(row.inspDate) }}</td>
          <td class="border-b">{{ formatDate(row.nextDate) }}</td>
          <td class="border-b">{{ row.cycle }}</td>
          <td class="border-b">{{ row.lastResult }}</td>
          <td class="border-b">{{ row.manager }}</td>
          <td class="border-b pr-4 truncate" :title="row.note">{{ row.note }}</td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="9" class="h-16 text-center text-gray-500">
            데이터가 없습니다.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ✅ 페이지네이션 -->
    <div class="flex items-center justify-center gap-6 px-4 py-3 border-t bg-white">
      <Button label="이전" :disabled="page === 1" @click="prev" />
      <span>{{ page }} / {{ totalPages }}</span>
      <Button label="다음" :disabled="page >= totalPages" @click="next" />
    </div>
  </div>
</template>
