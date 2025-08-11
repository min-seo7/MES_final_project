<script setup>
import { ref, watch, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';

// 거래처 모달 관련
const showSupplierModal = ref(false);
const selectedSupplierCode = ref('');
const supplierList = [
    { code: 'SUP001', name: '그린팜', address: '서울', manager: '홍길동' },
    { code: 'SUP002', name: '테존 랜치', address: 'LA', manager: '김미국' },
    { code: 'SUP003', name: '팜스코', address: '부산', manager: '박선우' },
    { code: 'SUP004', name: '아그로케미컬', address: '대구', manager: '최영희' }
];

const openSupplierModal = () => {
    showSupplierModal.value = true;
};

const selectSupplier = (supplier) => {
    selectedSupplierCode.value = supplier.code;
    searchForm.value.tradeName = supplier.name;
    searchForm.value.tradeCode = supplier.code;

    const earliestDate = getEarliestDeliveryDate(supplier.code);
    searchForm.value.startDate = earliestDate;

    showSupplierModal.value = false;
};

const getEarliestDeliveryDate = (tradeCode) => {
    const orders = allShipmentOrders.value.filter((order) => order.tradeCode === tradeCode);
    if (orders.length > 0) {
        const sortedOrders = orders.sort((a, b) => a.originalDeliveryDate - b.originalDeliveryDate);
        return sortedOrders[0].originalDeliveryDate;
    }
    return null;
};

const currentPage = ref(1);
const pageSize = ref(3);
const totalPages = computed(() => Math.ceil(supplierList.length / pageSize.value));
const pagedSupplierList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return supplierList.slice(start, start + pageSize.value);
});

// 제품 모달 관련
const showProductModal = ref(false);
const productList = ref([
    { code: 'P001', name: '분말형 비료', spec: '40KG', stock: 5000 },
    { code: 'P002', name: '과립형 비료', spec: '20KG', stock: 1500 },
    { code: 'P003', name: '액상형 비료', spec: '10KG', stock: 1200 }
]);
const openProductModal = () => {
    showProductModal.value = true;
};
const selectProduct = (product) => {
    searchForm.value.productCode = product.code;
    searchForm.value.productName = product.name;
    showProductModal.value = false;
};

// 검색 폼
const searchForm = ref({
    tradeCode: '',
    tradeName: '',
    productCode: '',
    productName: '',
    startDate: null,
    endDate: null
});

// 출하 요청 내역 (더미 데이터)
const allShipmentOrders = ref([
    {
        ordernum: '001',
        tradeName: '테존 랜치',
        tradeCode: 'SUP002',
        prodCode: 'P001',
        productName: '분말형 비료',
        spec: '40KG',
        qty: 1000,
        addr: 'LA',
        regDate: new Date('2025-09-10'),
        originalDeliveryDate: new Date('2025-10-15'),
        productStatus: '제품입고',
        name: '김미국',
        shipmentQuantity: 1000,
        stock: 0
    },
    {
        ordernum: '002',
        tradeName: '테존 랜치',
        tradeCode: 'SUP002',
        prodCode: 'P001',
        productName: '분말형 비료',
        spec: '20KG',
        qty: 3000,
        addr: 'LA',
        regDate: new Date('2025-09-10'),
        originalDeliveryDate: new Date('2025-10-30'),
        productStatus: '생산중',
        name: '김미국',
        shipmentQuantity: 0,
        stock: 5000
    },
    {
        ordernum: '003',
        tradeName: '그린팜',
        tradeCode: 'SUP001',
        prodCode: 'P002',
        productName: '과립형 비료',
        spec: '20KG',
        qty: 500,
        addr: '서울',
        regDate: new Date('2025-10-01'),
        originalDeliveryDate: new Date('2025-10-25'),
        productStatus: '생산완료',
        name: '홍길동',
        shipmentQuantity: 100,
        stock: 1400
    },
    {
        ordernum: '004',
        tradeName: '테존 랜치',
        tradeCode: 'SUP002',
        prodCode: 'P003',
        productName: '액상형 비료',
        spec: '10KG',
        qty: 800,
        addr: 'LA',
        regDate: new Date('2025-10-05'),
        originalDeliveryDate: new Date('2025-11-05'),
        productStatus: '제품입고',
        name: '김미국',
        shipmentQuantity: 0,
        stock: 1200
    },
    {
        ordernum: '005',
        tradeName: '팜스코',
        tradeCode: 'SUP003',
        prodCode: 'P004',
        productName: '분말형 비료',
        spec: '20KG',
        qty: 1500,
        addr: '부산',
        regDate: new Date('2025-10-10'),
        originalDeliveryDate: new Date('2025-11-10'),
        productStatus: '제품입고',
        name: '박선우',
        shipmentQuantity: 0,
        stock: 2000
    },
    {
        ordernum: '006',
        tradeName: '그린팜',
        tradeCode: 'SUP001',
        prodCode: 'P001',
        productName: '분말형 비료',
        spec: '40KG',
        qty: 700,
        addr: '서울',
        regDate: new Date('2025-10-15'),
        originalDeliveryDate: new Date('2025-11-20'),
        productStatus: '생산중',
        name: '홍길동',
        shipmentQuantity: 0,
        stock: 5000
    },
    {
        ordernum: '007',
        tradeName: '아그로케미컬',
        tradeCode: 'SUP004',
        prodCode: 'P002',
        productName: '과립형 비료',
        spec: '20KG',
        qty: 250,
        addr: '대구',
        regDate: new Date('2025-10-20'),
        originalDeliveryDate: new Date('2025-11-25'),
        productStatus: '생산완료',
        name: '최영희',
        shipmentQuantity: 0,
        stock: 1500
    }
]);

const filteredShipmentOrders = ref([]);
const selectedOrder = ref(null);

// 조회 버튼 기능
const searchOrders = () => {
    const start = searchForm.value.startDate;
    const end = searchForm.value.endDate;

    filteredShipmentOrders.value = allShipmentOrders.value.filter((order) => {
        const isTradeCodeMatch = searchForm.value.tradeCode ? order.tradeCode === searchForm.value.tradeCode : true;
        const isProductCodeMatch = searchForm.value.productCode ? order.prodCode === searchForm.value.productCode : true;
        const isDateInRange = (!start && !end) || (order.originalDeliveryDate >= start && order.originalDeliveryDate <= end);
        return isTradeCodeMatch && isProductCodeMatch && isDateInRange;
    });
};

// 초기화 버튼 기능
const resetSearch = () => {
    searchForm.value.tradeCode = '';
    searchForm.value.tradeName = '';
    searchForm.value.productCode = '';
    searchForm.value.productName = '';
    searchForm.value.startDate = null;
    searchForm.value.endDate = null;
    filteredShipmentOrders.value = [];
};

// 출하 등록 폼
const shipmentForm = ref({
    tradeName: '',
    orderQuantity: 0,
    remainingQuantity: 0,
    shipmentDate: null,
    shipmentQuantity: 0
});

// 행 선택 시 출하 등록 폼 업데이트
const onRowSelect = (event) => {
    const data = event.data;
    const productData = productList.value.find((p) => p.code === data.prodCode);
    const currentStock = productData ? productData.stock : 0;

    shipmentForm.value.tradeName = data.tradeName;
    shipmentForm.value.orderQuantity = data.qty;

    // 잔여수량 계산: 총 재고 - 요청 수량
    const remaining = currentStock - data.qty;
    shipmentForm.value.remainingQuantity = Math.max(0, remaining);

    // 출하 수량 결정: 총 재고가 요청 수량 이상이면 요청 수량, 아니면 총 재고
    const calculatedShipmentQty = currentStock >= data.qty ? data.qty : currentStock;
    shipmentForm.value.shipmentQuantity = calculatedShipmentQty;
};

// 저장 버튼 (출하 등록)
const saveShipment = () => {
    if (!selectedOrder.value || shipmentForm.value.shipmentQuantity <= 0) {
        alert('출하할 주문을 선택하고, 출하 수량을 확인해주세요.');
        return;
    }

    const orderIndex = allShipmentOrders.value.findIndex((order) => order.ordernum === selectedOrder.value.ordernum);
    if (orderIndex !== -1) {
        const currentOrder = allShipmentOrders.value[orderIndex];

        if (shipmentForm.value.shipmentQuantity > currentOrder.qty - currentOrder.shipmentQuantity) {
            alert('출하 수량이 잔여 수량을 초과할 수 없습니다.');
            return;
        }

        if (shipmentForm.value.shipmentQuantity > currentOrder.stock) {
            alert('출하 수량이 재고 수량을 초과할 수 없습니다.');
            return;
        }

        currentOrder.stock -= shipmentForm.value.shipmentQuantity;
        currentOrder.shipmentQuantity += shipmentForm.value.shipmentQuantity;

        const productIndex = productList.value.findIndex((p) => p.code === currentOrder.prodCode);
        if (productIndex !== -1) {
            productList.value[productIndex].stock -= shipmentForm.value.shipmentQuantity;
        }
    }

    alert(`출하 등록 완료: 거래처 ${shipmentForm.value.tradeName}, 수량 ${shipmentForm.value.shipmentQuantity}`);
    resetShipmentForm();
    searchOrders();
};

const resetShipmentForm = () => {
    shipmentForm.value = {
        tradeName: '',
        orderQuantity: 0,
        remainingQuantity: 0,
        shipmentDate: null,
        shipmentQuantity: 0
    };
    selectedOrder.value = null;
};

// Watcher for tradeCode input
watch(
    () => searchForm.value.tradeCode,
    (newCode) => {
        const supplier = supplierList.find((s) => s.code === newCode);
        if (supplier) {
            searchForm.value.tradeName = supplier.name;
            searchForm.value.startDate = getEarliestDeliveryDate(newCode);
        } else {
            searchForm.value.tradeName = '';
            searchForm.value.startDate = null;
        }
    }
);

// Watcher for productCode input
watch(
    () => searchForm.value.productCode,
    (newCode) => {
        const product = productList.value.find((p) => p.code === newCode);
        if (product) {
            searchForm.value.productName = product.name;
        } else {
            searchForm.value.productName = '';
        }
    }
);
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label="조회" severity="success" rounded @click="searchOrders" />
        <Button label="초기화" severity="info" rounded @click="resetSearch" />
    </div>

    <div class="font-semibold text-xl mb-4">검색</div>
    <div class="p-0 border rounded-md shadow-md mb-8">
        <div class="p-3 grid grid-cols-4 gap-4 items-center">
            <div class="col-span-3 flex items-center h-full">
                <div class="flex items-center gap-2 w-full">
                    <InputGroup class="w-1/2">
                        <InputText v-model="searchForm.tradeCode" placeholder="거래처코드" />
                        <Button icon="pi pi-search" @click="openSupplierModal" />
                    </InputGroup>
                    <div class="w-1/2">
                        <InputText v-model="searchForm.tradeName" placeholder="거래처명" disabled />
                    </div>
                </div>
            </div>
            <div class="col-span-3 flex items-center h-full">
                <div class="flex items-center gap-2 w-full">
                    <InputGroup class="w-1/2">
                        <InputText v-model="searchForm.productCode" placeholder="제품코드" />
                        <Button icon="pi pi-search" @click="openProductModal" />
                    </InputGroup>
                    <div class="w-1/2">
                        <InputText v-model="searchForm.productName" placeholder="제품명" disabled />
                    </div>
                </div>
            </div>

            <div class="col-span-3 flex items-center h-full">
                <div class="flex items-center gap-2 w-full">
                    <Calendar v-model="searchForm.startDate" dateFormat="yy-mm-dd" showIcon class="w-1/2" />
                    <span class="text-center w-auto">~</span>
                    <Calendar v-model="searchForm.endDate" dateFormat="yy-mm-dd" showIcon class="w-1/2" />
                </div>
            </div>
        </div>
    </div>

    <div class="font-semibold text-xl mb-4">출하요청내역</div>
    <DataTable :value="filteredShipmentOrders" scrollable scrollHeight="200px" selectionMode="single" v-model:selection="selectedOrder" @row-select="onRowSelect" class="mt-4">
        <Column field="ordernum" header="주문번호" style="min-width: 100px" />
        <Column field="tradeName" header="거래처명" style="min-width: 120px" />
        <Column field="prodCode" header="제품코드" style="min-width: 120px" />
        <Column field="productName" header="제품명" style="min-width: 120px" />
        <Column field="qty" header="요청수량" style="min-width: 100px" />
        <Column field="stock" header="재고" style="min-width: 100px" />
        <Column field="originalDeliveryDate" header="납기일" style="min-width: 120px">
            <template #body="{ data }">
                {{ data.originalDeliveryDate ? data.originalDeliveryDate.toLocaleDateString() : '' }}
            </template>
        </Column>
        <Column field="productStatus" header="제품상태" style="min-width: 100px" />
    </DataTable>

    <div class="font-semibold text-xl mb-4 mt-8 flex justify-between items-center">
        <span>출하등록</span>
        <div class="space-x-2">
            <Button label="저장" severity="success" rounded @click="saveShipment" />
            <Button label="초기화" severity="info" rounded @click="resetShipmentForm" />
        </div>
    </div>
    <div class="p-4 border rounded-md shadow-md mt-4">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">거래처명</label>
                <InputText v-model="shipmentForm.tradeName" disabled />
            </div>
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">요청수량</label>
                <InputText :value="shipmentForm.orderQuantity" disabled />
            </div>
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">잔여수량</label>
                <InputText :value="shipmentForm.remainingQuantity" disabled />
            </div>
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">출하일정</label>
                <Calendar v-model="shipmentForm.shipmentDate" dateFormat="yy-mm-dd" showIcon />
            </div>
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">출하수량</label>
                <InputNumber v-model="shipmentForm.shipmentQuantity" :min="0" :max="selectedOrder ? selectedOrder.stock : 0" showButtons />
            </div>
        </div>

        <DataTable :value="filteredShipmentOrders" scrollable scrollHeight="200px" class="mt-4">
            <Column field="ordernum" header="주문번호" style="min-width: 100px" />
            <Column field="tradeName" header="거래처명" style="min-width: 120px" />
            <Column field="tradeCode" header="거래처코드" style="min-width: 120px" />
            <Column field="productName" header="제품명" style="min-width: 120px" />
            <Column field="prodCode" header="제품코드" style="min-width: 120px" />
            <Column field="qty" header="수량" style="min-width: 100px" />
            <Column field="addr" header="배송지" style="min-width: 100px" />
            <Column field="spec" header="규격" style="min-width: 80px" />
            <Column field="stock" header="재고" style="min-width: 100px" />
            <Column field="originalDeliveryDate" header="납기일" style="min-width: 120px">
                <template #body="{ data }">
                    {{ data.originalDeliveryDate ? data.originalDeliveryDate.toLocaleDateString() : '' }}
                </template>
            </Column>
            <Column field="name" header="이름" style="min-width: 80px" />
            <Column header="출하대상" style="min-width: 80px">
                <template #body="{ data }">
                    <input type="checkbox" :checked="data.ordernum === selectedOrder?.ordernum" disabled />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="showSupplierModal" modal header="거래처 검색" :style="{ width: '30vw' }" class="centered-dialog">
        <div class="p-4">
            <p class="font-bold mb-3 text-lg">🔍 거래처를 선택하세요</p>
            <ul class="mb-3">
                <li
                    v-for="supplier in pagedSupplierList"
                    :key="supplier.code"
                    :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', selectedSupplierCode === supplier.code ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
                    @click="selectSupplier(supplier)"
                >
                    • {{ supplier.code }} - {{ supplier.name }} - {{ supplier.address }} - {{ supplier.manager }}
                </li>
            </ul>
        </div>
        <div class="flex justify-center gap-2 pb-4">
            <Button label="이전" @click="currentPage--" :disabled="currentPage === 1" size="small" />
            <span class="px-2">페이지 {{ currentPage }} / {{ totalPages }}</span>
            <Button label="다음" @click="currentPage++" :disabled="currentPage === totalPages" size="small" />
        </div>
    </Dialog>

    <Dialog v-model:visible="showProductModal" modal header="제품 검색" :style="{ width: '30vw' }" class="centered-dialog">
        <div class="p-4">
            <p class="font-bold mb-3 text-lg">📦 제품을 선택하세요</p>
            <ul class="mb-3">
                <li
                    v-for="product in productList"
                    :key="product.code"
                    :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', searchForm.productCode === product.code ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
                    @click="selectProduct(product)"
                >
                    • {{ product.code }} - {{ product.name }} (재고: {{ product.stock }})
                </li>
            </ul>
        </div>
        <div class="flex justify-end pt-2">
            <Button label="닫기" @click="showProductModal = false" text />
        </div>
    </Dialog>
</template>

<style scoped>
.centered-dialog {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin: 0 !important;
    z-index: 1000;
}
</style>
