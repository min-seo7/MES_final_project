<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

// API 호출 함수
const fetchPartners = async () => {
    try {
        const response = await axios.get('/api/information/partner');
        items.value = response.data.list.map((item, index) => ({
            num: index + 1,
            partnerId: item.partner_id,
            partnerType: item.partner_type,
            partnerName: item.partner_name,
            manager: item.manager,
            mainTel: item.main_tel,
            email: item.email,
            address: item.address || '',
            businessNo: item.business_no || '',
            status: item.status || ''
        }));
    } catch (error) {
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchPartners();
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="partnerId" header="거래처코드" />
        <Column field="partnerType" header="거래처유형" />
        <Column field="partnerName" header="거래처명" />
        <Column field="manager" header="담당자" />
        <Column field="mainTel" header="대표번호" />
        <Column field="email" header="E-Mail" />
        <Column field="address" header="거래처주소" />
        <Column field="businessNo" header="사업자번호" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
