<script setup>
import { ref, onMounted, computed } from 'vue';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';

// 상태코드(int) → 상태명 매핑
const orderStateMap = {
    1: '주문서등록',
    2: '생산대기',
    3: '생산중',
    4: '품질검수완료',
    5: '제품입고'
};

// 상태명(string) → 상태코드 매핑 (필터링에 필요)
const orderStateMapReverse = computed(() => {
    return Object.fromEntries(Object.entries(orderStateMap).map(([key, value]) => [value, key]));
});

const getStatusText = (code) => orderStateMap[code] ?? '알수없음';

// 검색 필터 상태
const searchFilters = ref({
    orderId: '',
    orderStatus: '', // 라디오 버튼
    productName: '', // 제품명 (spec 대신 사용)
    partnerId: '',
    delDate: null
});

const items = ref([]);
//searchFilters.value.delDate ? new Date(searchFilters.value.delDate).toISOString().split('T')[0] : null
//주문 데이터 조회
const fetchOrders = async () => {
    try {
        const delDateValue = searchFilters.value.delDate;
        let formattedDelDate = null;
        if (delDateValue) {
            const year = delDateValue.getFullYear();
            const month = String(delDateValue.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
            const day = String(delDateValue.getDate()).padStart(2, '0');
            formattedDelDate = `${year}-${month}-${day}`;
        }
        const queryParams = {
            orderId: searchFilters.value.orderId || null,
            orderStatus: searchFilters.value.orderStatus ? orderStateMapReverse.value[searchFilters.value.orderStatus] : null,
            productName: searchFilters.value.productName || null,
            partnerId: searchFilters.value.partnerId || null,
            delDate: formattedDelDate
        };

        const response = await axios.get('/api/sales/orderSearch', { params: queryParams });

        if (response.data?.list && Array.isArray(response.data.list)) {
            items.value = response.data.list.map((item) => ({
                orderId: item.order_id,
                partnerId: item.partner_id,
                productId: item.product_id,
                productName: item.product_name,
                manager: item.manager,
                quantity: item.quantity,
                deliveryAddr: item.delivery_addr,
                orderDate: item.order_date,
                delDate: item.del_date,
                ordState: getStatusText(item.ord_status),
                orderManager: item.order_manager
            }));
        } else {
            items.value = [];
            console.warn('서버 응답에 유효한 리스트 데이터가 없습니다.', response.data);
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

// 상태별 severity
const getSeverity = (status) => {
    switch (status) {
        case '주문서등록':
            return 'contrast';
        case '생산대기':
            return 'warn';
        case '생산중':
            return 'danger';
        case '품질검수완료':
            return 'success';
        case '제품입고':
            return 'info';
        default:
            return null;
    }
};

// 필터 초기화
const resetFilters = () => {
    searchFilters.value.orderId = '';
    searchFilters.value.orderStatus = '';
    searchFilters.value.productName = '';
    searchFilters.value.partnerId = '';
    searchFilters.value.delDate = null;
    // 초기화 후 전체 데이터 다시 조회
    fetchOrders();
};

onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">주문내역 조회</h1>
            <div class="flex space-x-2">
                <Button label="조회" rounded @click="fetchOrders" />
                <Button label="초기화" severity="info" rounded @click="resetFilters" />
            </div>
        </div>

        <Toolbar class="mb-4">
            <template #center>
                <div class="flex flex-wrap gap-6 p-4">
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">주문번호</label>
                        <InputText placeholder="ORD001" v-model="searchFilters.orderId" />
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">거래처코드</label>
                        <InputText placeholder="SUP002" v-model="searchFilters.partnerId" />
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">제품명</label>
                        <InputText placeholder="제품명" v-model="searchFilters.productName" />
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">납기일자</label>
                        <DatePicker :showIcon="true" v-model="searchFilters.delDate" dateFormat="yy-mm-dd" />
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">주문상태</label>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex items-center gap-2" v-for="state in Object.values(orderStateMap)" :key="state">
                                <RadioButton v-model="searchFilters.orderStatus" :inputId="`orderState-${state}`" name="orderStatus" :value="state" />
                                <label :for="`orderState-${state}`">{{ state }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Toolbar>

        <div class="font-semibold text-xl mb-4 mt-6">
            주문내역
            <DataTable :value="items" scrollable scrollHeight="400px" :paginator="true" :rows="10" :rowsPerPageOptions="[10, 20, 30]" class="mt-3">
                <Column field="orderId" header="주문번호" style="min-width: 100px" frozen class="font-bold" />
                <Column field="partnerId" header="거래처코드" style="min-width: 120px" />
                <Column field="productId" header="제품코드" style="min-width: 120px" />
                <Column field="productName" header="제품명" style="min-width: 120px" />
                <Column field="manager" header="거래담당자" style="min-width: 120px" />
                <Column field="quantity" header="수량" style="min-width: 80px" />
                <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
                <Column field="orderDate" header="등록일자" style="min-width: 100px" />
                <Column field="delDate" header="납기일자" style="min-width: 100px" />
                <Column field="ordState" header="주문상태" style="min-width: 120px">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.ordState" :severity="getSeverity(slotProps.data.ordState)" :rounded="true" class="px-3 py-1 text-sm" />
                    </template>
                </Column>
                <Column field="orderManager" header="담당자" style="min-width: 100px" />
            </DataTable>
        </div>
    </div>
</template>
