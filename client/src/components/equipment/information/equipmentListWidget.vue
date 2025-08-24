<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
    params: { type: Object, default: () => ({ page: 1, size: 10 }) }
});
const emit = defineEmits(['loaded']);

const rows = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);

const totalPages = computed(() => Math.max(1, Math.ceil(Number(total.value || 0) / Number(size.value || 10))));

function fmt(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

/* 진입/무필터: 10건 페이지 */
async function fetchSimple(p, s) {
    const { data } = await axios.get('/api/equipment/info2', { params: { page: p, size: s } });
    rows.value = Array.isArray(data?.items) ? data.items : [];
    total.value = Number(data?.total || 0);
    page.value = Number(data?.page || p);
    size.value = Number(data?.size || s);
    emit('loaded', rows.value);
}

/* 조건 검색: OR 기본 */
async function fetchSearch(p, s) {
    const { data } = await axios.get('/api/equipment/info2/search', { params: { ...props.params, page: p, size: s } });
    rows.value = Array.isArray(data?.items) ? data.items : [];
    total.value = Number(data?.total || 0);
    page.value = Number(data?.page || p);
    size.value = Number(data?.size || s);
    emit('loaded', rows.value);
}

/* 파라미터 감시 */
watch(
  () => props.params,
  (p) => {
    const has = ['equipment_id', 'equipment_type', 'equipment_name', 'location', 'status']
      .some((k) => p && p[k] != null && String(p[k]).trim() !== '');

    const pNo = Number(p?.page || 1);
    const sNo = Number(p?.size || 10);

    if (has) fetchSearch(pNo, sNo);
    else     fetchSimple(pNo, sNo);
  },
  { immediate: true, deep: true }
);

/* 리스트 페이지네이션 */
function prev() {
    if (page.value <= 1) return;
    goto(page.value - 1);
}
function next() {
    if (page.value >= totalPages.value) return;
    goto(page.value + 1);
}
function goto(p) {
    const has = ['equipment_id', 'equipment_type', 'equipment_name', 'location', 'status'].some((k) => props.params && props.params[k]);
    if (has) fetchSearch(p, size.value);
    else fetchSimple(p, size.value);
}
</script>

<template>
    <div class="border rounded-md bg-white overflow-hidden">
        <table class="w-full table-fixed border-t border-gray-200">
            <thead class="bg-gray-50 text-[14px]">
                <tr>
                    <th class="h-11 text-left pl-4 border-b">설비코드</th>
                    <th class="text-left border-b">설비유형</th>
                    <th class="text-left border-b">설비명</th>
                    <th class="text-left border-b">제조사</th>
                    <th class="text-left border-b">제조번호</th>
                    <th class="text-left border-b">도입일</th>
                    <th class="text-left border-b">사용시작일</th>
                    <th class="text-left border-b">설비위치</th>
                    <th class="text-left border-b">설비상태</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(r, i) in rows" :key="i">
                    <td class="h-11 pl-4 border-b">{{ r.eq_id }}</td>
                    <td class="border-b">{{ r.eq_type }}</td>
                    <td class="border-b">{{ r.eq_name }}</td>
                    <td class="border-b">{{ r.maker }}</td>
                    <td class="border-b">{{ r.serial }}</td>
                    <td class="border-b">{{ fmt(r.in_date) }}</td>
                    <td class="border-b">{{ fmt(r.start_date) }}</td>
                    <td class="border-b">{{ r.loc }}</td>
                    <td class="border-b">{{ r.status }}</td>
                </tr>
                <tr v-if="!rows.length">
                    <td colspan="9" class="h-16 text-center text-gray-500">데이터가 없습니다.</td>
                </tr>
            </tbody>
        </table>

        <!-- 리스트 페이지네이션: 중앙 정렬, 좌우 Prev/Next, 가운데 "page / total" -->
        <div class="flex items-center justify-center gap-6 px-4 py-3 border-t bg-white">
            <Button label="이전" :disabled="page === 1" @click="prev" />
            <span>{{ page }} / {{ totalPages }}</span>
            <Button label="다음" :disabled="page >= totalPages" @click="next" />
        </div>
    </div>
</template>
