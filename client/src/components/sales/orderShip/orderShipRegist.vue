<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar'; // DatePicker 대신 Calendar 사용
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';
import axios from 'axios';

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
const supplierList = ref([]); // 서버에서 불러올 데이터를 담을 변수
const selectedSupplier = ref(null); // DataTable에서 선택된 객체

// 제품 모달 관련
const showProductModal = ref(false);
const productList = ref([]); // 서버에서 불러올 데이터를 담을 변수
const selectedProduct = ref(null); // DataTable에서 선택된 객체

// 날짜 포맷팅
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// --- API 호출 함수 (로직 분리) ---
const fetchSuppliers = async () => {
    try {
        const response = await axios.get('/api/sales/ordPaModalList'); // 실제 API 엔드포인트로 변경
        supplierList.value = response.data.list.map((item) => ({
            code: item.partner_id,
            name: item.partner_name,
            address: item.address,
            manager: item.manager
        }));
    } catch (error) {
        console.error('거래처 데이터 로드 실패:', error);
    }
};

const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/sales/ordModalPrdList'); // 실제 API 엔드포인트로 변경
        productList.value = response.data.list.map((item) => ({
            code: item.product_id,
            name: item.product_name,
            spec: item.specification,
            stock: item.stock || 0
        }));
    } catch (error) {
        console.error('제품 데이터 로드 실패:', error);
    }
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

        filteredShipmentOrders.value =
            response.data?.list?.map((item) => ({
                ...item,
                orderId: item.order_id,
                partnerId: item.partner_id,
                partnerName: item.partner_name,
                manager: item.manager,
                totalQty: item.total_qty,
                deliveryAddr: item.delivery_addr,
                orderDate: item.order_date,
                ordState: getStatusText(item.ord_status),
                orderManager: item.order_manager
            })) || [];
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
    resetShipmentForm();

    try {
        const response = await axios.get(`/api/sales/shipReqRegist/${order.orderId}`);
        shipmentDetails.value =
            response.data?.list?.map((item) => ({
                ...item,
                item_seq: item.item_seq,
                order_detail_id: item.order_detail_id,
                quantity: item.quantity,
                shippedQuantity: item.shipped_qty || 0,
                stock: item.stock || null,
                shipmentId: item.shipment_id || null
            })) || [];
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
    resetShipmentForm();
};

// 출하 등록 폼
const shipmentForm = ref({
    tradeName: '',
    shipmentDate: new Date()
});
const isSaving = ref(false);

const computedTotalOrderQuantity = computed(() => selectedOrderDetails.value.reduce((sum, item) => sum + item.quantity, 0));
const computedTotalRemainingQuantity = computed(() => selectedOrderDetails.value.reduce((sum, item) => sum + (item.quantity - (item.shippedQuantity || 0)), 0));
const computedShipmentQuantity = ref(0);

watch(computedTotalRemainingQuantity, (newValue) => {
    computedShipmentQuantity.value = newValue;
});
watch(selectedOrderDetails, (newSelection) => {
    shipmentForm.value.tradeName = newSelection.length > 0 ? newSelection[0].partner_name : '';
});

// 저장 버튼 (출하 등록)
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

        resetShipmentForm();
        searchOrders();
    } catch (error) {
        console.error('출하 등록 실패:', error);
        alert('출하 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
        isSaving.value = false;
    }
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

// 이미 출하된 품목은 선택 불가능하도록 설정
const isRowSelectable = (event) => {
    return !event.data.shipmentId;
};

// 모달 열기/선택 함수
const openSupplierModal = () => {
    showSupplierModal.value = true;
    fetchSuppliers(); // 모달 열 때 데이터 로드
};
const selectSupplier = (event) => {
    const supplier = event.data;
    searchForm.value.partnerId = supplier.code;
    searchForm.value.partnerName = supplier.name;
    showSupplierModal.value = false;
};
const openProductModal = () => {
    showProductModal.value = true;
    fetchProducts(); // 모달 열 때 데이터 로드
};
const selectProduct = (event) => {
    const product = event.data;
    searchForm.value.productId = product.code;
    searchForm.value.productName = product.name;
    showProductModal.value = false;
};

onMounted(() => {
    searchOrders();
});
</script>

<template>
    <div class="p-4 bg-gray-100 min-h-screen">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">출하 조회</h1>
            <div class="flex space-x-2">
                <Button label="조회" severity="success" rounded @click="searchOrders" />
                <Button label="초기화" severity="info" rounded @click="resetSearch" />
            </div>
        </div>

        <div class="p-4 border rounded-md shadow-md mb-8" style="background-color: white">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">거래처</label>
                    <div class="flex gap-2">
                        <InputGroup>
                            <IconField iconPosition="right">
                                <InputText v-model="searchForm.partnerId" placeholder="거래처코드" />
                                <InputIcon class="pi pi-search cursor-pointer" @click="openSupplierModal" />
                            </IconField>
                        </InputGroup>
                        <InputText v-model="searchForm.partnerName" placeholder="거래처명" disabled />
                    </div>
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">제품</label>
                    <div class="flex gap-2">
                        <InputGroup>
                            <IconField iconPosition="right">
                                <InputText v-model="searchForm.productId" placeholder="제품코드" />
                                <InputIcon class="pi pi-search cursor-pointer" @click="openProductModal" />
                            </IconField>
                        </InputGroup>
                        <InputText v-model="searchForm.productName" placeholder="제품명" disabled />
                    </div>
                </div>
                <div class="flex flex-col col-span-2">
                    <label class="font-semibold text-sm mb-1">기간</label>
                    <div class="flex gap-2">
                        <Calendar v-model="searchForm.startDate" dateFormat="yy-mm-dd" placeholder="시작일" class="w-1/2" showIcon />
                        <Calendar v-model="searchForm.endDate" dateFormat="yy-mm-dd" placeholder="종료일" class="w-1/2" showIcon />
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
                <Button label="저장" severity="success" rounded @click="saveShipment" :disabled="isSaving" />
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
                    <Calendar v-model="shipmentForm.shipmentDate" dateFormat="yy-mm-dd" showIcon />
                </div>
                <div class="flex flex-col">
                    <label class="font-semibold text-sm mb-1">출하수량</label>
                    <InputNumber v-model="computedShipmentQuantity" />
                </div>
            </div>

            <DataTable :value="shipmentDetails" scrollable scrollHeight="200px" selectionMode="multiple" v-model:selection="selectedOrderDetails" :row-selectable="isRowSelectable" class="mt-4">
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

        <Dialog v-model:visible="showSupplierModal" modal header="거래처 검색" :style="{ width: '50vw' }">
            <DataTable :value="supplierList" selectionMode="single" v-model:selection="selectedSupplier" @row-select="selectSupplier">
                <Column field="code" header="거래처코드" />
                <Column field="name" header="거래처명" />
                <Column field="address" header="주소" />
                <Column field="manager" header="담당자" />
            </DataTable>
        </Dialog>

        <Dialog v-model:visible="showProductModal" modal header="제품 검색" :style="{ width: '50vw' }">
            <DataTable :value="productList" selectionMode="single" v-model:selection="selectedProduct" @row-select="selectProduct">
                <Column field="code" header="제품코드" />
                <Column field="name" header="제품명" />
                <Column field="spec" header="규격" />
                <Column field="stock" header="재고" />
            </DataTable>
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
