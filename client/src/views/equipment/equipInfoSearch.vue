<script setup>
import { ref } from 'vue';
import EquipmentSearchWidget from '@/components/equipment/information/equipmentSearchWidget2.vue';
import EquipmentListWidget from '@/components/equipment/information/equipmentListWidget.vue';

const params = ref({ page: 1, size: 10 }); // 진입 즉시 10건
const pickerData = ref([]);

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
    // 모달 fallback용 백업
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
