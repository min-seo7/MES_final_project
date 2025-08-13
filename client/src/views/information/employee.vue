<script setup>
import { ref } from 'vue';
import axios from 'axios';
import EmployeeSearchWidget from '@/components/information/employee/employeeSearchWidget.vue';
import EmployeeListWidget from '@/components/information/employee/employeeListWidget.vue';
import EmployeeRegistWidget from '@/components/information/employee/employeeRegistWidget.vue';

const employeeList = ref([]);

const fetchEmployeeList = async (searchCondition) => {
    try {
        const res = await axios.post('/api/information/employee/search', searchCondition);
        return res.data;
    } catch (err) {
        console.error('사원조회 실패:', err);
        return [];
    }
};

const handleSearch = async (searchCondition) => {
    employeeList.value = await fetchEmployeeList(searchCondition);
    console.log(employeeList);
};

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('employee.vue unmounted!');
});
</script>

<template>
    <section class="employee-container">
        <EmployeeSearchWidget @search="handleSearch" />
        <EmployeeListWidget :items="employeeList" />
        <EmployeeRegistWidget />
    </section>
</template>
