<script setup>
import orderModfiyRegist from '@/components/sales/orderModify/orderModifyRegist.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>
<template>
    <section>
        <orderModfiyRegist />
    </section>
</template>
