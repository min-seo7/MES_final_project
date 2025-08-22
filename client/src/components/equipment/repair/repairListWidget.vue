<!-- src/components/equipment/repair/repairListWidget.vue -->
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

const fmt = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 단순 조회
const fetchSimple = async (p, s) => {
    const { data } = await axios.get('/api/equipment/repair-list', {
        params: { page: p, size: s }
    });
    rows.value = Array.isArray(data?.items) ? data.items : [];
    total.value = Number(data?.total || 0);
    page.value = Number(data?.page || p);
    size.value = Number(data?.size || s);
    emit('loaded', rows.value);
};

// 조건 검색
const fetchSearch = async (p, s) => {
    const { data } = await axios.get('/api/equipment/repair-list/search', {
        params: { ...props.params, page: p, size: s }
    });
    rows.value = Array.isArray(data?.items) ? data.items : [];
    total.value = Number(data?.total || 0);
    page.value = Number(data?.page || p);
    size.value = Number(data?.size || s);
    emit('loaded', rows.value);
};

// 파라미터 감시 (검색 키 일치)
watch(
    () => props.params,
    (p) => {
        const has = ['repair_id', 'eq_id', 'status', 'insp_code', 'date_from', 'date_to'].some((k) => p && p[k]);
        const pNo = Number(p?.page || 1);
        const sNo = Number(p?.size || 10);
        if (has) fetchSearch(pNo, sNo);
        else fetchSimple(pNo, sNo);
    },
    { immediate: true, deep: true }
);

const prev = () => {
    if (page.value > 1) goto(page.value - 1);
};
const next = () => {
    if (page.value < totalPages.value) goto(page.value + 1);
};
const goto = (p) => {
    const has = ['repair_id', 'eq_id', 'status', 'insp_code', 'date_from', 'date_to'].some((k) => props.params && props.params[k]);
    if (has) fetchSearch(p, size.value);
    else fetchSimple(p, size.value);
};
</script>

<template>
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
                    <th class="text-left border-b">조치사항</th>
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
                    <td class="border-b truncate">{{ r.action }}</td>
                </tr>
                <tr v-if="!rows.length">
                    <td colspan="11" class="h-16 text-center text-gray-500">데이터가 없습니다.</td>
                </tr>
            </tbody>
        </table>

        <div class="flex items-center justify-center gap-6 px-4 py-3 border-t bg-white">
            <Button label="이전" :disabled="page === 1" @click="prev" />
            <span>{{ page }} / {{ totalPages }}</span>
            <Button label="다음" :disabled="page >= totalPages" @click="next" />
        </div>
    </div>
</template>
