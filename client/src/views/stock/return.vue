<script setup>
import stockCommButton from '@/components/stock/stockCommBtn.vue';
import stockCommSearchBox from '@/components/stock/stockCommSearchBox.vue';
import stockCommTable from '@/components/stock/stockCommTable.vue';
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">반품페이지</div>
    </div>
    <stockCommButton />
    <stockCommSearchBox />
    <stockCommTable />
</template>
