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
        returbnum: 'RETURN001',
        prodCode: 'P1001',
        partName: '농협',
        productName: '분말형',
        partCode: 'SUP002',
        manager: '홍oo',
        qty: 1000,
        addr: '서울 강남구',
        deliveryDate: nextWeek,
        createDate: nextWeek,
        modifyDate: today,
        modifyReason: '자연재해발생.'
    }
];

// 화면에 표시할 주문내역
const customers2 = ref([...allOrders]);

// 주문상태에 따른 색상
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
                                    <RadioButton v-model="ship" inputId="ingredient1" name="ship" value="주문서등록" />
                                    <label for="ingredient1">주문서등록</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="ship" inputId="ingredient2" name="ship" value="생산중" />
                                    <label for="ingredient2">생산중</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="ship" inputId="ingredient3" name="ship" value="제품입고" />
                                    <label for="ingredient3">제품입고</label>
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
                            <label class="font-semibold text-sm mb-1">* 납기일</label>
                            <Calendar v-model="order.delStartDate" dateFormat="yy-mm-dd" showIcon class="w-full" />~
                            <Calendar v-model="order.delEndDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                        </div>
                    </div>
                </div>
            </IconField>
        </template>
    </Toolbar>

    <br />
    <div class="font-semibold text-xl mb-4">
        주문내역
        <DataTable :value="customers2" scrollable scrollHeight="200px" class="mt-8">
            <Column field="ordernum" header="주문번호" style="min-width: 100px" frozen class="font-bold" />
            <Column field="prodCode" header="제품코드" style="min-width: 100px" />
            <Column field="productName" header="제품명" style="min-width: 120px" />
            <Column field="partName" header="거래처명" style="min-width: 80px" />
            <Column field="qty" header="수량" style="min-width: 120px" />
            <Column field="addr" header="배송지" style="min-width: 100px" />
            <Column field="createDate" header="납기일자" style="min-width: 80px" />
            <Column field="deliveryDate" header="출하일자" style="min-width: 120px" />
            <Column field="manager" header="담당자" style="min-width: 80px" />
            <template #body="slotProps">
                <Tag :value="slotProps.data.returnState" :severity="getSeverity(slotProps.data.returnState)" :rounded="true" class="px-3 py-1 text-sm" />
            </template>
            <!-- 주문상태에 Tag 적용 -->
            <Column field="returnState" header="출하상태" style="min-width: 120px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.returnState" :severity="getSeverity(slotProps.data.returnState)" :rounded="true" class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="modifyReason" header="수정사유" style="min-width: 200px" />
            <Column field="manager" header="담당자" style="min-width: 100px" />
        </DataTable>
        <Paginator :rows="10" :totalRecords="customers2.length" :rowsPerPageOptions="[10, 20, 30]" />
    </div>
</template>
