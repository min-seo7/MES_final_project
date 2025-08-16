<script setup>
import { ref, onUnmounted } from 'vue';
import processSearchWidget from '@/components/information/process/processSearchWidget.vue';
import processListWidget from '@/components/information/process/processListWidget.vue';
import processRegistWidget from '@/components/information/process/processRegistWidget.vue';



const processSearchData = ref([]);

const handleSearch = (result) => {
    processSearchData.value = result.map((item, index) => ({
        num: index + 1,
        processId: item.process_id,
        processName: item.process_name,
        isInspection: item.is_inspection,
        status: item.status
    }));
};

onUnmounted(() => {
    console.log('process.vue unmounted!');
});
</script>

<template>
    <section class="process-container">
        <processSearchWidget @processFilterSearch="handleSearch"/>
        <processListWidget :items="processSearchData"/>
        <processRegistWidget />
    </section>
</template>
