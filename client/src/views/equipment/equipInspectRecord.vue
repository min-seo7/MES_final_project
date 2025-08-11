<script setup>
import { ref } from 'vue';
import InspectionSearch2Widget from '@/components/equipment/inspection/inspectionSearch2Widget.vue';

/* 더미 5건 */
const all = ref([
    { eq_id: 'EQ-001', insp_type: '정기점검', insp_date: '2025-07-29', insp_code: 'N-001', insp_item: '벨트', insp_result: '합격', note: '소음 약간', manager: '김OO' },
    { eq_id: 'EQ-002', insp_type: '상시점검', insp_date: '2025-07-29', insp_code: 'N-002', insp_item: '모터', insp_result: '보통', note: '-', manager: '이OO' },
    { eq_id: 'EQ-003', insp_type: '자체점검', insp_date: '2025-07-28', insp_code: 'N-003', insp_item: '축', insp_result: '합격', note: '장력 조정', manager: '박OO' },
    { eq_id: 'EQ-004', insp_type: '요청점검', insp_date: '2025-07-27', insp_code: 'N-004', insp_item: '베어링', insp_result: '주의', note: '교체 예정', manager: '최OO' },
    { eq_id: 'EQ-005', insp_type: '정기점검', insp_date: '2025-07-26', insp_code: 'N-005', insp_item: '체인', insp_result: '양호', note: '이상 없음', manager: '정OO' }
]);

const rows = ref([...all.value]); // 현재 목록
const pickerData = all.value; // 위젯 돋보기 원천

function toYmd(d) {
    if (!d) return '';
    return typeof d === 'string' ? d : new Date(d).toISOString().slice(0, 10);
}

function handleSubmit(q) {
    const qDate = q.insp_date ? toYmd(q.insp_date) : '';
    rows.value = all.value.filter((r) => (!q.insp_code || r.insp_code.includes(q.insp_code)) && (!q.eq_id || r.eq_id.includes(q.eq_id)) && (!q.insp_type || r.insp_type.includes(q.insp_type)) && (!qDate || r.insp_date === qDate));
}
function handleClear() {
    rows.value = [...all.value];
}
</script>

<template>
    <section class="p-4 space-y-4">
        <!-- 조회 폼 -->
        <InspectionSearch2Widget :pickerData="pickerData" @submit="handleSubmit" @clear="handleClear" />

        <!--  목록 라벨을 바깥으로 분리 -->
        <div class="font-bold text-[18.5px] mt-6">이력</div>

        <!-- 테이블 박스 -->
        <div class="border rounded-md bg-white overflow-hidden">
            <table class="w-full text-[14.5px]">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left w-16">No</th>
                        <th class="px-4 py-3 text-left">점검일</th>
                        <th class="px-4 py-3 text-left">점검유형</th>
                        <th class="px-4 py-3 text-left">점검항목</th>
                        <th class="px-4 py-3 text-left">점검결과</th>
                        <th class="px-4 py-3 text-left">비고</th>
                        <th class="px-4 py-3 text-left">점검코드</th>
                        <th class="px-4 py-3 text-left">점검책임자</th>
                        <th class="px-4 py-3 text-left">설비코드</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(r, i) in rows" :key="r.insp_code + i" class="border-t">
                        <td class="px-4 py-2">{{ i + 1 }}</td>
                        <td class="px-4 py-2">{{ r.insp_date }}</td>
                        <td class="px-4 py-2">{{ r.insp_type }}</td>
                        <td class="px-4 py-2">{{ r.insp_item }}</td>
                        <td class="px-4 py-2">{{ r.insp_result }}</td>
                        <td class="px-4 py-2">{{ r.note }}</td>
                        <td class="px-4 py-2">{{ r.insp_code }}</td>
                        <td class="px-4 py-2">{{ r.manager }}</td>
                        <td class="px-4 py-2">{{ r.eq_id }}</td>
                    </tr>
                    <tr v-if="rows.length === 0" class="border-t">
                        <td colspan="9" class="px-4 py-8 text-center text-gray-500">데이터 없음</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
