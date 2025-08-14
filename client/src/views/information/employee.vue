<script setup>
import { ref, onUnmounted } from 'vue';
import EmployeeSearchWidget from '@/components/information/employee/employeeSearchWidget.vue';
import EmployeeListWidget from '@/components/information/employee/employeeListWidget.vue';
import EmployeeRegistWidget from '@/components/information/employee/employeeRegistWidget.vue';

const employeeSearchData = ref([]);

const handleSearch = (result) => {
    employeeSearchData.value = result.map((item, index) => ({
        num: index + 1,
        ecode: item.employee_id, // 컬럼명 매핑
        name: item.name,
        department: item.department,
        phone: item.phone || '',
        email: item.email || '',
        hiredate: item.hire_date || '',
        enddate: item.leave_date || '',
        pw: item.login_pw || '',
        pwstatus: item.pw_change || '',
        status: item.status,
        role: item.auth
    }));
};

onUnmounted(() => {
    console.log('employee.vue unmounted!');
});
</script>

<template>
    <section class="employee-container">
        <EmployeeSearchWidget @employeeFilterSearch="handleSearch" />
        <EmployeeListWidget :items="employeeSearchData" />
        <EmployeeRegistWidget />
    </section>
</template>
