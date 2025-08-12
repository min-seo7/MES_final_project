<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);

// API 호출 함수
const fetchProduct = async () => {
    try {
        const response = await axios.get('/api/information/product');
        items.value = response.data.map((item, index) => ({
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
    } catch (error) {
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchProduct();
});
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">목록</h2>
    </div>

    <DataTable :value="items" :rows="5" :paginator="true" showGridlines>
        <Column field="num" header="" />
        <Column field="productId" header="제품코드" />
        <Column field="productType" header="제품유형" />
        <Column field="productType" header="제품형태" />
        <Column field="productName" header="제품명" />
        <Column field="specification" header="규격" />
        <Column field="expiration" header="유통기한" />
        <Column field="storageCondition" header="보관조건" />
        <Column field="safetyStock" header="안전재고" />
        <Column field="manual" header="제품매뉴얼" />
        <Column field="status" header="상태" />
    </DataTable>
</template>
