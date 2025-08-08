<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

// API 호출 함수
const fetchEmployees = async () => {
    try {
        const response = await axios.get('/api/information/partner');
        items.value = response.data.map((item, index) => ({
            num: index + 1,
            ecode: item.employee_id,
            name: item.name,
            department: item.department,
            phone: item.phone,
            email: item.email,
            hiredate: item.hire_date,
            enddate: item.leave_date || '',
            pw: item.login_pw || '',
            pwstatus: item.pw_change || '',
            status: item.status,
            role: item.auth
        }));
    } catch (error) {
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchEmployees();
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="ecode" header="사원번호" />
        <Column field="name" header="이름" />
        <Column field="department" header="부서" />
        <Column field="phone" header="연락처" />
        <Column field="email" header="이메일" />
        <Column field="hiredate" header="입사일자" />
        <Column field="enddate" header="퇴사일자" />
        <Column field="pw" header="비밀번호" />
        <Column field="pwstatus" header="비밀번호변경유무" />
        <Column field="status" header="상태" />
        <Column field="role" header="권한" />
    </DataTable>
</template>
