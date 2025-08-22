<script setup>
import OrderPdfEmail from '@/components/sales/orderEmailPdf/orderEmail.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>
<template>
    <section>
        <OrderPdfEmail />
    </section>
</template>
