<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const columns = ref([
    { field: 'lotNumber', header: 'LOT번호' },
    { field: 'warehouse', header: '창고' },
    { field: 'locationInfo', header: '위치정보' },
    { field: 'productName', header: '제품명' },
    { field: 'stockQty', header: '재고량' },
    { field: 'safeStockStandardQty', header: '안전재고기준수량' }
]);
const selectStockList = ref([
    {
        id: 1,
        lotNumber: 'LOT20250812-GRA20-001',
        warehouse: 'A',
        locationInfo: 'WH-A-F-LU-20',
        productName: '과립형비료 20kg',
        stockQty: '42000',
        safeStockStandardQty: '60000'
    },
    {
        id: 2,
        lotNumber: 'LOT20250812-GRA40-001',
        warehouse: 'A',
        locationInfo: 'WH-A-HF-LU-40',
        productName: '과립형반제품',
        stockQty: '50000',
        safeStockStandardQty: '50000'
    },
    {
        id: 3,
        lotNumber: 'LOT20250812-LQ-F-001',
        warehouse: 'B',
        locationInfo: 'WH-B-F-RU-05',
        productName: '액상형비료 5L',
        stockQty: '60000',
        safeStockStandardQty: '60000'
    },
    {
        id: 4,
        lotNumber: 'LOT20250812-LQ-HF-001',
        warehouse: 'B',
        locationInfo: 'WH-B-HF-RD-10',
        productName: '액상형반제품',
        stockQty: '60000',
        safeStockStandardQty: '60000'
    }
]);
</script>
<template>
    <div class="font-semibold text-xl mb-2">제품재고조회</div>
    <div class="h-[calc(100vh - 100px)] overflow-hidden flex flex-col p-4">
        <div class="flex-shrink-0 bg-white p-4 rounded-lg shadow-md mb-2">
            <DataTable
                :value="selectStockList"
                scrollable
                scrollHeight="400px"
                :paginator="true"
                :rows="4"
                :pt="{
                    table: { style: 'min-width: 50rem' },
                    column: {
                        bodycell: ({ state }) => ({
                            class: [{ '!py-0': state['d_editing'] }]
                        })
                    }
                }"
                dataKey="id"
            >
                <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                    <template #body="{ data, field }">
                        <span>{{ data[field] }}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
