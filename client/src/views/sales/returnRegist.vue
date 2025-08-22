<script setup>
import orderReturnRegist from '@/components/sales/orderReturn/orderReturnRegist.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>

<template>
    <section>
        <orderReturnRegist />
    </section>
</template>
