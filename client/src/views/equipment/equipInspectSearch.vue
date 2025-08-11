<script setup>
import { ref } from 'vue';
import InspectionSearchWidget from '@/components/equipment/inspection/inspectionSearchWidget.vue';
import InspectionListWidget from '@/components/equipment/inspection/inspectionListWidget.vue';

/** 더미 5건 */
const raw = [
    { insp_code: 'INSP-2025-001', eq_id: 'EQ-001', insp_type: '정기점검', insp_date: '2025-07-01', next_date: '2025-08-01', cycle: '매월', last_result: '양호', manager: '김담당', note: '특이사항 없음' },
    { insp_code: 'INSP-2025-002', eq_id: 'EQ-002', insp_type: '상시점검', insp_date: '2025-07-03', next_date: '2025-07-10', cycle: '주 1회', last_result: '보통', manager: '이담당', note: '소음 증가' },
    { insp_code: 'INSP-2025-003', eq_id: 'EQ-003', insp_type: '자체점검', insp_date: '2025-07-05', next_date: '2025-08-05', cycle: '매월', last_result: '양호', manager: '박담당', note: '벨트 장력 조정' },
    { insp_code: 'INSP-2025-004', eq_id: 'EQ-004', insp_type: '요청점검', insp_date: '2025-07-08', next_date: '2025-07-22', cycle: '수시', last_result: '주의', manager: '최담당', note: '베어링 교체 예정' },
    { insp_code: 'INSP-2025-005', eq_id: 'EQ-005', insp_type: '정기점검', insp_date: '2025-07-12', next_date: '2025-08-12', cycle: '매월', last_result: '양호', manager: '정담당', note: 'OK' }
];

const items = ref([...raw]);

function fmt(d) {
    if (!d) return '';
    if (typeof d === 'string') return d;
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}

function handleSearch(q) {
    const qDate = fmt(q.insp_date);
    const qNext = fmt(q.next_date);
    items.value = raw.filter((r) => (!q.insp_code || r.insp_code === q.insp_code) && (!q.eq_id || r.eq_id === q.eq_id) && (!q.insp_type || r.insp_type === q.insp_type) && (!qDate || r.insp_date === qDate) && (!qNext || r.next_date === qNext));
}
function handleClear() {
    items.value = [...raw];
}
function onRowClick(row) {
    console.log('선택:', row);
}
</script>

<template>
    <section class="space-y-6 p-4">
        <!-- 조회 섹션 -->
        <div class="flex items-center justify-between">
            <div class="font-bold text-[17px]"></div>
        </div>
        <InspectionSearchWidget :pickerData="raw" @submit="handleSearch" @clear="handleClear" />

        <!-- 목록 섹션 (제목은 바깥 텍스트) -->
        <div class="font-bold text-[17px] mt-6">목록</div>
        <InspectionListWidget :items="items" @row-click="onRowClick" />
    </section>
</template>
