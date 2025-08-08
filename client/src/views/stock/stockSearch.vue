<script setup>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import stockCommTable from '@/components/stock/stockCommTable.vue';
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">재고조회페이지</div>
    </div>
    <stockCommButton />
    <stockCommTable />
</template>
