<script setup>
import { ref } from 'vue';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';

// 날짜 예시
const today = new Date().toISOString().slice(0, 10);
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

// 상태 변수
const ship = ref('');
const order = ref({
    delStartDate: null,
    delEndDate: null
});

// 전체 주문내역
const allOrders = [
    {
        ordernum: 'ORD001',
        prodCode: 'P1001',
        partCode: 'SUP002',
        partName: '농협',
        productName: '분말형',
        qty: 100,
        addr: '서울 강남구',
        createDate: today,
        deliveryDate: nextWeek,
        shipState: '출하대기',
        manager: '홍oo',
        name: '김미국'
    }
];

// 화면에 표시할 주문내역
const customers2 = ref([...allOrders]);

// 주문상태에 따른 색상
const getSeverity = (status) => {
    switch (status) {
        case '출하대기':
            return 'contrast';
        case '출하중':
            return 'danger';
        case '출하완료':
            return 'success';
        default:
            return null;
    }
};

// 조회 버튼 클릭 시 필터링
const searchOrders = () => {
    if (ship.value) {
        customers2.value = allOrders.filter((order) => order.orderstate === ship.value);
    } else {
        customers2.value = [...allOrders];
    }
};

// 초기화 버튼 클릭 시 모든 값 리셋
const resetFilters = () => {
    ship.value = '';
    order.value.delStartDate = null;
    order.value.delEndDate = null;
    customers2.value = [...allOrders];
};
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="조회" rounded @click="searchOrders" />
        <Button label="초기화" severity="info" rounded @click="resetFilters" />
    </div>

    <div class="font-semibold text-xl mb-4">검색</div>
    <Toolbar>
        <template #center>
            <IconField>
                <div class="flex flex-col gap-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">주문번호</label>
                            <InputGroup>
                                <InputText placeholder="ORD001" />
                                <Button icon="pi pi-search" />
                            </InputGroup>
                        </div>

                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">출하상태</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="ship" inputId="ingredient1" name="ship" value="출하대기" />
                                    <label for="ingredient1">출하대기</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="ship" inputId="ingredient2" name="ship" value="출하중" />
                                    <label for="ingredient2">출하중</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="ship" inputId="ingredient3" name="ship" value="출하완료" />
                                    <label for="ingredient3">출하완료</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div class="flex flex-col space-y-1">
                            <label class="font-semibold text-sm">거래처코드</label>
                            <InputGroup>
                                <InputText placeholder="SUP002" />
                                <Button icon="pi pi-search" class="p-button-secondary" />
                            </InputGroup>
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label class="font-semibold text-sm">* 납기일</label>
                            <div class="flex items-center space-x-2">
                                <Calendar v-model="order.delStartDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                                <span>~</span>
                                <Calendar v-model="order.delEndDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
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
        <DataTable :value="customers2" scrollable scrollHeight="200px" class="mt-6">
            <Column field="ordernum" header="주문번호" style="min-width: 100px" frozen class="font-bold" />
            <Column field="prodCode" header="제품코드" style="min-width: 100px" />
            <Column field="productName" header="제품명" style="min-width: 120px" />
            <Column field="partName" header="거래처명" style="min-width: 80px" />
            <Column field="qty" header="수량" style="min-width: 120px" />
            <Column field="addr" header="배송지" style="min-width: 100px" />
            <Column field="createDate" header="납기일자" style="min-width: 80px" />
            <Column field="deliveryDate" header="출하일자" style="min-width: 120px" />
            <Column field="manager" header="거래담당자" style="min-width: 80px" />

            <template #body="slotProps">
                <Tag :value="slotProps.data.shipState" :severity="getSeverity(slotProps.data.shipState)" :rounded="true" class="px-3 py-1 text-sm" />
            </template>
            <!-- 주문상태에 Tag 적용 -->
            <Column field="shipState" header="출하상태" style="min-width: 120px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.shipState" :severity="getSeverity(slotProps.data.shipState)" :rounded="true" class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="name" header="담당자" style="min-width: 80px" />
        </DataTable>
        <Paginator :rows="10" :totalRecords="customers2.length" :rowsPerPageOptions="[10, 20, 30]" />
    </div>
</template>
