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

// 상태코드(int) → 상태명 매핑
const orderStateMap = {
    1: '주문서등록',
    2: '생산대기',
    3: '생산중',
    4: '품질검수완료',
    5: '제품입고'
};
const getStatusText = (code) => orderStateMap[code] ?? '알수없음';

// 검색 폼
const searchForm = ref({
    partnerId: '',
    partnerName: '',
    productId: '',
    productName: '',
    startDate: null,
    endDate: null
});

// 조회된 주문서 목록 (상단 테이블)
const filteredShipmentOrders = ref([]);
// 선택된 주문서 (상단 테이블에서 선택)
const selectedOrder = ref(null);
// 조회된 주문 상세 내역 (하단 테이블)
const shipmentDetails = ref([]);
// 여러 개의 주문 상세 내역 선택 (하단 테이블)
const selectedOrderDetails = ref([]);

// 거래처 모달 관련
const showSupplierModal = ref(false);
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
    searchForm.value.partnerId = supplier.code;
    searchForm.value.partnerName = supplier.name;
    showSupplierModal.value = false;
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
    searchForm.value.productId = product.code;
    searchForm.value.productName = product.name;
    showProductModal.value = false;
};

// 날짜 UTC기준 하루 전날 데이터 전송문제
const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 조회 버튼 기능: 상단 주문서 목록 API 호출
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
    resetShipmentForm(); // 상단 조회시 하단 폼 초기화
};

// 상단 테이블 행 선택 시, 하단에 주문 상세 내역을 불러오는 함수
const loadOrderDetails = async (event) => {
    const order = event.data;
    selectedOrder.value = order;

    // 이전에 선택된 상세 내역과 폼을 초기화 (새로운 주문서 선택 시)
    resetShipmentForm();

    try {
        const response = await axios.get(`/api/sales/shipReqRegist/${order.orderId}`);
        if (response.data?.list && Array.isArray(response.data.list)) {
            shipmentDetails.value = response.data.list.map((item) => ({
                ...item,
                // 백엔드 API에서 제공하는 올바른 필드명을 사용
                item_seq: item.item_seq,
                order_detail_id: item.order_detail_id,
                quantity: item.quantity,
                shippedQuantity: item.shipped_qty || 0,
                stock: item.stock || null
            }));
        } else {
            shipmentDetails.value = [];
        }
    } catch (error) {
        console.error('주문 상세 내역 로드 실패:', error);
        shipmentDetails.value = [];
    }
};

// 상태별 색상
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

// 초기화 버튼 기능
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
    resetShipmentForm(); // 검색 초기화 시 하단 폼도 초기화
};

// 출하 등록 폼
const shipmentForm = ref({
    tradeName: '',
    shipmentDate: new Date()
});

const computedTotalOrderQuantity = computed(() => selectedOrderDetails.value.reduce((sum, item) => sum + item.quantity, 0));
const computedTotalRemainingQuantity = computed(() => selectedOrderDetails.value.reduce((sum, item) => sum + (item.quantity - (item.shippedQuantity || 0)), 0));
const computedShipmentQuantity = ref(0);

// 하단 테이블에서 체크박스 선택 변경 시, 폼 필드 업데이트
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

// 저장 버튼 (출하 등록)
const saveShipment = async () => {
    if (selectedOrderDetails.value.length === 0) {
        alert('출하할 주문 상세 내역을 1건 이상 선택해주세요.');
        return;
    }
    if (computedShipmentQuantity.value > computedTotalRemainingQuantity.value) {
        alert('출하 수량은 총 잔여 수량을 초과할 수 없습니다.');
        return;
    }
    try {
        const shipmentItems = selectedOrderDetails.value.map((detail) => ({
            product_code: detail.product_id,
            shipment_qty: detail.quantity,
            shipment_date: formatDate(shipmentForm.value.shipmentDate),
            ship_status: 1,
            order_manager: detail.manager,
            product_name: detail.product_name,
            item_seq: detail.item_seq,
            order_detail_id: detail.order_detail_id
        }));

        await axios.post('/api/sales/shipReqRegist', { shipmentItems });
        alert(`총 ${selectedOrderDetails.value.length}건의 출하가 등록되었습니다.`);

        // 출하 등록 후 화면을 최신 데이터로 업데이트
        resetShipmentForm();
        searchOrders();
    } catch (error) {
        console.error('출하 등록 실패:', error);
        alert('출하 등록에 실패했습니다. 다시 시도해주세요.');
    }
};

const resetShipmentForm = () => {
    shipmentDetails.value = []; // 하단 테이블 데이터 초기화
    selectedOrder.value = null; // 상단 테이블 선택 해제
    selectedOrderDetails.value = []; // 체크박스 선택 초기화
    shipmentForm.value = {
        tradeName: '',
        shipmentDate: null
    };
    computedShipmentQuantity.value = 0;
};

// Watcher for partnerId
watch(
    () => searchForm.value.partnerId,
    (newCode) => {
        const supplier = supplierList.find((s) => s.code === newCode);
        searchForm.value.partnerName = supplier ? supplier.name : '';
    }
);

// Watcher for productId
watch(
    () => searchForm.value.productId,
    (newCode) => {
        const product = productList.value.find((p) => p.code === newCode);
        searchForm.value.productName = product ? product.name : '';
    }
);

onMounted(() => {
    searchOrders();
});
</script>
<template>
    <div>
        <div class="flex justify-end mb-4 space-x-2">
            <Button label="조회" severity="success" rounded @click="searchOrders" />
            <Button label="초기화" severity="info" rounded @click="resetSearch" />
        </div>

        <div class="font-semibold text-xl mb-4">검색</div>
        <div class="p-0 border rounded-md shadow-md mb-8" style="background-color: white">
            <div class="p-3 grid grid-cols-4 gap-4 items-center">
                <div class="col-span-3 flex items-center h-full">
                    <div class="flex items-center gap-2 w-full">
                        <InputGroup class="w-1/2">
                            <InputText v-model="searchForm.partnerId" placeholder="거래처코드" />
                            <Button icon="pi pi-search" @click="openSupplierModal" />
                        </InputGroup>
                        <div class="w-1/2">
                            <InputText v-model="searchForm.partnerName" placeholder="거래처명" disabled />
                        </div>
                    </div>
                </div>
                <div class="col-span-3 flex items-center h-full">
                    <div class="flex items-center gap-2 w-full">
                        <InputGroup class="w-1/2">
                            <InputText v-model="searchForm.productId" placeholder="제품코드" />
                            <Button icon="pi pi-search" @click="openProductModal" />
                        </InputGroup>
                        <div class="w-1/2">
                            <InputText v-model="searchForm.productName" placeholder="제품명" disabled />
                        </div>
                    </div>
                </div>

                <div class="col-span-3 flex items-center h-full">
                    <div class="flex items-center gap-2 w-full">
                        <DatePicker v-model="searchForm.startDate" dateFormat="yy-mm-dd" placeholder="시작일" class="w-1/2" showIcon />
                        <DatePicker v-model="searchForm.endDate" dateFormat="yy-mm-dd" placeholder="종료일" class="w-1/2" showIcon />
                    </div>
                </div>
            </div>
        </div>

        <div class="font-semibold text-xl mb-4">출하요청내역</div>
        <DataTable :value="filteredShipmentOrders" scrollable scrollHeight="200px" selectionMode="single" v-model:selection="selectedOrder" @row-select="loadOrderDetails" class="mt-4">
            <Column field="orderId" header="주문번호" style="min-width: 120px" />
            <Column field="partnerId" header="거래처번호" style="min-width: 120px" />
            <Column field="partnerName" header="거래처명" style="min-width: 120px" />
            <Column field="manager" header="거래담당자" style="min-width: 120px" />
            <Column field="totalQty" header="총수량" style="min-width: 80px" />
            <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
            <Column field="orderDate" header="등록일자" style="min-width: 100px" />
            <Column field="ordState" header="주문상태" style="min-width: 120px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.ordState" :severity="getSeverity(slotProps.data.ordState)" :rounded="true" class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="orderManager" header="영업담당자" style="min-width: 120px" />
        </DataTable>

        <div class="font-semibold text-xl mb-4 mt-8 flex justify-between items-center">
            <span>출하등록</span>
            <div class="space-x-2">
                <Button label="저장" severity="success" rounded @click="saveShipment" />
                <Button label="초기화" severity="info" rounded @click="resetShipmentForm" />
            </div>
        </div>
        <div class="p-4 border rounded-md shadow-md mt-4" style="background-color: white">
            <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
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

            <DataTable :value="shipmentDetails" scrollable scrollHeight="200px" selectionMode="multiple" v-model:selection="selectedOrderDetails" class="mt-4">
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="partner_id" header="거래처코드" style="min-width: 120px" />
                <Column field="partner_name" header="거래처명" style="min-width: 120px" />
                <Column field="product_id" header="제품코드" style="min-width: 120px" />
                <Column field="product_name" header="제품명" style="min-width: 120px" />
                <Column field="manager" header="거래담당자" style="min-width: 120px" />
                <Column field="quantity" header="수량" style="min-width: 80px" />
                <Column field="delivery_addr" header="배송지" style="min-width: 100px" />
                <Column field="order_date" header="등록일자" style="min-width: 100px" />
                <Column field="del_date" header="납기일자" style="min-width: 100px" />
                <Column field="ord_status" header="주문상태" style="min-width: 120px">
                    <template #body="slotProps">
                        <Tag :value="getStatusText(slotProps.data.ord_status)" :severity="getSeverity(getStatusText(slotProps.data.ord_status))" :rounded="true" class="px-3 py-1 text-sm" />
                    </template>
                </Column>
                <Column field="stock" header="재고" style="min-width: 100px" />
            </DataTable>
        </div>

        <Dialog v-model:visible="showSupplierModal" modal header="거래처 검색" :style="{ width: '30vw' }" class="centered-dialog">
            <div class="p-4">
                <p class="font-bold mb-3 text-lg">🔍 거래처를 선택하세요</p>
                <ul class="mb-3">
                    <li
                        v-for="supplier in pagedSupplierList"
                        :key="supplier.code"
                        :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', searchForm.partnerId === supplier.code ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
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
                        :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', searchForm.productId === product.code ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
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
