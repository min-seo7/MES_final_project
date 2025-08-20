<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const expandedRows = ref([]); // 배열로 관리
const products = ref([]);

// 전체 확장
const expandAll = () => {
    expandedRows.value = products.value.map((p) => p.ord_no);
};

// 전체 접기
const collapseAll = () => {
    expandedRows.value = [];
};

// DB에서 데이터 불러오기
const fetchProducts = async () => {
    try {
        const res = await axios.get('/api/production/orderSearch');
        products.value = res.data;
    } catch (err) {
        console.error('데이터 불러오기 실패:', err);
    }
};

onMounted(() => {
    fetchProducts();
});
</script>

<template>
    <div class="card">
        <DataTable v-model:expandedRows="expandedRows" :value="products" dataKey="ord_no" tableStyle="min-width: 60rem" showGridlines="true">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                </div>
            </template>

            <!-- 부모 테이블 -->
            <Column expander style="width: 5rem" />
            <Column field="ord_no" header="생산지시순번" />
            <Column field="order_date" header="지시등록날짜" />
            <Column field="director" header="지시자" />
            <Column field="status" header="상태" />

            <!-- Row Expansion -->
            <template #expansion="slotProps">
                <div class="p-4">
                    <h5>Orders for {{ slotProps.data.ord_no }}</h5>
                    <DataTable :value="slotProps.data.orders">
                        <Column field="wo_no" header="생산지시번호" />
                        <Column field="product_id" header="제품코드" />
                        <Column field="p_st_date" header="생산시작일자" />
                        <Column field="p_ed_date" header="생산완료일자" />
                        <Column field="prd_noworder_qty" header="현지시수량" />
                        <Column field="line_id" header="라인코드" />
                        <Column field="product_name" header="제품명" />
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>
