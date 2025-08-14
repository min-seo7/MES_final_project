<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import axios from 'axios';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import Dialog from 'primevue/dialog';

// 거래처 모달창 관련
const showModal = ref(false);
const modalType = ref('');

// DB 거래처 데이터
const items = ref([]);
const selectedSupplierCode = ref('');

//주문제품관련 모달창
const products = ref([]);
const showProductModal = ref(false);
const selectedOrderItemSeq = ref(null);

const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/sales/ordModalPrdList');
        products.value = response.data.list.map((item) => ({
            productId: item.product_id,
            productType: item.product_type,
            productName: item.product_name,
            specification: item.specification,
            unit: item.unit,
            price: item.price
        }));
    } catch (error) {
        console.error('제품 데이터 로드 실패:', error);
    }
};

const openProductModal = (itemSeq) => {
    selectedOrderItemSeq.value = itemSeq;
    showProductModal.value = true;
};

const selectProduct = (product) => {
    const orderToUpdate = orders.value.find((o) => o.itemSeq === selectedOrderItemSeq.value);
    if (orderToUpdate) {
        orderToUpdate.productName = product.productName;
        orderToUpdate.specification = product.specification;
        orderToUpdate.productPrice = product.price;
        orderToUpdate.productId = product.productId;
    }
    showProductModal.value = false;
};

// 주문내역 데이터 로드
const orderModal = async () => {
    try {
        const response = await axios.get('/api/sales/ordPaModalList');
        items.value = response.data.list.map((item) => ({
            partnerId: item.partner_id,
            partnerName: item.partner_name,
            ceo: item.ceo,
            address: item.address,
            manager: item.manager,
            mainTel: item.main_tel
        }));
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

// 주문 폼
const form = ref({
    orderId: '',
    partnerId: '',
    partnerName: '',
    orderDate: '',
    orderManager: '',
    deliveryAddr: '',
    supplyPrice: '',
    manager: ''
});

// 주문내역 리스트
const orders = ref([
    {
        itemSeq: 1,
        quantity: 0,
        delDate: '',
        ordStatus: 1,
        specification: '',
        productName: '',
        productId: '',
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
        ordStatus: 1,
        specification: '',
        productId: '',
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
            specification: '',
            productId: '',
            productPrice: 0,
            supplyPrice: 0
        }
    ];
    selectedOrder.value = null;

    form.value = {
        orderId: '',
        partnerId: '',
        partnerName: '',
        orderDate: '',
        orderManager: '',
        deliveryAddr: '',
        supplyPrice: '',
        manager: ''
    };
    selectedSupplierCode.value = '';
};

// 공급가액 자동 계산
watch(
    orders,
    (newOrders) => {
        newOrders.forEach((order) => {
            order.supplyPrice = order.quantity * order.productPrice;
        });
    },
    { deep: true }
);

// 총합 계산
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
    const selected = items.value.find((s) => s.partnerId === code);
    if (selected) {
        form.value.partnerId = selected.partnerId;
        form.value.partnerName = selected.partnerName;
        form.value.manager = selected.manager;
    }
    showModal.value = false;
};

// 페이징
const currentPage = ref(1);
const pageSize = ref(3);
const totalPages = computed(() => Math.ceil(items.value.length / pageSize.value));
const pagedSupplierList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return items.value.slice(start, start + pageSize.value);
});

// 오늘 날짜 기본 설정
const today = new Date().toISOString().slice(0, 10);
form.value.orderDate = today;

// 주문 등록
const registEmployee = async () => {
    if (!selectedSupplierCode.value) {
        alert('거래처를 선택해주세요.');
        return;
    }
    if (!form.value.deliveryAddr) {
        alert('배송지를 입력해주세요.');
        return;
    }

    const today = new Date().toISOString().slice(0, 10);
    form.value.orderDate = today;

    const ordersForServer = orders.value.map((o) => ({
        ...o,
        delDate: o.delDate ? new Date(o.delDate).toISOString().slice(0, 10) : null
    }));

    try {
        //주문폼데이터 + 주문항목 + 총 공급가액을 합쳐서 서버로 보낼 객체를 생성
        const payload = {
            ...form.value,
            orders: ordersForServer,
            supplyPrice: totalSupplyAmount.value
        };
        //payloat를 전송
        const res = await axios.post('/api/sales/orderRegist', payload);
        alert(res.data.message || '주문등록 성공');
        resetOrders();
    } catch (err) {
        console.error('주문등록 실패:', err);
        alert('주문등록 실패');
    }
};

onMounted(() => {
    orderModal();
    fetchProducts();
});
</script>

<template>
    <div>
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
                            <label class="font-semibold text-sm mb-1">* 배송지</label>
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
                            <label class="font-semibold text-sm mb-1">거래처 담당자</label>
                            <InputText type="text" v-model="form.manager" disabled />
                        </div>
                        <div class="flex flex-col">
                            <label class="font-semibold text-sm mb-1">주문 담당자</label>
                            <InputText type="text" v-model="form.orderManager" placeholder="담당자 이름" />
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">거래처명</label>
                        <InputText type="text" v-model="form.partnerName" disabled />
                    </div>
                </IconField>
            </template>
        </Toolbar>
        <!-- icon="pi pi-plus" -->
        <br />
        <div class="flex gap-3 mt-4 justify-end">
            <Button label="추가" @click="addOrder" rounded />
            <Button label="삭제" @click="deleteOrder" :disabled="!selectedOrder || orders.length === 1" rounded />
        </div>
        <div class="font-semibold text-xl mb-4">주문등록</div>
        <div class="p-4 border rounded-md shadow-md mt-6" style="background-color: white">
            <div
                v-for="order in orders"
                :key="order.itemSeq"
                class="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 items-start cursor-pointer p-2 rounded-md transition-colors"
                :class="{ 'bg-blue-100': selectedOrder && selectedOrder.itemSeq === order.itemSeq }"
                @click="selectOrder(order)"
            >
                <div class="flex flex-col min-h-[80px]">
                    <label class="font-semibold text-sm mb-1">주문내역번호</label>
                    <div class="text-sm font-medium text-center">{{ order.itemSeq }}</div>
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">제품명</label>
                    <InputGroup>
                        <InputText v-model="order.productName" placeholder="제품선택" readonly />
                        <Button icon="pi pi-search" @click.stop="openProductModal(order.itemSeq)" />
                    </InputGroup>
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
                    <label class="font-semibold text-sm mb-1">규격</label>
                    <InputText v-model="order.specification" class="w-full" disabled />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">제품단가</label>
                    <InputNumber v-model="order.productPrice" :min="0" class="w-full" disabled />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">공급가액</label>
                    <InputText :value="order.supplyPrice.toLocaleString()" disabled class="w-full" placeholder="자동 계산" />
                </div>
            </div>
        </div>
        <!-- ESLint 설정에서 발생한 에러 -->
        <Dialog v-model:visible="showModal" modal header="거래처 검색" :style="{ width: '30vw' }" class="centered-dialog" @hide="closeModal">
            <div class="p-4">
                <p class="font-bold mb-3 text-lg">🔍 거래처를 선택하세요</p>
                <ul class="mb-3">
                    <li
                        v-for="supplier in pagedSupplierList"
                        :key="supplier.partnerId"
                        :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', selectedSupplierCode === supplier.partnerId ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
                        @click="selectModalValue(supplier.partnerId)"
                    >
                        • {{ supplier.partnerId }} - {{ supplier.partnerName }} - {{ supplier.address }} - {{ supplier.ceo }} - {{ supplier.manager }} - {{ supplier.mainTel }}
                    </li>
                </ul>
            </div>
            <div class="flex justify-center gap-2 pb-4">
                <Button label="이전" @click="currentPage--" :disabled="currentPage === 1" size="small" />
                <span class="px-2">페이지 {{ currentPage }} / {{ totalPages }}</span>
                <Button label="다음" @click="currentPage++" :disabled="currentPage === totalPages" size="small" />
            </div>
        </Dialog>
        <!-- ESLint 설정에서 발생한 에러 -->
        <Dialog v-model:visible="showProductModal" modal header="제품 검색" :style="{ width: '30vw' }" class="centered-dialog" @hide="showProductModal = false">
            <div class="p-4">
                <p class="font-bold mb-3 text-lg">🔍 제품을 선택하세요</p>
                <ul class="mb-3">
                    <li v-for="product in products" :key="product.productId" class="cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded" @click="selectProduct(product)">
                        • {{ product.productName }} - {{ product.productType }} - {{ product.productId }} - {{ product.specification }}{{ product.unit }}
                    </li>
                </ul>
            </div>
        </Dialog>
    </div>
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
