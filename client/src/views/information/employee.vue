<script setup>
import EmployeeSearchWidget from '@/components/information/employee/employeeSearchWidget.vue';
import EmployeeListWidget from '@/components/information/employee/employeeListWidget.vue';
import EmployeeRegistWidget from '@/components/information/employee/employeeRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('employee.vue unmounted!');
});
</script>

<template>
    <section class="employee-container">
        <EmployeeSearchWidget />
        <EmployeeListWidget />
        <EmployeeRegistWidget />
    </section>
</template>
