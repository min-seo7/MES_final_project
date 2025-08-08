<script setup>
import partnerSearchWidget from '@/components/information/partner/partnerSearchWidget.vue';
import partnerListWidget from '@/components/information/partner/partnerListWidget.vue';
import partnerRegistWidget from '@/components/information/partner/partnerRegistWidget.vue';

import { onUnmounted } from 'vue';

onUnmounted(() => {
    console.log('partner.vue unmounted!');
});
</script>

<template>
    <section class="partner-container">
        <partnerSearchWidget />
        <partnerListWidget />
        <partnerRegistWidget />
    </section>
</template>
