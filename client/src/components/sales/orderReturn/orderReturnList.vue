<script setup>
import { ref, onMounted, computed } from 'vue';
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
import Paginator from 'primevue/paginator';
import axios from 'axios';

// 상태 변수
const ship = ref('');
const returnDateRange = ref({
    startDate: null,
    endDate: null
});
const searchInput = ref({
    orderId: '',
    partId: ''
});

// 화면에 표시할 데이터
const customers2 = ref([]);

// 상태코드(int) → 상태명(string) 매핑
// 백엔드에서 1: '반품등록', 2: '반품완료'라고 가정합니다.
const orderStateMap = computed(() => {
    return {
        1: '반품등록',
        2: '반품완료'
    };
});

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
        const startDate = returnDateRange.value.startDate ? returnDateRange.value.startDate.toISOString().split('T')[0] : null;
        const endDate = returnDateRange.value.endDate ? returnDateRange.value.endDate.toISOString().split('T')[0] : null;

        // 프론트엔드에서 선택한 문자열을 백엔드가 인식하는 정수로 변환
        const reStatusInt = ship.value === '반품등록' ? 1 : ship.value === '반품완료' ? 2 : null;

        const queryParams = {
            orderId: searchInput.value.orderId || null,
            partnerId: searchInput.value.partId || null,
            reStatus: reStatusInt, // 변환된 정수 값 사용
            startDate: startDate,
            endDate: endDate
        };

        const response = await axios.get('/api/sales/returnSearch', { params: queryParams });

        if (response.data?.list && Array.isArray(response.data.list)) {
            customers2.value = response.data.list.map((item) => ({
                returnId: item.return_id,
                productCode: item.product_id,
                productName: item.product_name,
                partnerName: item.partner_name,
                partnerId: item.partner_id,
                manager: item.manager,
                quantity: item.quantity,
                deliveryAddr: item.delivery_addr,
                deliveryDate: new Date(item.del_date),
                shipDate: item.ship_date ? new Date(item.ship_date) : null,
                returnDate: new Date(item.return_date),
                // **여기서 백엔드 정수 값을 화면에 표시할 문자열로 변환합니다.**
                reState: orderStateMap.value[item.re_status] || '알수없음',
                returnReason: item.return_reason,
                name: item.order_manager
            }));
        } else {
            customers2.value = [];
            console.warn('서버 응답에 유효한 리스트 데이터가 없습니다.', response.data);
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

// 초기화 버튼 클릭 시 모든 값 리셋
const resetFilters = () => {
    ship.value = '';
    returnDateRange.value.startDate = null;
    returnDateRange.value.endDate = null;
    searchInput.value.orderId = '';
    searchInput.value.partId = '';
    searchOrders();
};

// 컴포넌트가 마운트될 때 초기 데이터 로드
onMounted(() => {
    searchOrders();
});
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
            <div class="flex wrap-col gap-6 p-4">
                <div class="flex flex-col">
                    <label for="orderId" class="font-semibold text-sm mb-1">주문번호</label>
                    <InputGroup>
                        <IconField iconPosition="left">
                            <InputText id="orderId" type="text" class="w-60" placeholder="ORD001" v-model="searchInput.orderId" />
                            <InputIcon class="pi pi-search" @click="searchOrders" />
                        </IconField>
                    </InputGroup>
                </div>
                <div class="flex flex-col">
                    <label for="partId" class="font-semibold text-sm mb-1">거래처코드</label>
                    <InputGroup>
                        <IconField iconPosition="left">
                            <InputText id="partId" type="text" class="w-60" placeholder="SUP002" v-model="searchInput.partId" />
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

    <br />
    <div class="font-semibold text-xl mb-4">
        주문내역
        <DataTable :value="customers2" class="mt-6">
            <Column field="returnId" header="반품번호" style="min-width: 100px" frozen class="font-bold" />
            <Column field="productCode" header="제품코드" style="min-width: 100px" />
            <Column field="productName" header="제품명" style="min-width: 120px" />
            <Column field="partnerName" header="거래처명" style="min-width: 80px" />
            <Column field="partnerId" header="거래처코드" style="min-width: 80px" />
            <Column field="quantity" header="수량" style="min-width: 120px" />
            <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
            <Column field="deliveryDate" header="납기일자" style="min-width: 80px">
                <template #body="slotProps">
                    {{ slotProps.data.deliveryDate.toLocaleDateString() }}
                </template>
            </Column>
            <Column field="shipDate" header="출하일자" style="min-width: 120px">
                <template #body="slotProps">
                    {{ slotProps.data.shipDate ? slotProps.data.shipDate.toLocaleDateString() : 'N/A' }}
                </template>
            </Column>
            <Column field="returnDate" header="반품일자" style="min-width: 120px">
                <template #body="slotProps">
                    {{ slotProps.data.returnDate.toLocaleDateString() }}
                </template>
            </Column>
            <Column field="manager" header="거래처담당자" style="min-width: 80px" />
            <Column field="reState" header="반품상태" style="min-width: 120px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.reState" :severity="getSeverity(slotProps.data.reState)" :rounded="true" class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="returnReason" header="반품사유" style="min-width: 200px" />
            <Column field="name" header="담당자" style="min-width: 100px" />
        </DataTable>
        <Paginator :rows="10" :totalRecords="customers2.length" :rowsPerPageOptions="[10, 20, 30]" />
    </div>
</template>
