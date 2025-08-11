<script setup>
import productOrder from '@/components/product/productOrder.vue';
</script>
<template>
    <productOrder></productOrder>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
.flex-warp {
    text-align: right;
}
</style>
