<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const rows = ref([]);

const loadInspectionList = async () => {
    const { data } = await axios.get('/api/equipment/inspection', { params: { page: 1, size: 20 } });
    rows.value = Array.isArray(data) ? data : []; // 라우터가 배열 그대로 반환
};

onMounted(loadInspectionList);
</script>

<template>
    <div class="border rounded-md bg-white overflow-hidden">
        <div class="px-4 pt-3 pb-2 text-sm font-semibold">목록</div>
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
                    <td class="border-b">{{ row.inspDate }}</td>
                    <td class="border-b">{{ row.nextDate }}</td>
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
