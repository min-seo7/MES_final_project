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
import IconField from 'primevue/iconfield'; // 없으면 삭제 가능
import axios from 'axios';

// 상태코드(int) → 상태명 매핑
const orderStateMap = {
    1: '주문서등록',
    2: '생산대기',
    3: '생산중',
    4: '품질검수완료',
    5: '제품입고'
};

// 상태코드 숫자 → 문자열 변환 함수
const getStatusText = (code) => orderStateMap[code] ?? '알수없음';

// 검색 필터 및 데이터
const calendarValue = ref(null);
const orderState = ref('');
const spec = ref('');
const productType = ref('');
const items = ref([]);

// 주문내역 데이터 로드
const orders = async () => {
    try {
        const response = await axios.get('/api/sales/orderSearch');
        console.log(response.data);
        items.value = response.data.list.map((item) => ({
            orderId: item.order_id,
            partnerId: item.partner_id,
            quantity: item.quantity,
            deliveryAddr: item.delivery_addr,
            orderDate: item.order_date,
            delDate: item.del_date,
            ordState: getStatusText(item.ord_status), // 숫자 -> 문자열 변환
            orderManager: item.order_manager
        }));
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

// 주문상태별 태그 색상
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
console.log('조회 조건:', {
    orderState: orderState.value,
    spec: spec.value,
    productType: productType.value,
    calendarValue: calendarValue.value
});

onMounted(() => {
    orders();
});
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="조회" rounded @click="orders" />
        <Button
            label="초기화"
            severity="info"
            rounded
            @click="
                orderState = '';
                spec = '';
                productType = '';
                calendarValue = null;
            "
        />
    </div>

    <div class="font-semibold text-xl mb-4">검색</div>
    <Toolbar>
        <template #center>
            <IconField>
                <div class="flex flex-col gap-6">
                    <!-- 주문번호/주문상태/규격 -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">주문번호</label>
                            <InputGroup>
                                <InputText placeholder="ORD001" />
                                <Button icon="pi pi-search" />
                            </InputGroup>
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

                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">규격</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex items-center gap-2" v-for="(size, idx) in ['40', '20']" :key="idx">
                                    <RadioButton v-model="spec" :inputId="`spec${idx + 1}`" name="spec" :value="size" />
                                    <label :for="`spec${idx + 1}`">{{ size }}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">거래처코드</label>
                            <InputGroup>
                                <InputText placeholder="SUP002" />
                                <Button icon="pi pi-search" />
                            </InputGroup>
                        </div>

                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">제품명</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex items-center gap-2" v-for="(type, idx) in ['분쇄형', '과립형', '액상형']" :key="idx">
                                    <RadioButton v-model="productType" :inputId="`product${idx + 1}`" name="product" :value="type" />
                                    <label :for="`product${idx + 1}`">{{ type }}</label>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">납기일자</label>
                            <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">거래처명</label>
                            <InputText type="text" placeholder="테흔 랜치" disabled />
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
