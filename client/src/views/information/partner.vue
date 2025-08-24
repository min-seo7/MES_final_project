<script setup>
import partnerSearchWidget from '@/components/information/partner/partnerSearchWidget.vue';
import partnerListWidget from '@/components/information/partner/partnerListWidget.vue';
import partnerRegistWidget from '@/components/information/partner/partnerRegistWidget.vue';

import { ref, onUnmounted } from 'vue';
const partnerSelectedData = ref([]);

const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const partnerSearchData = ref(
    Array(rowsPerPage).fill({
        num: '\u00A0',
        partnerId: '\u00A0',
        partnerType: '\u00A0',
        partnerName: '\u00A0',
        manager: '\u00A0',
        mainTel: '\u00A0',
        email: '\u00A0',
        address: '\u00A0',
        businessNo: '\u00A0',
        status: '\u00A0'
    })
);

const handleSearch = (result) => {
    const mapped = result.map((item, index) => ({
        num: index + 1,
        partnerId: item.partner_id, // 컬럼명 매핑
        partnerType: item.partner_type,
        partnerName: item.partner_name,
        manager: item.manager || '',
        mainTel: item.main_tel || '',
        email: item.email || '',
        address: item.address || '',
        businessNo: item.business_no || '',
        status: item.status
    }));

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            partnerId: '\u00A0',
            partnerType: '\u00A0',
            partnerName: '\u00A0',
            manager: '\u00A0',
            mainTel: '\u00A0',
            email: '\u00A0',
            address: '\u00A0',
            businessNo: '\u00A0',
            status: '\u00A0'
        });
    }

    partnerSearchData.value = mapped;
};

const handleSelect = (row) => {
    let email = '';
    let domain = '';

    if (row.email && row.email.includes('@')) {
        const parts = row.email.split('@');
        email = parts[0];
        domain = parts[1];
    } else {
        email = row.email || '';
        domain = '';
    }

    partnerSelectedData.value = [
        {
            partnerId: row.partnerId,
            partnerType: row.partnerType,
            partnerName: row.partnerName,
            manager: row.manager,
            mainTel: row.mainTel,
            email: email, // @ 앞부분
            emailDomain: domain, // @ 뒷부분
            address: row.address,
            businessNo: row.businessNo,
            status: row.status
        }
    ];
    console.log(partnerSelectedData.value);
};

const handleResetForm = () => {
    partnerSelectedData.value = {}; // 초기화
};

onUnmounted(() => {
    console.log('partner.vue unmounted!');
});
</script>

<template>
    <section class="partner-container">
        <partnerSearchWidget @partnerFilterSearch="handleSearch" @resetForm="handleResetForm"/>
        <partnerListWidget :items="partnerSearchData" @partnerSelected="handleSelect" />
        <div class="mt-2"></div>
        <partnerRegistWidget :items="partnerSelectedData" />
    </section>
</template>
