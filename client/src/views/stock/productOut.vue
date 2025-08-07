<script setup>
import stockCommButton from '@/components/stock/stockCommButton.vue';
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">제품출고페이지</div>
    </div>
    <stockCommButton />
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
</style>
