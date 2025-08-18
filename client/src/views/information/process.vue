<script setup>
import { ref, onUnmounted } from 'vue';
import processSearchWidget from '@/components/information/process/processSearchWidget.vue';
import processListWidget from '@/components/information/process/processListWidget.vue';
import processRegistWidget from '@/components/information/process/processRegistWidget.vue';

const processSelectedData = ref([]);

const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const processSearchData = ref(
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
        processId: item.process_id,
        processName: item.process_name,
        isInspection: item.is_inspection,
        status: item.status
    }));

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            processId: '\u00A0',
            processName: '\u00A0',
            isInspection: '\u00A0',
            status: '\u00A0'
        });
    }

    processSearchData.value = mapped;
};

const handleSelect = (row) => {
    processSelectedData.value = [
        {
            processId: row.processId,
            processName: row.processName,
            isInspection: row.isInspection,
            status: row.status
        }
    ];
    console.log(processSelectedData);
};

onUnmounted(() => {
    console.log('process.vue unmounted!');
});
</script>

<template>
    <section class="process-container">
        <processSearchWidget @processFilterSearch="handleSearch" />
        <processListWidget :items="processSearchData" @processSelected="handleSelect" />
        <processRegistWidget :items="processSelectedData" />
    </section>
</template>
