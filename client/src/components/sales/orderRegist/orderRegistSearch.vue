<script setup>
import { ref, watch } from 'vue';
import { computed } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import RadioButton from 'primevue/radiobutton';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import Dialog from 'primevue/dialog';

//거래처 모달창 관련
const showModal = ref(false);
const modalType = ref('');
const selectedSupplierCode = ref('');
const supplierInfo = ref({
    name: '',
    ceo: '',
    address: '',
    unitPrice: '',
    supplyAmount: ''
});
//거래처 임시데이터
const supplierList = [
    {
        code: 'SUP001',
        name: '그린팜',
        ceo: '김○○',
        address: '서울',
        manager: '홍길동',
        mainTel: '010-1234-4567',
        email: 'kkkk@email.com'
    },
    {
        code: 'SUP002',
        name: '테존 랜치',
        ceo: '홍○○',
        address: 'LA',
        manager: '홍길순',
        mainTel: '010-1234-4568',
        email: 'ssss@email.com'
    },
    {
        code: 'SUP003',
        name: '에코팜',
        ceo: '이○○',
        address: '부산',
        manager: '홍길자',
        mainTel: '010-1234-4567',
        email: 'dddd@email.com'
    },
    {
        code: 'SUP004',
        name: '토마토',
        ceo: '유○○',
        address: '서울',
        manager: '홍길철',
        mainTel: '010-1234-4561',
        email: 'kkk1@email.com'
    },
    {
        code: 'SUP005',
        name: '감자',
        ceo: '감○○',
        address: '제주도',
        manager: '홍길영',
        mainTel: '010-1234-4562',
        email: 'sss1@email.com'
    },
    {
        code: 'SUP006',
        name: '고구마',
        ceo: '고○○',
        address: '대전',
        manager: '홍길유',
        mainTel: '010-1234-4563',
        email: 'ddd1@email.com'
    }
];
const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const selectModalValue = (code) => {
    selectedSupplierCode.value = code;
    const selected = supplierList.find((s) => s.code === code);
    if (selected) {
        supplierInfo.value = {
            name: selected.name,
            ceo: selected.ceo,
            address: selected.address,
            manager: selected.manager,
            mainTel: selected.mainTel
        };
    }
    showModal.value = false;
};

//모달창 거래처 수
const currentPage = ref(1);
const pageSize = ref(3); // 한 페이지당 거래처 수

const totalPages = computed(() => {
    return Math.ceil(supplierList.length / pageSize.value);
});

const pagedSupplierList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return supplierList.slice(start, start + pageSize.value);
});
//화면 접속시
const orders = ref([
    {
        orderDetailNo: 1,
        productName: '',
        qty: 0,
        deliveryDate: '',
        spec: '',
        unitPrice: 0,
        supplyAmount: 0
    }
]);
//추가 제품
const addOrder = () => {
    const nextIndex = orders.value.length + 1;
    orders.value.push({
        orderDetailNo: nextIndex,
        productName: '',
        qty: 0,
        deliveryDate: '',
        spec: '',
        unitPrice: 0,
        supplyAmount: 0
    });
};
const clearOrder = () => {};

//초기화
const resetOrders = () => {
    orders.value = [
        {
            orderDetailNo: 1,
            productName: '',
            qty: 0,
            deliveryDate: '',
            spec: '',
            unitPrice: 0,
            supplyAmount: 0
        }
    ];
};

watch(
    orders,
    (newOrders) => {
        newOrders.forEach((order) => {
            order.supplyAmount = order.qty * order.unitPrice;
        });
    },
    { deep: true }
);
//총제품단가
const totalUnitPrice = computed(() => {
    return orders.value.reduce((sum, order) => sum + order.unitPrice, 0);
});
//총 공급가액
const totalSupplyAmount = computed(() => {
    return orders.value.reduce((sum, order) => sum + order.supplyAmount, 0);
});

//저장버튼 클릭하여
const salesRegistAdd = () => {
    alert('저장');
    resetOrders();
};
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="저장" severity="success" @click="salesRegistAdd()" rounded />
        <Button label="초기화" severity="info" rounded @click="openModal('supplier')" />
    </div>

    <div class="font-semibold text-xl mb-4">검색</div>
    <Toolbar>
        <template #center>
            <IconField>
                <div class="grid grid-cols-1 md:grid-cols-6 gap-5">
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">거래처코드</label>
                        <InputGroup>
                            <InputText v-model="selectedSupplierCode" placeholder="거래처코드 선택" readonly />
                            <Button icon="pi pi-search" @click="openModal('supplier')" />
                        </InputGroup>
                    </div>
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">배송지</label>
                        <InputText type="text" v-model="supplierInfo.address" disabled />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">총제품단가</label>
                        <InputText :value="totalUnitPrice.toLocaleString()" disabled />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">총공급가액</label>
                        <InputText type="text" :value="totalSupplyAmount.toLocaleString()" disabled />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">대표자</label>
                        <InputText type="text" v-model="supplierInfo.ceo" disabled />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">거래처명</label>
                        <InputText type="text" v-model="supplierInfo.name" disabled />
                    </div>
                </div>
            </IconField>
        </template>
    </Toolbar>
    <br />
    <div class="font-semibold text-xl mb-4">주문등록</div>
    <div class="p-4 border rounded-md shadow-md mt-6">
        <div v-for="(order, index) in orders" :key="index" class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 items-start">
            <div class="flex flex-col min-h-[80px]">
                <div class="flex flex-col justify-end">
                    <label class="font-semibold text-sm mb-1">주문내역번호</label>
                    <div class="text-sm font-medium text-center">{{ order.orderDetailNo }}</div>
                </div>
            </div>
            <!-- 제품명 -->
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">제품명</label>
                <div class="flex flex-wrap gap-2">
                    <div class="flex items-center gap-1">
                        <RadioButton v-model="order.productName" inputId="product1" name="product" value="분말형비료" />
                        <label for="product1" class="text-sm">분말형비료</label>
                    </div>
                    <div class="flex items-center gap-1">
                        <RadioButton v-model="order.productName" inputId="product2" name="product" value="과립형비료" />
                        <label for="product2" class="text-sm">과립형비료</label>
                    </div>
                    <div class="flex items-center gap-1">
                        <RadioButton v-model="order.productName" inputId="product3" name="product" value="액상형 비료" />
                        <label for="product3" class="text-sm">액상형 비료</label>
                    </div>
                </div>
            </div>

            <!-- 수량 -->
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">* 수량</label>
                <InputNumber v-model="order.qty" :min="1" showButtons class="w-full" />
            </div>

            <!-- 납기일 -->
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">* 납기일</label>
                <Calendar v-model="order.deliveryDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
            </div>

            <!-- 규격 -->
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">* 규격(단위 미입력)</label>
                <InputText v-model="order.spec" placeholder="예: 40" class="w-full" />
            </div>

            <!-- 제품단가 -->
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">* 제품단가</label>
                <InputNumber v-model="order.unitPrice" :min="0" class="w-full" placeholder="단가 입력" />
            </div>

            <!-- 공급가액 -->
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">공급가액</label>
                <InputText :value="order.supplyAmount" disabled class="w-full" placeholder="자동 계산" />
            </div>
        </div>

        <div class="flex gap-3 mt-4 justify-center">
            <Button label="주문내역 추가" icon="pi pi-plus" @click="addOrder" />
        </div>
        <div class="flex gap-3 mt-4 justify-center">
            <Button label="주문내역 삭제" icon="pi pi-plus" @click="clearOrder" />
        </div>
    </div>
    <Dialog v-model:visible="showModal" modal header="거래처 검색" :style="{ width: '30vw' }" class="centered-dialog" @hide="closeModal">
        <div class="p-4">
            <p class="font-bold mb-3 text-lg">🔍 거래처를 선택하세요</p>
            <ul class="mb-3">
                <li
                    v-for="supplier in pagedSupplierList"
                    :key="supplier.code"
                    :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', selectedSupplierCode === supplier.code ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
                    @click="selectModalValue(supplier.code)"
                >
                    • {{ supplier.code }} - {{ supplier.name }} - {{ supplier.address }} - {{ supplier.ceo }} - {{ supplier.manager }} - {{ supplier.mainTel }}
                </li>
            </ul>
        </div>

        <!-- 페이징 -->
        <div class="flex justify-center gap-2 pb-4">
            <Button label="이전" @click="currentPage--" :disabled="currentPage === 1" size="small" />
            <span class="px-2">페이지 {{ currentPage }} / {{ totalPages }}</span>
            <Button label="다음" @click="currentPage++" :disabled="currentPage === totalPages" size="small" />
        </div>
    </Dialog>
</template>
<style>
.centered-dialog {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin: 0 !important;
    z-index: 1000; /* 필요 시 조정 */
}
</style>
