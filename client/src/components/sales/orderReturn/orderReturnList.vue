<script setup>
import { ref, onMounted } from 'vue';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';

// 상태 변수
const ship = ref(null);
const returnDateRange = ref({ startDate: null, endDate: null });
const searchInput = ref({ orderId: '', partId: '' });

// 화면에 표시할 데이터
const customers2 = ref([]);

// 상태코드(int) → 상태명(string) 매핑
const orderStateMap = { 1: '반품등록', 2: '반품완료' };

// 날짜 포맷 함수
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 반품상태에 따른 색상
const getSeverity = (status) => {
    switch (status) {
        case '반품등록':
            return 'contrast';
        case '반품완료':
            return 'success';
        default:
            return null;
    }
};

// 조회 버튼 클릭 시 API 호출 및 데이터 갱신
const searchOrders = async () => {
    try {
        const startDate = returnDateRange.value.startDate ? formatDate(returnDateRange.value.startDate) : null;
        const endDate = returnDateRange.value.endDate ? formatDate(returnDateRange.value.endDate) : null;
        const reStatusInt = ship.value === '반품등록' ? 1 : ship.value === '반품완료' ? 2 : null;

        const response = await axios.get('/api/sales/returnSearch', {
            params: {
                orderId: searchInput.value.orderId || null,
                partnerId: searchInput.value.partId || null,
                reStatus: reStatusInt,
                startDate,
                endDate
            }
        });

        customers2.value =
            response.data?.list?.map((item) => ({
                shipmentId: item.shipment_id,
                productId: item.product_id,
                productName: item.product_name,
                partnerName: item.partner_name,
                partnerId: item.partner_id,
                manager: item.manager,
                quantity: item.quantity,
                deliveryAddr: item.delivery_addr,
                deliveryDate: item.del_date,
                shipDate: item.ship_date,
                returnDate: item.return_date,
                reState: orderStateMap[item.re_status] || '알수없음',
                returnReason: item.return_reason,
                name: item.order_manager
            })) || [];
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

// 초기화 버튼 클릭 시 모든 값 리셋
const resetFilters = () => {
    ship.value = null;
    returnDateRange.value.startDate = null;
    returnDateRange.value.endDate = null;
    searchInput.value.orderId = '';
    searchInput.value.partId = '';
    searchOrders();
};

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(searchOrders);
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">검색</h1>
        <div class="flex space-x-2">
            <Button label="조회" rounded @click="searchOrders" />
            <Button label="초기화" severity="info" rounded @click="resetFilters" />
        </div>
    </div>

    <Toolbar class="mb-4">
        <template #center>
            <div class="flex flex-wrap gap-6 p-4">
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">주문번호</label>
                    <InputGroup>
                        <IconField iconPosition="left">
                            <InputText v-model="searchInput.orderId" placeholder="ORD001" @keyup.enter="searchOrders" />
                            <InputIcon class="pi pi-search" @click="searchOrders" />
                        </IconField>
                    </InputGroup>
                </div>

                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">거래처코드</label>
                    <InputGroup>
                        <IconField iconPosition="left">
                            <InputText v-model="searchInput.partId" placeholder="SUP002" @keyup.enter="searchOrders" />
                            <InputIcon class="pi pi-search" @click="searchOrders" />
                        </IconField>
                    </InputGroup>
                </div>

                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">* 반품일</label>
                    <div class="flex items-center gap-2">
                        <Calendar v-model="returnDateRange.startDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                        <span>~</span>
                        <Calendar v-model="returnDateRange.endDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">반품상태</label>
                    <div class="flex flex-wrap gap-3">
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="ship" inputId="return1" name="ship" value="반품등록" />
                            <label for="return1">반품등록</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="ship" inputId="return2" name="ship" value="반품완료" />
                            <label for="return2">반품완료</label>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>

    <div class="font-semibold text-xl mb-4">
        주문내역
        <DataTable :value="customers2" paginator :rows="10" class="mt-6">
            <Column field="shipmentId" header="출하번호" style="min-width: 100px" frozen class="font-bold" />
            <Column field="productId" header="제품코드" style="min-width: 100px" />
            <Column field="productName" header="제품명" style="min-width: 120px" />
            <Column field="partnerName" header="거래처명" style="min-width: 80px" />
            <Column field="partnerId" header="거래처코드" style="min-width: 80px" />
            <Column field="quantity" header="수량" style="min-width: 120px" />
            <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
            <Column field="deliveryDate" header="납기일자" style="min-width: 80px" />
            <Column field="shipDate" header="출하일자" style="min-width: 120px">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.shipDate) || 'N/A' }}
                </template>
            </Column>
            <Column field="returnDate" header="반품일자" style="min-width: 120px">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.returnDate) || 'N/A' }}
                </template>
            </Column>
            <Column field="manager" header="거래처담당자" style="min-width: 80px" />
            <Column field="reState" header="반품상태" style="min-width: 120px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.reState" :severity="getSeverity(slotProps.data.reState)" :rounded="true" class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="returnReason" header="반품사유" style="min-width: 200px">
                <template #body="slotProps">
                    <span :title="slotProps.data.returnReason">{{ slotProps.data.returnReason }}</span>
                </template>
            </Column>
            <Column field="name" header="담당자" style="min-width: 100px" />
        </DataTable>
    </div>
</template>
