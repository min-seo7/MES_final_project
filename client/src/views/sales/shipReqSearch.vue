<script setup>
import orderShipList from '@/components/sales/orderShip/orderShipList.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>

<template>
    <section>
        <orderShipList />
    </section>
</template>
