<script setup>
import { ref, watch, computed } from "vue";
import axios from "axios";

const props = defineProps({
  // ✅ 기본 size 10으로 변경
  params: { type: Object, default: () => ({ page: 1, size: 10 }) },
});
const emit = defineEmits(["loaded"]);

const rows = ref([]);
const page = ref(1);
// ✅ 초기 size도 10으로 변경
const size = ref(10);
const total = ref(0);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(Number(total.value || 0) / Number(size.value || 10)))
);

const fmt = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ✅ 필터 정리
function buildFilter(p = {}) {
  const nn = (v) => {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s.length ? s : null;
  };
  return {
    repair_id: nn(p.repair_id),
    eq_id: nn(p.eq_id),
    status: nn(p.status),
    date_from: nn(p.date_from),
    date_to: nn(p.date_to),
  };
}

// 단순 조회
async function fetchSimple(p, s) {
  const { data } = await axios.get("/api/equipment/repair/list", {
    params: { page: p, size: s },
  });
  rows.value = Array.isArray(data?.items) ? data.items : [];
  total.value = Number(data?.total || 0);
  page.value = Number(data?.page || p);
  size.value = Number(data?.size || s);
  emit("loaded", rows.value);
}

// 조건 검색
async function fetchSearch(p, s) {
  const { data } = await axios.get("/api/equipment/repair/list", {
    params: { ...buildFilter(props.params), page: p, size: s },
  });
  rows.value = Array.isArray(data?.items) ? data.items : [];
  total.value = Number(data?.total || 0);
  page.value = Number(data?.page || p);
  size.value = Number(data?.size || s);
  emit("loaded", rows.value);
}

// 파라미터 감시
watch(
  () => props.params,
  (p) => {
    const keys = ["repair_id", "eq_id", "status", "date_from", "date_to"];
    const hasFilter = keys.some((k) => p && p[k]);
    const pNo = Number(p?.page || 1);
    const sNo = Number(p?.size || 10); // ✅ size 10 반영
    hasFilter ? fetchSearch(pNo, sNo) : fetchSimple(pNo, sNo);
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
  const keys = ["repair_id", "eq_id", "status", "date_from", "date_to"];
  const hasFilter = keys.some((k) => props.params && props.params[k]);
  hasFilter ? fetchSearch(p, size.value) : fetchSimple(p, size.value);
}
</script>

<template>
  <div class="mt-8 space-y-4">
    <div class="flex items-center justify-between">
      <div class="font-bold text-[18.5px]">목록</div>
    </div>

    <div class="border rounded-md bg-white overflow-hidden">
      <table class="w-full table-fixed border-t border-gray-200 select-none">
        <thead class="bg-gray-50 text-[14px]">
          <tr>
            <th class="h-11 text-left pl-4 border-b">설비코드</th>
            <th class="text-left border-b">수리코드</th>
            <th class="text-left border-b">비가동일시</th>
            <th class="text-left border-b">재가동일시</th>
            <th class="text-left border-b">수리시작일</th>
            <th class="text-left border-b">수리완료일</th>
            <th class="text-left border-b">책임자</th>
            <th class="text-left border-b">수리사유</th>
            <th class="text-left border-b">항목</th>
            <th class="text-left border-b">결과</th>
            <th class="text-left border-b w-[13%] pl-2">조치사항</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <td class="h-11 pl-4 border-b">{{ r.eq_id }}</td>
            <td class="border-b">{{ r.repair_id }}</td>
            <td class="border-b">{{ fmt(r.fault_dtime) }}</td>
            <td class="border-b">{{ fmt(r.restart_dtime) }}</td>
            <td class="border-b">{{ fmt(r.start_dtime) }}</td>
            <td class="border-b">{{ fmt(r.end_dtime) }}</td>
            <td class="border-b">{{ r.repairer }}</td>
            <td class="border-b truncate">{{ r.reason }}</td>
            <td class="border-b truncate">{{ r.item }}</td>
            <td class="border-b truncate">{{ r.result }}</td>
            <td class="border-b truncate text-left pl-2">{{ r.action }}</td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="11" class="h-16 text-center text-gray-500">
              데이터가 없습니다.
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="flex items-center justify-center gap-6 px-4 py-3 border-t bg-white"
      >
        <Button label="이전" :disabled="page === 1" @click="prev" />
        <span>{{ page }} / {{ totalPages }}</span>
        <Button label="다음" :disabled="page >= totalPages" @click="next" />
      </div>
    </div>
  </div>
</template>
