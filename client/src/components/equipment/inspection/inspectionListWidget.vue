<script setup>
import { ref, watch } from 'vue';
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
    params: { type: Object, default: () => ({ page: 1, size: 20 }) }
});
const emit = defineEmits(['loaded']);

const rows = ref([]);

async function fetchSimple(page, size) {
    const { data } = await axios.get('/api/equipment/inspection', { params: { page, size } });
    rows.value = Array.isArray(data) ? data : [];
    emit('loaded', rows.value);
}

async function fetchSearch(p) {
    const { data } = await axios.get('/api/equipment/inspection/search', { params: p });
    rows.value = Array.isArray(data) ? data : [];
    emit('loaded', rows.value);
}

watch(
    () => props.params,
    (p) => {
        const hasFilter = ['eq_id', 'insp_type', 'date_from', 'date_to', 'next_from', 'next_to'].some((k) => p && p[k]); // ← next_from/next_to 추가
        if (hasFilter) fetchSearch(p);
        else fetchSimple(p.page || 1, p.size || 20);
    },
    { immediate: true, deep: true }
);
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
                    <td colspan="9" class="h-16 text-center text-gray-500">데이터가 없습니다.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
