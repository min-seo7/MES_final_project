<script setup>
import { ref, onUnmounted } from 'vue';
import materialSearchWidget from '@/components/information/material/materialSearchWidget.vue';
import materialListWidget from '@/components/information/material/materialListWidget.vue';
import materialRegistWidget from '@/components/information/material/materialRegistWidget.vue';

const materialSearchData = ref([]);

const handleSearch = (result) => {
    materialSearchData.value = result.map((item, index) => ({
        num: index + 1,
        materialId: item.material_id,
        materialName: item.material_name,
        materialType: item.material_type,
        specification: item.specification + item.unit,
        storageCondition: item.storage_condition,
        safetyStock: item.safety_stock + item.safety_stock_unit,
        status: item.status
    }));
};

onUnmounted(() => {
    console.log('material.vue unmounted!');
});
</script>

<template>
    <section class="material-container">
        <materialSearchWidget @materialFilterSearch="handleSearch" />
        <materialListWidget :items="materialSearchData"/>
        <materialRegistWidget />
    </section>
</template>
