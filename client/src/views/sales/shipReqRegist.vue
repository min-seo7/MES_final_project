<script setup>
import orderShipRegist from '@/components/sales/orderShip/orderShipRegist.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>

<template>
    <section>
        <orderShipRegist />
    </section>
</template>
