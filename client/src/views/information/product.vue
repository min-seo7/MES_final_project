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
        productCategory: '\u00A0',
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
        productCategory: item.product_cate_id,
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
            productCategory: '\u00A0',
            status: '\u00A0'
        });
    }

    productSearchData.value = mapped;
};

const handleResetForm = () => {
    productSelectedData.value = {}; // 초기화
};

const handleSelect = (row) => {
    const parseValueUnit = (value) => {
        if (!value) return { number: '', unit: '' };

        // 숫자(정수/소수) + 문자 단위로 분리
        const match = value.match(/^([\d.]+)\s*(\D+)$/);
        if (match) {
            return { number: match[1], unit: match[2] };
        }
        return { number: value, unit: '' }; // 단위가 없을 경우
    };

    const spec = parseValueUnit(row.specification);
    const stock = parseValueUnit(row.safetyStock);
    const exp = parseValueUnit(row.expiration);

    productSelectedData.value = [
        {
            productId: row.productId,
            productType: row.productType,
            productForm: row.productForm,
            productName: row.productName,
            specification: spec.number,
            unit: spec.unit,
            expiration: exp.number,
            expirationUnit: exp.unit,
            storageCondition: row.storageCondition,
            safetyStock: stock.number,
            safetyStockUnit: stock.unit,

            productCategory: row.productCategory,
            status: row.status
        }
    ];
    console.log(productSelectedData.value);
};

onUnmounted(() => {
    console.log('product.vue unmounted!');
});
</script>

<template>
    <section class="product-container">
        <productSearchWidget @productFilterSearch="handleSearch" @resetForm="handleResetForm" />
        <productListWidget :items="productSearchData" @productSelected="handleSelect" />
        <div class="mt-2"></div>
        <productRegistWidget :items="productSelectedData" />
    </section>
</template>
