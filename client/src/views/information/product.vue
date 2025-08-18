<script setup>
import productSearchWidget from '@/components/information/product/productSearchWidget.vue';
import productListWidget from '@/components/information/product/productListWidget.vue';
import productRegistWidget from '@/components/information/product/productRegistWidget.vue';

import { ref, onUnmounted } from 'vue';

const productSelectedData = ref([]);

const rowsPerPage = 5;

// 초기 빈 데이터 (placeholder)
const productSearchData = ref(
    Array(rowsPerPage).fill({
        num: '\u00A0',
        productId: '\u00A0',
        productType: '\u00A0',
        productForm: '\u00A0',
        productName: '\u00A0',
        specification: '\u00A0',
        expiration: '\u00A0',
        storageCondition: '\u00A0',
        safetyStock: '\u00A0',
        manual: '\u00A0',
        status: '\u00A0'
    })
);

const handleSearch = (result) => {
    const mapped = result.map((item, index) => ({
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

    // 최소 행 수 유지
    while (mapped.length < rowsPerPage) {
        mapped.push({
            num: '\u00A0',
            productId: '\u00A0',
            productType: '\u00A0',
            productForm: '\u00A0',
            productName: '\u00A0',
            specification: '\u00A0',
            expiration: '\u00A0',
            storageCondition: '\u00A0',
            safetyStock: '\u00A0',
            manual: '\u00A0',
            status: '\u00A0'
        });
    }

    productSearchData.value = mapped;
};

const handleSelect = (row) => {
    productSelectedData.value = [
        {
            productId: row.productId,
            productType: row.productType,
            productForm: row.productForm,
            productName: row.productName,
            specification: row.specification,
            expiration: row.expiration,
            storageCondition: row.storageCondition,
            safetyStock: row.safetyStock,
            manual: row.manual,
            status: row.status
        }
    ];
    console.log(productSelectedData);
};

onUnmounted(() => {
    console.log('product.vue unmounted!');
});
</script>

<template>
    <section class="product-container">
        <productSearchWidget @productFilterSearch="handleSearch" />
        <productListWidget :items="productSearchData" @productSelected="handleSelect" />
        <productRegistWidget :items="productSelectedData" />
    </section>
</template>
