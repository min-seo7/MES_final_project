<script setup>
import orderReturnList from '@/components/sales/orderReturn/orderReturnList.vue';
import { onUnmounted } from 'vue';
onUnmounted(() => {
    console.log('order.vue');
});
</script>

<template>
    <section>
        <orderReturnList />
    </section>
</template>
