<!-- src/views/equipment/equipmentView.vue -->
<script setup>
import { ref } from 'vue';
import EquipmentSearchWidget from '@/components/equipment/information/equipmentSearchWidget2.vue';
import EquipmentListWidget from '@/components/equipment/information/equipmentListWidget.vue';

const params = ref({ page: 1, size: 10 }); // 조회 조건
const pickerData = ref([]); // SearchWidget에 내려줄 distinct 후보 데이터

function handleSearch(q) {
    params.value = {
        equipment_id: q.equipment_id || null,
        equipment_type: q.equipment_type || null,
        equipment_name: q.equipment_name || null,
        location: q.location || null,
        status: q.status || null,
        page: 1,
        size: 10
    };
}
function handleClear() {
    params.value = { page: 1, size: 10 };
}

function handleLoaded(rows) {
    // 목록 데이터를 기반으로 SearchWidget fallback 데이터 구성
    pickerData.value = (rows || []).map((r) => ({
        equipment_id: r.eq_id,
        equipment_type: r.eq_type,
        equipment_name: r.eq_name,
        location: r.loc,
        status: r.status
    }));
}
</script>

<template>
    <section class="space-y-6 p-4">
        <EquipmentSearchWidget :pickerData="pickerData" @submit="handleSearch" @clear="handleClear" />
        <div class="font-bold text-[17px] mt-6">목록</div>
        <EquipmentListWidget :params="params" @loaded="handleLoaded" />
    </section>
</template>
