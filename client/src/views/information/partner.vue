<script setup>
import partnerSearchWidget from '@/components/information/partner/partnerSearchWidget.vue';
import partnerListWidget from '@/components/information/partner/partnerListWidget.vue';
import partnerRegistWidget from '@/components/information/partner/partnerRegistWidget.vue';

import { ref, onUnmounted } from 'vue';

const partnerSearchData = ref([]);

const handleSearch = (result) => {
    partnerSearchData.value = result.map((item, index) => ({
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
};

onUnmounted(() => {
    console.log('partner.vue unmounted!');
});
</script>

<template>
    <section class="partner-container">
        <partnerSearchWidget @partnerFilterSearch="handleSearch" />
        <partnerListWidget :items="partnerSearchData" />
        <partnerRegistWidget />
    </section>
</template>
