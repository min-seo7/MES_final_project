<script setup>
import warehouseSearchWidget from '@/components/information/warehouse/warehouseSearchWidget.vue';
import warehouseListWidget from '@/components/information/warehouse/warehouseListWidget.vue';
import warehouseRegistWidget from '@/components/information/warehouse/warehouseRegistWidget.vue';

import { ref, onUnmounted } from 'vue';

const warehouseSelectedData = ref([]);

const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const warehouseSearchData = ref(
    Array(rowsPerPage).fill({
        num: '\u00A0',
        warehouseId: '\u00A0',
        warehouse: '\u00A0',
        zone: '\u00A0',
        subZone: '\u00A0',
        floor: '\u00A0',
        location: '\u00A0',
        warehouseType: '\u00A0',
        status: '\u00A0'
    })
);
const handleSearch = (result) => {
    const mapped = result.map((item, index) => ({
        num: index + 1,
        warehouseId: item.warehouse_id,
        warehouse: item.warehouse,
        zone: item.zone,
        subZone: item.sub_zone,
        floor: item.floor,
        location: item.location,
        warehouseType: item.warehouse_type,
        status: item.status
    }));

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            warehouseId: '\u00A0',
            warehouse: '\u00A0',
            zone: '\u00A0',
            subZone: '\u00A0',
            floor: '\u00A0',
            location: '\u00A0',
            warehouseType: '\u00A0',
            status: '\u00A0'
        });
    }

    warehouseSearchData.value = mapped;
};

const handleSelect = (row) => {
    warehouseSelectedData.value = [
        {
            warehouseId: row.warehouseId,
            warehouse: row.warehouse,
            zone: row.zone,
            subZone: row.subZone,
            floor: row.floor,
            location: row.location,
            warehouseType: row.warehouseType,
            status: row.status
        }
    ];
    console.log(warehouseSelectedData);
};

onUnmounted(() => {
    console.log('warehouse.vue unmounted!');
});
</script>

<template>
    <section class="warehouse-container">
        <warehouseSearchWidget @warehouseFilterSearch="handleSearch" />
        <warehouseListWidget :items="warehouseSearchData" @warehouseSelected="handleSelect" />
        <warehouseRegistWidget :items="warehouseSelectedData" />
    </section>
</template>
