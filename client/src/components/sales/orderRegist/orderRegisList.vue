<script setup>
import { ref } from 'vue';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';

// 날짜 관련 예시
const today = new Date().toISOString().slice(0, 10);
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

// 라디오버튼 선택 변수 2.주문상태,3.규격 4.제품명
const calendarValue = ref(null);
const orderState = ref('');
const spec = ref('');
const productType = ref('');
// 주문내역 데이터
const customers2 = ref([
    {
        ordernum: 'ORD001',
        pid: 'P1001',
        pcode: 'SUP002',
        대표자: '김철수',
        spac: '40kg',
        qty: 100,
        addr: '서울 강남구',
        createDate: today,
        deliveryDate: nextWeek,
        orderstate: '주문서등록',
        manager: '이영희'
    },
    {
        ordernum: 'ORD002',
        pid: 'P1002',
        pcode: 'SUP003',
        대표자: '박민수',
        spac: '20kg',
        qty: 50,
        addr: '부산 해운대구',
        createDate: today,
        deliveryDate: nextWeek,
        orderstate: '생산중',
        manager: '최지훈'
    },
    {
        ordernum: 'ORD003',
        pid: 'P1003',
        pcode: 'SUP004',
        대표자: '이정은',
        spac: '40kg',
        qty: 200,
        addr: '대구 수성구',
        createDate: today,
        deliveryDate: nextWeek,
        orderstate: '제품입고',
        manager: '홍길동'
    }
]);

// 주문상태에 따른 색상 설정
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
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="조회" rounded />
        <Button label="초기화" severity="info" rounded />
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
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="orderState" inputId="ingredient1" name="orderState" value="주문서등록" />
                                    <label for="ingredient1">주문서등록</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="orderState" inputId="ingredient2" name="orderState" value="생산대기" />
                                    <label for="ingredient2">생산대기</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="orderState" inputId="ingredient3" name="orderState" value="생산중" />
                                    <label for="ingredient3">생산중</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="orderState" inputId="ingredient4" name="orderState" value="품질검수완료" />
                                    <label for="ingredient4">품질검수완료</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="orderState" inputId="ingredient5" name="orderState" value="제품입고" />
                                    <label for="ingredient">제품입고</label>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">규격</label>
                            <div class="flex flex-wrap gap-3">
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="spec" inputId="ingredient1" name="spec" value="40" />
                                    <label for="ingredient1">40</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="spec" inputId="ingredient2" name="spec" value="20" />
                                    <label for="ingredient2">20</label>
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
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="productType" inputId="ingredient1" name="product" value="분쇄형" />
                                    <label for="ingredient1">분쇄형</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="productType" inputId="ingredient2" name="product" value="과립형" />
                                    <label for="ingredient2">과립형</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="productType" inputId="ingredient3" name="product" value="액상형" />
                                    <label for="ingredient3">액상형</label>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">납기일자</label>
                            <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>
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
        <DataTable :value="customers2" scrollable scrollHeight="200px" class="mt-6">
            <Column field="ordernum" header="주문번호" style="min-width: 100px" frozen class="font-bold" />
            <Column field="pid" header="제품코드" style="min-width: 100px" />
            <Column field="pcode" header="거래처코드" style="min-width: 120px" />
            <Column field="대표자" header="대표자" style="min-width: 100px" />
            <Column field="spac" header="규격" style="min-width: 80px" />
            <Column field="qty" header="수량" style="min-width: 80px" />
            <Column field="addr" header="배송지" style="min-width: 100px" />
            <Column field="createDate" header="등록일자" style="min-width: 100px" />
            <Column field="deliveryDate" header="납기일자" style="min-width: 100px" />

            <!-- 주문상태에 Tag 적용 -->
            <Column field="orderstate" header="주문상태" style="min-width: 120px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.orderstate" :severity="getSeverity(slotProps.data.orderstate)" :rounded="true" class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="manager" header="담당자" style="min-width: 100px" />
        </DataTable>
        <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
    </div>
</template>
