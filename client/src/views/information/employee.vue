<script setup>
import { ref, onUnmounted } from 'vue';
import EmployeeSearchWidget from '@/components/information/employee/employeeSearchWidget.vue';
import EmployeeListWidget from '@/components/information/employee/employeeListWidget.vue';
import EmployeeRegistWidget from '@/components/information/employee/employeeRegistWidget.vue';

const employeeSelectedData = ref([]);

const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const employeeSearchData = ref(
    Array(rowsPerPage).fill({
        num: '\u00A0',
        employeeId: '\u00A0',
        name: '\u00A0',
        department: '\u00A0',
        phone: '\u00A0',
        email: '\u00A0',
        hireDate: '\u00A0',
        endDate: '\u00A0',
        pw: '\u00A0',
        pwstatus: '\u00A0',
        status: '\u00A0',
        auth: '\u00A0'
    })
);

const handleSearch = (result) => {
    const mapped = result.map((item, index) => ({
        num: index + 1,
        employeeId: item.employee_id, // 컬럼명 매핑
        name: item.name,
        department: item.department,
        phone: item.phone || '',
        email: item.email || '',
        hireDate: item.hire_date || '',
        endDate: item.leave_date || '',
        pw: item.login_pw || '',
        pwstatus: item.pw_change || '',
        status: item.status,
        auth: item.auth
    }));

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            employeeId: '\u00A0',
            name: '\u00A0',
            department: '\u00A0',
            phone: '\u00A0',
            email: '\u00A0',
            hireDate: '\u00A0',
            endDate: '\u00A0',
            pw: '\u00A0',
            pwstatus: '\u00A0',
            status: '\u00A0',
            auth: '\u00A0'
        });
    }

    employeeSearchData.value = mapped;
};

const handleSelect = (row) => {
    employeeSelectedData.value = [
        {
            employeeId: row.employeeId,
            name: row.name,
            phone: row.phone,
            email: row.email,
            hireDate: row.hireDate,
            leaveDate: row.leaveDate,
            auth: row.auth,
            department: row.department,
            status: row.status
        }
    ];
    console.log(employeeSelectedData);
};

onUnmounted(() => {
    console.log('employee.vue unmounted!');
});
</script>

<template>
    <section class="employee-container">
        <EmployeeSearchWidget @employeeFilterSearch="handleSearch" />
        <EmployeeListWidget :items="employeeSearchData" @employeeSelected="handleSelect" />
        <EmployeeRegistWidget :items="employeeSelectedData" />
    </section>
</template>
