<script setup>
import { ref, onMounted } from 'vue';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import IconField from 'primevue/iconfield';
import axios from 'axios';

// 상태코드(int) → 상태명 매핑
const orderStateMap = {
    1: '주문서등록',
    2: '생산대기',
    3: '생산중',
    4: '품질검수완료',
    5: '제품입고'
};

// 상태명(string) → 상태코드 매핑 (서버로 보낼 때 필요)
const orderStateMapReverse = {
    주문서등록: 1,
    생산대기: 2,
    생산중: 3,
    품질검수완료: 4,
    제품입고: 5
};

const getStatusText = (code) => orderStateMap[code] ?? '알수없음';

const calendarValue = ref(null);
const orderState = ref('');
const spec = ref('');
const productType = ref('');
const orderId = ref('');
const partnerId = ref('');
// 'productId'를 위한 새로운 ref 변수 추가
const productId = ref('');

const items = ref([]);

const orders = async () => {
    try {
        const queryParams = {
            orderId: orderId.value || null,
            orderStatus: orderStateMapReverse[orderState.value] || null,
            spec: spec.value || null,
            productType: productType.value || null,
            partnerId: partnerId.value || null,
            productId: productId.value || null, // 'productId'를 쿼리 파라미터에 추가
            delDate: calendarValue.value
                ? new Date(calendarValue.value).getFullYear().toString() + '-' + (new Date(calendarValue.value).getMonth() + 1).toString().padStart(2, '0') + '-' + new Date(calendarValue.value).getDate().toString().padStart(2, '0')
                : null
        };

        const response = await axios.get('/api/sales/orderSearch', { params: queryParams });
        console.log(response.data);

        if (response.data && response.data.list && Array.isArray(response.data.list)) {
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

const resetFilters = () => {
    orderState.value = '';
    spec.value = '';
    productType.value = '';
    calendarValue.value = null;
    orderId.value = '';
    partnerId.value = '';
    productId.value = ''; // 'productId' 필터 초기화 추가
    orders();
};

onMounted(() => {
    orders();
});
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="조회" rounded @click="orders" />
        <Button label="초기화" severity="info" rounded @click="resetFilters" />
    </div>

    <div class="font-semibold text-xl mb-4">검색</div>

    <Toolbar>
        <template #center>
            <IconField>
                <div class="flex flex-col gap-6">
                    <div class="flex flex-wrap items-end gap-5">
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">주문번호</label>
                            <InputGroup>
                                <InputText placeholder="ORD001" v-model="orderId" />
                                <Button icon="pi pi-search" @click="orders" />
                            </InputGroup>
                        </div>
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">거래처코드</label>
                            <InputGroup>
                                <InputText placeholder="SUP002" v-model="partnerId" />
                                <Button icon="pi pi-search" @click="orders" />
                            </InputGroup>
                        </div>
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">제품코드</label>
                            <InputGroup>
                                <InputText placeholder="PROD001" v-model="productId" />
                                <Button icon="pi pi-search" @click="orders" />
                            </InputGroup>
                            <div class="w-1/2">
                                <InputText v-model="searchForm.productName" placeholder="제품명" disabled />
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">납기일자</label>
                            <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue" dateFormat="yy-mm-dd" />
                        </div>
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">주문상태</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex items-center gap-2" v-for="(state, idx) in ['주문서등록', '생산대기', '생산중', '품질검수완료', '제품입고']" :key="idx">
                                    <RadioButton v-model="orderState" :inputId="`orderState${idx + 1}`" name="orderState" :value="state" />
                                    <label :for="`orderState${idx + 1}`">{{ state }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </IconField>
        </template>
    </Toolbar>

    <br />

    <div class="font-semibold text-xl mb-4">
        주문내역
        <DataTable :value="items" scrollable scrollHeight="200px" class="mt-6">
            <Column field="orderId" header="주문번호" style="min-width: 100px" frozen class="font-bold" />
            <Column field="partnerId" header="거래처코드" style="min-width: 120px" />
            <Column field="productId" header="제품코드" style="min-width: 120px" />
            <Column field="productName" header="제품명" style="min-width: 120px" />
            <Column field="manager" header="거래담당자" style="min-width: 120px" />
            <Column field="quantity" header="수량" style="min-width: 80px" />
            <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
            <Column field="orderDate" header="등록일자" style="min-width: 100px" />
            <Column field="delDate" header="납기일자" style="min-width: 100px" />
            <Column field="orderState" header="주문상태" style="min-width: 120px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.ordState" :severity="getSeverity(slotProps.data.ordState)" :rounded="true" class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="orderManager" header="담당자" style="min-width: 100px" />
        </DataTable>
        <Paginator :rows="10" :totalRecords="items.length" :rowsPerPageOptions="[10, 20, 30]" />
    </div>
</template>
