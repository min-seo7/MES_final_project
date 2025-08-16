<script setup>
import productSearchWidget from '@/components/information/product/productSearchWidget.vue';
import productListWidget from '@/components/information/product/productListWidget.vue';
import productRegistWidget from '@/components/information/product/productRegistWidget.vue';

import { ref, onUnmounted } from 'vue';

const productSearchData = ref([]);


const handleSearch = (result) => {
    productSearchData.value = result.map((item, index) => ({
        num: index + 1,
        productId: item.product_id,
        productType: item.product_type,
        productForm: item.product_form,
        productName: item.product_name,
        specification: item.specification + item.unit,
        expiration: item.expiration_date + item.expiration_date_unit,
        storageCondition: item.storage_condition,
        safetyStock: item.safety_stock + item.safety_stock_unit,
        manual: item.product_manual,
        status: item.status
    }));
};

onUnmounted(() => {
    console.log('product.vue unmounted!');
});
</script>

<template>
    <section class="product-container">
        <productSearchWidget @productFilterSearch="handleSearch"/>
        <productListWidget :items="productSearchData"/>
        <productRegistWidget />
    </section>
</template>
