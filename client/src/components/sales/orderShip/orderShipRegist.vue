<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import axios from 'axios';
import Tag from 'primevue/tag';

// Helper Functions
const orderStateMap = {
    1: '주문서등록',
    2: '생산대기',
    3: '생산중',
    4: '품질검수완료',
    5: '제품입고'
};
const getStatusText = (code) => orderStateMap[code] ?? '알수없음';

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

const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// State Management
const searchForm = ref({
    partnerId: '',
    partnerName: '',
    productId: '',
    productName: '',
    startDate: null,
    endDate: null
});

const filteredShipmentOrders = ref([]);
const selectedOrder = ref(null);
const shipmentDetails = ref([]);
const selectedOrderDetails = ref([]);

const showSupplierModal = ref(false);
const supplierList = [
    { code: 'SUP001', name: '그린팜', address: '서울', manager: '홍길동' },
    { code: 'SUP002', name: '테존 랜치', address: 'LA', manager: '김미국' },
    { code: 'SUP003', name: '팜스코', address: '부산', manager: '박선우' },
    { code: 'SUP004', name: '아그로케미컬', address: '대구', manager: '최영희' }
];
// const currentPage = ref(1);
// const pageSize = ref(3);

const showProductModal = ref(false);
const productList = ref([
    { code: 'P001', name: '분말형 비료', spec: '40KG', stock: 5000 },
    { code: 'P002', name: '과립형 비료', spec: '20KG', stock: 1500 },
    { code: 'P003', name: '액상형 비료', spec: '10KG', stock: 1200 }
]);

const shipmentForm = ref({
    tradeName: '',
    shipmentDate: new Date()
});

const isSaving = ref(false);

// // Computed Properties
// const totalPages = computed(() => Math.ceil(supplierList.length / pageSize.value));
// const pagedSupplierList = computed(() => {
//     const start = (currentPage.value - 1) * pageSize.value;
//     return supplierList.slice(start, start + pageSize.value);
// });

const computedTotalOrderQuantity = computed(() => selectedOrderDetails.value.reduce((sum, item) => sum + item.quantity, 0));
const computedTotalRemainingQuantity = computed(() => selectedOrderDetails.value.reduce((sum, item) => sum + (item.quantity - (item.shippedQuantity || 0)), 0));
const computedShipmentQuantity = ref(0);

// Watchers
watch(computedTotalRemainingQuantity, (newValue) => {
    computedShipmentQuantity.value = newValue;
});

watch(selectedOrderDetails, (newSelection) => {
    if (newSelection.length > 0) {
        shipmentForm.value.tradeName = newSelection[0].partner_name;
    } else {
        shipmentForm.value.tradeName = '';
    }
});

watch(
    () => searchForm.value.partnerId,
    (newCode) => {
        const supplier = supplierList.find((s) => s.code === newCode);
        searchForm.value.partnerName = supplier ? supplier.name : '';
    }
);

watch(
    () => searchForm.value.productId,
    (newCode) => {
        const product = productList.value.find((p) => p.code === newCode);
        searchForm.value.productName = product ? product.name : '';
    }
);

// Functions
const openSupplierModal = () => {
    showSupplierModal.value = true;
};
const selectSupplier = (supplier) => {
    searchForm.value.partnerId = supplier.code;
    searchForm.value.partnerName = supplier.name;
    showSupplierModal.value = false;
};

const openProductModal = () => {
    showProductModal.value = true;
};
const selectProduct = (product) => {
    searchForm.value.productId = product.code;
    searchForm.value.productName = product.name;
    showProductModal.value = false;
};

const searchOrders = async () => {
    try {
        const queryParams = {
            partnerId: searchForm.value.partnerId || null,
            productId: searchForm.value.productId || null,
            startDate: formatDate(searchForm.value.startDate),
            endDate: formatDate(searchForm.value.endDate)
        };
        const response = await axios.get('/api/sales/shipReqOrders', { params: queryParams });

        if (response.data?.list && Array.isArray(response.data.list)) {
            filteredShipmentOrders.value = response.data.list.map((item) => ({
                orderId: item.order_id,
                partnerId: item.partner_id,
                partnerName: item.partner_name,
                manager: item.manager,
                totalQty: item.total_qty,
                deliveryAddr: item.delivery_addr,
                orderDate: item.order_date,
                ordState: getStatusText(item.ord_status),
                orderManager: item.order_manager
            }));
        } else {
            filteredShipmentOrders.value = [];
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        filteredShipmentOrders.value = [];
    }
    resetShipmentForm();
};

const loadOrderDetails = async (event) => {
    const order = event.data;
    selectedOrder.value = order;
    resetShipmentForm();

    try {
        const response = await axios.get(`/api/sales/shipReqRegist/${order.orderId}`);
        if (response.data?.list && Array.isArray(response.data.list)) {
            shipmentDetails.value = response.data.list.map((item) => ({
                ...item,
                item_seq: item.item_seq,
                order_detail_id: item.order_detail_id,
                quantity: item.quantity,
                shippedQuantity: item.shipped_qty || 0,
                stock: item.stock || null,
                shipmentId: item.shipment_id || null,
                shipped: item.quantity - (item.shipped_qty || 0) <= 0 || !!item.shipment_id
            }));
        } else {
            shipmentDetails.value = [];
        }
    } catch (error) {
        console.error('주문 상세 내역 로드 실패:', error);
        shipmentDetails.value = [];
    }
};

const saveShipment = async () => {
    if (selectedOrderDetails.value.length === 0) {
        alert('출하할 주문 상세 내역을 1건 이상 선택해주세요.');
        return;
    }

    const totalRemaining = computedTotalRemainingQuantity.value;
    if (computedShipmentQuantity.value <= 0) {
        alert('출하 수량은 0보다 커야 합니다.');
        return;
    }
    if (computedShipmentQuantity.value > totalRemaining) {
        alert('총 출하 수량이 총 잔여 수량을 초과했습니다.');
        return;
    }

    isSaving.value = true;

    try {
        const shipmentQtyPerItem = Math.floor(computedShipmentQuantity.value / selectedOrderDetails.value.length);
        const shipmentItems = selectedOrderDetails.value.map((detail) => ({
            product_code: detail.product_id,
            shipment_qty: shipmentQtyPerItem,
            shipment_date: formatDate(shipmentForm.value.shipmentDate),
            ship_status: 1,
            order_manager: detail.manager,
            product_name: detail.product_name,
            item_seq: detail.item_seq,
            order_detail_id: detail.order_detail_id
        }));

        const response = await axios.post('/api/sales/shipReqRegist', { shipmentItems });

        alert(`총 ${response.data.createdCount}건의 출하가 등록되었습니다.`);

        resetShipmentForm();
        searchOrders();
    } catch (error) {
        console.error('출하 등록 실패:', error.response?.data?.error || error.message);
        const errorMessage = error.response?.data?.error || '알 수 없는 오류가 발생했습니다.';
        alert(`출하 등록에 실패했습니다. (${errorMessage})`);
    } finally {
        isSaving.value = false;
    }
};

const resetSearch = () => {
    searchForm.value = {
        partnerId: '',
        partnerName: '',
        productId: '',
        productName: '',
        startDate: null,
        endDate: null
    };
    filteredShipmentOrders.value = [];
    resetShipmentForm();
};

const resetShipmentForm = () => {
    shipmentDetails.value = [];
    selectedOrder.value = null;
    selectedOrderDetails.value = [];
    shipmentForm.value = {
        tradeName: '',
        shipmentDate: new Date()
    };
    computedShipmentQuantity.value = 0;
};

const isRowSelectable = (event) => {
    return !event.data.shipmentId;
};

// Lifecycle Hooks
onMounted(() => {
    searchOrders();
});
</script>
<template>
    <div class="p-4 bg-gray-100 min-h-screen">
        <!-- 검색 영역 -->
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">출하 조회</h1>
            <div class="flex space-x-2">
                <Button label="조회" severity="success" rounded @click="searchOrders" />
                <Button label="초기화" severity="info" rounded @click="resetSearch" />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <!-- 거래처 -->
            <div class="flex flex-col">
                <label for="partnerId" class="font-semibold text-sm mb-1">거래처코드</label>
                <InputGroup>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="partnerId" type="text" class="w-60" v-model="searchForm.partnerId" readonly />
                        <InputIcon class="pi pi-search" @click.stop="openSupplierModal" />
                    </IconField>
                </InputGroup>
                <InputText v-model="searchForm.partnerName" placeholder="거래처명" disabled class="mt-1" />
            </div>

            <!-- 제품 -->
            <div class="flex flex-col">
                <label for="productId" class="font-semibold text-sm mb-1">제품코드</label>
                <InputGroup>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="productId" type="text" class="w-60" v-model="searchForm.productId" readonly />
                        <InputIcon class="pi pi-search" @click.stop="openProductModal" />
                    </IconField>
                </InputGroup>
                <InputText v-model="searchForm.productName" placeholder="제품명" disabled class="mt-1" />
            </div>

            <!-- 기간 -->
            <div class="flex flex-col">
                <label class="font-semibold text-sm mb-1">기간</label>
                <div class="flex gap-2">
                    <DatePicker v-model="searchForm.startDate" dateFormat="yy-mm-dd" placeholder="시작일" class="w-1/2" showIcon />
                    <DatePicker v-model="searchForm.endDate" dateFormat="yy-mm-dd" placeholder="종료일" class="w-1/2" showIcon />
                </div>
            </div>
        </div>

        <!-- 출하요청내역 -->
        <div class="font-semibold text-xl mb-2">출하요청내역</div>
        <DataTable :value="filteredShipmentOrders" scrollable scrollHeight="200px" selectionMode="single" v-model:selection="selectedOrder" @row-select="loadOrderDetails" class="mb-6 bg-white rounded shadow-sm">
            <Column field="orderId" header="주문번호" />
            <Column field="partnerName" header="거래처명" />
            <Column field="totalQty" header="총수량" />
            <Column field="orderDate" header="등록일자" />
            <Column field="ordState" header="주문상태">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.ordState" :severity="getSeverity(slotProps.data.ordState)" :rounded="true" />
                </template>
            </Column>
        </DataTable>

        <!-- 출하등록 영역 -->
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">출하등록</h1>
            <div class="flex space-x-2">
                <Button label="저장" severity="success" rounded @click="saveShipment" :disabled="isSaving" />
                <Button label="초기화" severity="info" rounded @click="resetShipmentForm" />
            </div>
        </div>
        <div class="p-4 bg-white rounded shadow-md mb-6">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">거래처명</label>
                    <InputText v-model="shipmentForm.tradeName" disabled />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">총 요청수량</label>
                    <InputText :value="computedTotalOrderQuantity" disabled />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">총 잔여수량</label>
                    <InputText :value="computedTotalRemainingQuantity" disabled />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">출하일정</label>
                    <DatePicker v-model="shipmentForm.shipmentDate" dateFormat="yy-mm-dd" showIcon />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">출하수량</label>
                    <InputNumber v-model="computedShipmentQuantity" />
                </div>
            </div>

            <DataTable :value="shipmentDetails" scrollable scrollHeight="200px" selectionMode="multiple" v-model:selection="selectedOrderDetails" :row-selectable="isRowSelectable" class="bg-white rounded shadow-sm">
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="product_name" header="제품명" />
                <Column field="quantity" header="수량" />
                <Column field="shippedQuantity" header="기출하수량" />
                <Column header="잔여수량">
                    <template #body="slotProps">
                        <span :class="{ 'text-red-500 font-bold': slotProps.data.quantity - slotProps.data.shippedQuantity <= 0 }">
                            {{ slotProps.data.quantity - slotProps.data.shippedQuantity }}
                        </span>
                    </template>
                </Column>
                <Column field="stock" header="재고" />
            </DataTable>
        </div>

        <!-- 거래처 모달 -->
        <Dialog v-model:visible="showSupplierModal" modal header="거래처 검색" :style="{ width: '30vw' }">
            <div class="p-4">
                <ul>
                    <li
                        v-for="supplier in pagedSupplierList"
                        :key="supplier.code"
                        :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', searchForm.partnerId === supplier.code ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
                        @click="selectSupplier(supplier)"
                    >
                        {{ supplier.code }} - {{ supplier.name }} - {{ supplier.address }} - {{ supplier.manager }}
                    </li>
                </ul>
            </div>
        </Dialog>

        <!-- 제품 모달 -->
        <Dialog v-model:visible="showProductModal" modal header="제품 검색" :style="{ width: '30vw' }">
            <div class="p-4">
                <ul>
                    <li
                        v-for="product in productList"
                        :key="product.code"
                        :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', searchForm.productId === product.code ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
                        @click="selectProduct(product)"
                    >
                        {{ product.code }} - {{ product.name }} (재고: {{ product.stock }})
                    </li>
                </ul>
            </div>
            <div class="flex justify-end pt-2">
                <Button label="닫기" text @click="showProductModal = false" />
            </div>
        </Dialog>
    </div>
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
