<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import RadioButton from 'primevue/radiobutton';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import Dialog from 'primevue/dialog';
// import { OrderList } from 'primevue';

// 거래처 모달창 관련
const showModal = ref(false);
const modalType = ref('');
// var today = new Date();
const selectedSupplierCode = ref('');
const supplierInfo = ref({
    name: '',
    ceo: '',
    address: '',
    unitPrice: '',
    supplyAmount: ''
});

// 거래처 임시데이터
const supplierList = ref([
    { code: 'SUP001', name: '그린팜', ceo: '김○○', address: '서울', manager: '홍길동', mainTel: '010-1234-4567', email: 'kkkk@email.com' },
    { code: 'SUP002', name: '테존 랜치', ceo: '홍○○', address: 'LA', manager: '홍길순', mainTel: '010-1234-4568', email: 'ssss@email.com' },
    { code: 'SUP003', name: '에코팜', ceo: '이○○', address: '부산', manager: '홍길자', mainTel: '010-1234-4567', email: 'dddd@email.com' },
    { code: 'SUP004', name: '토마토', ceo: '유○○', address: '서울', manager: '홍길철', mainTel: '010-1234-4561', email: 'kkk1@email.com' },
    { code: 'SUP005', name: '감자', ceo: '감○○', address: '제주도', manager: '홍길영', mainTel: '010-1234-4562', email: 'sss1@email.com' },
    { code: 'SUP006', name: '고구마', ceo: '고○○', address: '대전', manager: '홍길유', mainTel: '010-1234-4563', email: 'ddd1@email.com' }
]);

const form = ref({
    orderId: '',
    partnerId: '',
    orderDate: '',
    orderManager: '',
    deliveryAddr: '',
    supplyPrice: ''
});

const orders = ref([
    {
        itemSeq: 1,
        quantity: 0,
        delDate: '',
        ordStatus: 1,
        spec: '',
        productName: '',
        productPrice: 0,
        supplyPrice: 0
    }
]);
const selectedOrder = ref(null);

const selectOrder = (order) => {
    selectedOrder.value = order;
};

const addOrder = () => {
    const nextIndex = orders.value.length > 0 ? Math.max(...orders.value.map((o) => o.itemSeq)) + 1 : 1;
    orders.value.push({
        itemSeq: nextIndex,
        productName: '',
        quantity: 0,
        delDate: '',
        ordStatus: 1, // 새로 추가되는 모든 주문 내역에 ordStatus: 1을 할당
        spec: '',
        productPrice: 0,
        supplyPrice: 0
    });
};

const deleteOrder = () => {
    if (selectedOrder.value) {
        orders.value = orders.value.filter((order) => order.itemSeq !== selectedOrder.value.itemSeq);
        selectedOrder.value = null;
        if (orders.value.length === 0) {
            resetOrders();
        }
    } else {
        alert('삭제할 주문내역을 먼저 선택해주세요.');
    }
};

const resetOrders = () => {
    orders.value = [
        {
            itemSeq: 1,
            productName: '',
            quantity: 0,
            delDate: '',
            spec: '',
            productPrice: 0,
            supplyPrice: 0
        }
    ];
    selectedOrder.value = null;

    // form 초기화
    form.value = {
        orderId: '',
        partnerId: '',
        orderDate: '',
        orderManager: '',
        deliveryAddr: '',
        supplyPrice: ''
    };
    selectedSupplierCode.value = '';
    supplierInfo.value = {
        name: '',
        ceo: '',
        address: '',
        unitPrice: '',
        supplyAmount: ''
    };
};

watch(
    orders,
    (newOrders) => {
        newOrders.forEach((order) => {
            order.supplyPrice = order.quantity * order.productPrice;
        });
    },
    { deep: true }
);

const totalUnitPrice = computed(() => {
    return orders.value.reduce((sum, order) => sum + order.productPrice, 0);
});
const totalSupplyAmount = computed(() => {
    return orders.value.reduce((sum, order) => sum + order.supplyPrice, 0);
});

// 거래처 선택 모달
const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;
};
const closeModal = () => {
    showModal.value = false;
};
const selectModalValue = (code) => {
    selectedSupplierCode.value = code;
    const selected = supplierList.value.find((s) => s.code === code);
    if (selected) {
        supplierInfo.value = {
            name: selected.name,
            ceo: selected.ceo,
            address: selected.address,
            manager: selected.manager,
            mainTel: selected.mainTel
        };
        form.value.partnerId = selected.code; // partnerId에 거래처코드 할당
    }
    showModal.value = false;
};

// 페이징
const currentPage = ref(1);
const pageSize = ref(3);
const totalPages = computed(() => Math.ceil(supplierList.value.length / pageSize.value));
const pagedSupplierList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return supplierList.value.slice(start, start + pageSize.value);
});

const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
form.value.orderDate = today;

// 주문 등록 함수 (날짜 변환 및 form과 orders 합쳐서 전송)
//유효성 검사
const registEmployee = async () => {
    if (!selectedSupplierCode.value) {
        alert('거래처를 선택해주세요.');
        return;
    }
    if (!form.value.deliveryAddr) {
        alert('배송지를 입력해주세요.');
        return;
    }
    // 현재 날짜를 YYYY-MM-DD 형식으로 설정 (replace 제거)
    const today = new Date().toISOString().slice(0, 10);
    form.value.orderDate = today;

    // 순차적으로 증가하는 주문번호 생성

    // 주문 상세 납기일 날짜도 YYYY-MM-DD 형식으로 변환
    const ordersForServer = orders.value.map((o) => ({
        ...o,
        delDate: o.delDate ? new Date(o.delDate).toISOString().slice(0, 10) : null
    }));

    try {
        const payload = {
            ...form.value,
            partnerId: selectedSupplierCode.value,
            orders: ordersForServer,
            supplyPrice: totalSupplyAmount.value
        };

        const res = await axios.post('/api/sales/orderRegist', payload);
        alert(res.data.message || '주문등록 성공');
        resetOrders();
    } catch (err) {
        console.error('주문등록 실패:', err);
        alert('주문등록 실패');
    }
};
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="저장" severity="success" @click="registEmployee()" rounded />
        <Button label="초기화" severity="info" rounded @click="resetOrders" />
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
                        <InputText type="text" v-model="form.deliveryAddr" />
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
                        <label class="font-semibold text-sm mb-1">주문 담당자</label>
                        <InputText type="text" v-model="form.orderManager" placeholder="담당자 이름" />
                    </div>
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">거래처명</label>
                    <InputText type="text" v-model="supplierInfo.name" disabled />
                </div>
            </IconField>
        </template>
    </Toolbar>

    <br />
    <div class="font-semibold text-xl mb-4">주문등록</div>
    <div class="p-4 border rounded-md shadow-md mt-6">
        <div
            v-for="order in orders"
            :key="order.itemSeq"
            class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 items-start cursor-pointer p-2 rounded-md transition-colors"
            :class="{ 'bg-blue-100': selectedOrder && selectedOrder.itemSeq === order.itemSeq }"
            @click="selectOrder(order)"
        >
            <div class="flex flex-col min-h-[80px]">
                <div class="flex flex-col justify-end">
                    <label class="font-semibold text-sm mb-1">주문내역번호</label>
                    <div class="text-sm font-medium text-center">{{ order.itemSeq }}</div>
                </div>
            </div>
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">제품명</label>
                <div class="flex flex-wrap gap-2">
                    <div class="flex items-center gap-1">
                        <RadioButton v-model="order.productName" :name="'productName-' + order.itemSeq" value="분말형비료" />
                        <label class="text-sm">분말형비료</label>
                    </div>
                    <div class="flex items-center gap-1">
                        <RadioButton v-model="order.productName" :name="'productName-' + order.itemSeq" value="과립형비료" />
                        <label class="text-sm">과립형비료</label>
                    </div>
                    <div class="flex items-center gap-1">
                        <RadioButton v-model="order.productName" :name="'productName-' + order.itemSeq" value="액상형 비료" />
                        <label class="text-sm">액상형 비료</label>
                    </div>
                </div>
            </div>

            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">* 수량</label>
                <InputNumber v-model="order.quantity" :min="1" showButtons class="w-full" />
            </div>

            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">* 납기일</label>
                <Calendar v-model="order.delDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
            </div>

            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">* 규격(단위 미입력)</label>
                <InputText v-model="order.spec" placeholder="예: 40" class="w-full" />
            </div>

            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">* 제품단가</label>
                <InputNumber v-model="order.productPrice" :min="0" class="w-full" placeholder="단가 입력" />
            </div>

            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">공급가액</label>
                <InputText :value="order.supplyPrice.toLocaleString()" disabled class="w-full" placeholder="자동 계산" />
            </div>
        </div>

        <div class="flex gap-3 mt-4 justify-center">
            <Button label="주문내역 추가" icon="pi pi-plus" @click="addOrder" />
        </div>
        <div class="flex gap-3 mt-4 justify-center">
            <Button label="주문내역 삭제" icon="pi pi-minus" @click="deleteOrder" :disabled="!selectedOrder || orders.length === 1" />
        </div>
    </div>

    <Dialog v-model:visible="showModal" modal header="거래처 검색" :style="{ width: '30vw' }" class="centered-dialog" @hide="closeModal">
        <div class="p-4">
            <p class="font-bold mb-3 text-lg">🔍 거래처를 선택하세요</p>
            <ul class="mb-3">
                <li
                    v-for="supplier in pagedSupplierList"
                    :key="supplier.code"
                    :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', selectedSupplierCode.value === supplier.code ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
                    @click="selectModalValue(supplier.code)"
                >
                    • {{ supplier.code }} - {{ supplier.name }} - {{ supplier.address }} - {{ supplier.ceo }} - {{ supplier.manager }} - {{ supplier.mainTel }}
                </li>
            </ul>
        </div>

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
    z-index: 1000;
}
</style>
