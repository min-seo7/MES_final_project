<script setup>
import OrderRegisList from '@/components/sales/orderRegist/orderRegisList.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>
<template>
    <section>
        <OrderRegisList />
    </section>
</template>
