<script setup>
import { ref } from 'vue';
import InspectionSearch3Widget from '@/components/equipment/inspection/inspectionSearch3Widget.vue';
import InspectionListWidget from '@/components/equipment/inspection/inspectionListWidget.vue';

const params = ref({ page: 1, size: 20 });
const pickerData = ref([]);

function fmtDate(d) {
    if (!d) return null;
    const date = typeof d === 'string' ? new Date(d) : d;
    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`; // 항상 YYYY-MM-DD 형식으로 변환
}

function handleSearch(q) {
    params.value = {
        insp_code: q.insp_code || null,
        eq_id: q.eq_id || null,
        insp_type: q.insp_type || null,
        date_from: fmtDate(q.insp_date),
        date_to: fmtDate(q.insp_date),
        next_from: fmtDate(q.next_date),
        next_to: fmtDate(q.next_date),
        page: 1,
        size: 20
    };
}

function handleClear() {
    params.value = { page: 1, size: 20 };
}

function handleLoaded(rows) {
    pickerData.value = (rows || []).map((r) => ({
        insp_code: r.inspCode,
        eq_id: r.eqId,
        insp_type: r.inspType,
        insp_date: r.inspDate,
        next_date: r.nextDate
    }));
}
</script>

<template>
    <section class="space-y-6 p-4">
        <InspectionSearch3Widget :pickerData="pickerData" @submit="handleSearch" @clear="handleClear" />

        <div class="font-bold text-[17px] mt-6">목록</div>
        <InspectionListWidget :params="params" @loaded="handleLoaded" />
    </section>
</template>
