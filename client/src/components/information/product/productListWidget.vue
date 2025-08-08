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
        <Column field="prodId" header="제품코드" />
        <Column field="prodType" header="제품유형" />
        <Column field="prodType" header="제품형태" />
        <Column field="prodName" header="제품명" />
        <Column field="specification" header="규격" />
        <Column field="expiration" header="유통기한" />
        <Column field="storageCond" header="보관조건" />
        <Column field="safetyStock" header="안전재고" />
        <Column field="manual" header="제품매뉴얼" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
