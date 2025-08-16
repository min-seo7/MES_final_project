<script setup>
import warehouseSearchWidget from '@/components/information/warehouse/warehouseSearchWidget.vue';
import warehouseListWidget from '@/components/information/warehouse/warehouseListWidget.vue';
import warehouseRegistWidget from '@/components/information/warehouse/warehouseRegistWidget.vue';

import { ref, onUnmounted } from 'vue';

const warehouseSearchData = ref([]);


const handleSearch = (result) => {
    warehouseSearchData.value = result.map((item, index) => ({
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
};
onUnmounted(() => {
    console.log('warehouse.vue unmounted!');
});
</script>

<template>
    <section class="warehouse-container">
        <warehouseSearchWidget @warehouseFilterSearch="handleSearch"/>
        <warehouseListWidget :items="warehouseSearchData"/>
        <warehouseRegistWidget />
    </section>
</template>
