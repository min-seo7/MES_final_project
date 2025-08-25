<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

// 단일 확장을 위해 객체로 변경하고 PrimeVue의 내장 기능을 활용
const expandedRows = ref({});
const expandedChildRows = ref([]); 
const products = ref([]);

// 날짜/시간 포맷 함수
const formatDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 상태 값에 따라 CSS 클래스를 반환하는 함수
const getStatusClass = (status) => {
    switch (status) {
        case '대기':
            return 'status-waiting';
        case '진행':
            return 'status-progress';
        case '완료':
            return 'status-completed';
        default:
            return '';
    }
};

// 전체 확장
const expandAll = () => {
    expandedRows.value = products.value.reduce((acc, curr) => (acc[curr.ord_no] = true, acc), {});
};

// 전체 접기
const collapseAll = () => {
    expandedRows.value = {};
    expandedChildRows.value = [];
};

// 부모 테이블 데이터 불러오기
const fetchProducts = async () => {
    try {
        const res = await axios.get('/api/production/orderSearch');
        products.value = res.data;
    } catch (err) {
        console.error('데이터 불러오기 실패:', err);
    }
};

// 행 확장 시 상세 데이터 불러오기 (자식 테이블)
const onRowExpand = async (event) => {
    try {
        const ordNo = event.data.ord_no;
        const res = await axios.post('/api/production/orderSearch', { ord_no: ordNo });

        event.data.orders = res.data.result;
    } catch (err) {
        console.error('상세 데이터 불러오기 실패:', err);
        event.data.orders = [];
    }
};

const onChildRowExpand = async (event) => {
    try {
        const woNo = event.data.wo_no;
        // wo_no를 POST 파라미터로 넘겨 데이터 요청
        const res = await axios.post('/api/production/orderSearchResult', { wo_no: woNo });
        event.data.grandChildOrders = res.data.result;
    } catch (err) {
        console.error('실적데이터 불러오기 실패:', err);
        event.data.grandChildOrders = [];
    }
};

onMounted(() => {
    fetchProducts();
});
</script>

<template>
    <div class="card fixed-height-table">
        <DataTable v-model:expandedRows="expandedRows" :value="products" dataKey="ord_no" tableStyle="min-width: 60rem" showGridlines="true" @row-expand="onRowExpand">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                </div>
            </template>

            <Column expander style="width: 5rem" />
            <Column header="생산지시순번">
                <template #body="dataProps">
                    <span class="order-number-button">{{ dataProps.data.ord_no }}</span>
                </template>
            </Column>
            <Column field="order_date" header="지시등록날짜" />
            <Column field="director" header="지시자" />
            <Column field="status" header="상태" />

            <template #expansion="slotProps">
                <div class="p-4">
                    <h5>{{ slotProps.data.ord_no }}</h5>
                    <DataTable v-model:expandedRows="expandedChildRows" :value="slotProps.data.orders" dataKey="wo_no" @row-expand="onChildRowExpand">
                        <Column expander style="width: 5rem" />
                        <Column header="생산지시번호">
                            <template #body="dataProps">
                                <span class="production-order-button">{{ dataProps.data.wo_no }}</span>
                            </template>
                        </Column>
                        <Column field="product_id" header="제품코드" />
                        <Column header="생산시작일시">
                            <template #body="dataProps">
                                {{ formatDateTime(dataProps.data.p_st_date) }}
                            </template>
                        </Column>
                        <Column header="생산완료일시">
                            <template #body="dataProps">
                                {{ formatDateTime(dataProps.data.p_ed_date) }}
                            </template>
                        </Column>
                        <Column field="prd_noworder_qty" header="현지시수량" />
                        <Column field="line_id" header="라인코드" />
                        <Column field="product_name" header="제품명" />

                        <template #expansion="childSlotProps">
                            <div class="p-4">
                                <h5>{{ childSlotProps.data.wo_no }} 생산 상세</h5>
                                <DataTable :value="childSlotProps.data.grandChildOrders">
                                    <Column header="공정순서" />
                                    <Column header="공정코드">
                                        <template #body="dataProps">
                                            <span class="process-code-button">{{ dataProps.data.process }}</span>
                                        </template>
                                    </Column>
                                    <Column field="process_name" header="공정명" />
                                    <Column header="작업시작일시">
                                        <template #body="dataProps">
                                            {{ formatDateTime(dataProps.data.startDate) }}
                                        </template>
                                    </Column>
                                    <Column header="작업종료일시">
                                        <template #body="dataProps">
                                            {{ formatDateTime(dataProps.data.endDate) }}
                                        </template>
                                    </Column>
                                    <Column field="in_qty" header="투입량" />
                                    <Column field="def_qty" header="불량량" />
                                    <Column field="qty" header="생산량" />
                                    <Column header="상태">
                                        <template #body="dataProps">
                                            <span :class="['status-button', getStatusClass(dataProps.data.status)]">
                                                {{ dataProps.data.status }}
                                            </span>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<style scoped>
.fixed-height-table {
    height: 820px;
    overflow-y: auto;
}

/* 기존 스타일 유지 */
.p-datatable .p-datatable-tbody > tr {
    height: 50px !important;
}
.p-datatable .p-datatable-thead > tr {
    height: 50px !important;
}
.p-datatable .p-datatable-tbody > tr > td {
    padding: 0 10px !important;
    line-height: 50px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 부모 테이블의 확장된 행 배경색 */
:deep(.p-datatable-tbody > .p-row-expanded) {
    background-color: #f0f0f0 !important;
}

/* 최상위 부모 테이블 헤더에 연노랑색 적용 */
:deep(.p-datatable-thead > tr > th) {
    background-color: #dedea9 !important;
}

/* 생산지시순번 텍스트를 버튼처럼 보이게 하는 CSS */
:deep(.order-number-button) {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #ffda6a; /* 기존보다 진한 연노랑 */
    color: #000;
    font-weight: bold;
    cursor: pointer;
}

/* 자식 테이블의 헤더에 연한 회색 배경색 적용 */
:deep(.p-datatable-row-expansion .p-datatable-thead > tr > th) {
    background-color: #e1a04a88 !important; 
}

/* 최하위 (손자) 테이블의 헤더에 더 연한 회색 배경색 적용 */
:deep(.p-datatable-row-expansion .p-datatable-row-expansion .p-datatable-thead > tr > th) {
    background-color: #89797952 !important; 
}

/* 생산지시번호 버튼 스타일 적용 */
:deep(.production-order-button) {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #d1903a;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

/* 공정코드 버튼 스타일 적용 */
:deep(.process-code-button) {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #5d4f4f; 
    color: white;
    font-weight: bold;
    cursor: pointer;
}

/* --- 상태 버튼 스타일링 (손자 테이블) --- */

/* 상태 버튼 공통 스타일 */
.status-button {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: bold;
    text-align: center;
    min-width: 50px;
}

/* 대기: 노랑 */
.status-waiting {
    background-color: #ffc107;
    color: #333; 
}

/* 진행: 초록 */
.status-progress {
    background-color: #28a745;
    color: white;
}

/* 완료: 파랑 */
.status-completed {
    background-color: #007bff;
    color: white;
}
</style>