<script setup>
import { ref, onUnmounted } from 'vue';
import materialSearchWidget from '@/components/information/material/materialSearchWidget.vue';
import materialListWidget from '@/components/information/material/materialListWidget.vue';
import materialRegistWidget from '@/components/information/material/materialRegistWidget.vue';

const materialSelectedData = ref([]);

const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const materialSearchData = ref(
    Array(rowsPerPage).fill({
        num: '\u00A0',
        materialId: '\u00A0',
        materialName: '\u00A0',
        materialType: '\u00A0',
        specification: '\u00A0',
        storageCondition: '\u00A0',
        safetyStock: '\u00A0',
        status: '\u00A0'
    })
);

const handleSearch = (result) => {
    const mapped = result.map((item, index) => ({
        num: index + 1,
        materialId: item.material_id,
        materialName: item.material_name,
        materialType: item.material_type,
        specification: item.specification + item.unit,
        storageCondition: item.storage_condition,
        safetyStock: item.safety_stock + item.safety_stock_unit,
        status: item.status
    }));

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            materialId: '\u00A0',
            materialName: '\u00A0',
            materialType: '\u00A0',
            specification: '\u00A0',
            storageCondition: '\u00A0',
            safetyStock: '\u00A0',
            status: '\u00A0'
        });
    }

    materialSearchData.value = mapped;
};

const handleSelect = (row) => {
    materialSelectedData.value = [
        {
            materialId: row.materialId,
            materialName: row.materialName,
            materialType: row.materialType,
            storageCondition: row.storageCondition,
            specification: row.specification,
            safetyStock: row.safetyStock,
            status: row.status
        }
    ];
    console.log(materialSelectedData);
};

onUnmounted(() => {
    console.log('material.vue unmounted!');
});
</script>

<template>
    <section class="material-container">
        <materialSearchWidget @materialFilterSearch="handleSearch" />
        <materialListWidget :items="materialSearchData" @materialSelected="handleSelect" />
        <materialRegistWidget :items="materialSelectedData" />
    </section>
</template>
