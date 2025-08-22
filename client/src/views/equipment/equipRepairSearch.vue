<!-- src/pages/equipment/RepairListPage.vue -->
<script setup>
import { ref } from 'vue';
import repairSearchWidget from '@/components/equipment/repair/repairSearchWidget.vue';
import repairListWidget from '@/components/equipment/repair/repairListWidget.vue';

const searchParams = ref({ page: 1, size: 10 });

const handleSearch = (q) => {
    // q = { repair_id: '...' }
    searchParams.value = { ...q, page: 1, size: 10 };
};
const handleClear = () => {
    searchParams.value = { page: 1, size: 10 };
};
const handleLoaded = (rows) => {
    console.log('조회된 행 개수:', rows.length);
};
</script>

<template>
    <div class="space-y-4">
        <repairSearchWidget @submit="handleSearch" @clear="handleClear" />
        <repairListWidget :params="searchParams" @loaded="handleLoaded" />
    </div>
</template>
