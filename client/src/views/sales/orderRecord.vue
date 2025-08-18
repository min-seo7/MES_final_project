<script setup>
import orderModfiyList from '@/components/sales/orderModify/orderModfiyList.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>
<template>
    <section>
        <orderModfiyList />
    </section>
</template>
