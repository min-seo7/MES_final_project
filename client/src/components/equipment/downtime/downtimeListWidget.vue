<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';

/* ===== props ===== */
const props = defineProps({
  params: { type: Object, default: () => ({ page: 1, size: 10 }) }
});

/* ===== emit ===== */
const emit = defineEmits(['loaded', 'pick']);

/* ===== 상태값 ===== */
const rows = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);

/* 페이지 수 계산 */
const totalPages = computed(() => Math.max(1, Math.ceil(Number(total.value || 0) / Number(size.value || 10))));

/* 날짜 포맷 */
function fmt(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/* ===== 단순 전체 조회 ===== */
async function fetchSimple(p, s) {
  const { data } = await axios.get('/api/equipment/downtime-list', {
    params: { page: p, size: s }
  });
  rows.value = Array.isArray(data?.items) ? data.items : [];
  total.value = Number(data?.total || 0);
  page.value = Number(data?.page || p);
  size.value = Number(data?.size || s);
  emit('loaded', rows.value);
}

/* ===== 조건 검색 (eq_id 기준) ===== */
async function fetchSearch(p, s) {
  const { data } = await axios.get('/api/equipment/downtime-list', {
    params: { ...props.params, page: p, size: s }
  });
  rows.value = Array.isArray(data?.items) ? data.items : [];
  total.value = Number(data?.total || 0);
  page.value = Number(data?.page || p);
  size.value = Number(data?.size || s);
  emit('loaded', rows.value);
}

/* ===== 파라미터 감시 ===== */
watch(
  () => props.params,
  (p) => {
    const has = p && p.eq_id;
    const pNo = Number(p?.page || 1);
    const sNo = Number(p?.size || 10);
    if (has) fetchSearch(pNo, sNo);
    else fetchSimple(pNo, sNo);
  },
  { immediate: true, deep: true }
);

/* ===== 페이지네이션 ===== */
function prev() {
  if (page.value <= 1) return;
  goto(page.value - 1);
}
function next() {
  if (page.value >= totalPages.value) return;
  goto(page.value + 1);
}
function goto(p) {
  const has = props.params && props.params.eq_id;
  if (has) fetchSearch(p, size.value);
  else fetchSimple(p, size.value);
}
</script>

<template>
  <div class="space-y-2">
    <!-- 🔹 목록 제목 추가 -->
    <div class="font-bold text-[18.5px]">목록</div>

    <div class="border rounded-md bg-white overflow-hidden">
      <table class="w-full table-fixed border-t border-gray-200">
        <thead class="bg-gray-50 text-[14px]">
          <tr>
            <th class="h-11 text-left pl-4 border-b">설비코드</th>
            <th class="text-left border-b">설비명</th>
            <th class="text-left border-b">수리코드</th>
            <th class="text-left border-b">점검코드</th>
            <th class="text-left border-b">비가동유형</th>
            <th class="text-left border-b">비가동일시</th>
            <th class="text-left border-b">재가동일시</th>
            <th class="text-left border-b">비고</th>
            <th class="text-left border-b">처리상태</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(r, i) in rows"
            :key="i"
            class="cursor-pointer hover:bg-gray-100"
            @click="$emit('pick', r)"
          >
            <td class="h-11 pl-4 border-b">{{ r.eq_id }}</td>
            <td class="border-b">{{ r.eq_name }}</td>
            <td class="border-b">{{ r.repair_id }}</td>
            <td class="border-b">{{ r.inspection_id }}</td>
            <td class="border-b">{{ r.fault_type }}</td>
            <td class="border-b">{{ fmt(r.fault_dtime) }}</td>
            <td class="border-b">{{ fmt(r.restart_dtime) }}</td>
            <td class="border-b">{{ r.note }}</td>
            <td class="border-b">{{ r.status }}</td>
          </tr>

          <!-- 빈 행 고정 -->
          <tr v-for="n in (size - rows.length)" :key="'empty-'+n">
            <td colspan="9" class="h-11 border-b">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="flex items-center justify-center gap-6 px-4 py-3 border-t bg-white">
        <Button label="이전" :disabled="page === 1" @click="prev" />
        <span>{{ page }} / {{ totalPages }}</span>
        <Button label="다음" :disabled="page >= totalPages" @click="next" />
      </div>
    </div>
  </div>
</template>