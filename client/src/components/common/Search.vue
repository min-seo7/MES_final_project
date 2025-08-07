<!-- Search.vue -->
<script setup>
defineProps({
    title: String,
    onSearch: Function
});
</script>

<template>
    <div class="search-box">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
            <Button @click="onSearch">검색</Button>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <slot name="filters" />
        </div>
    </div>
</template>
