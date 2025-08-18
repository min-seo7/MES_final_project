<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';

// 상태코드(int) → 상태명 매핑
const orderStateMap = {
    1: '주문서등록',
    2: '생산대기',
    3: '생산중',
    4: '품질검수완료',
    5: '제품입고'
};

// 상태명(string) → 상태코드 매핑 (필터링에 필요)
const orderStateMapReverse = computed(() => {
    return Object.fromEntries(Object.entries(orderStateMap).map(([key, value]) => [value, key]));
});

// 상태 텍스트 가져오기
const getStatusText = (code) => orderStateMap[code] ?? '알수없음';

// 검색 폼 상태
const search = ref({
    orderId: '',
    orderStatus: '',
    partCode: '',
    prodCode: '',
    manager: '',
    productName: '',
    addr: '',
    partName: '',
    spec: '',
    deliveryDate: null
});

// 검색내역에서 선택된 행
const selectedOrder = ref(null);

// 거래처 모달 관련
const showSupplierDialog = ref(false);
const suppliers = ref([]); // Changed name for clarity
const supplierCurrentPage = ref(1);
const supplierPageSize = ref(3);

const fetchSuppliers = async () => {
    try {
        const response = await axios.get('/api/sales/ordPaModalList');
        suppliers.value = response.data.list.map((item) => ({
            partnerId: item.partner_id,
            partnerName: item.partner_name,
            ceo: item.ceo,
            address: item.address,
            manager: item.manager,
            mainTel: item.main_tel
        }));
    } catch (error) {
        console.error('거래처 데이터 로드 실패:', error);
    }
};

const openSupplierModal = async () => {
    await fetchSuppliers(); // Fetch data only when modal is opened
    showSupplierDialog.value = true;
};

const selectSupplierFromDialog = (supplier) => {
    search.value.partCode = supplier.partnerId;
    search.value.partName = supplier.partnerName;
    search.value.manager = supplier.manager;
    search.value.addr = supplier.address;
    showSupplierDialog.value = false;
};

// 모달 및 제품 데이터
const showProductDialog = ref(false);
const allProducts = ref([]); // 전체 제품 데이터
const filteredProducts = ref([]); // 필터링된 제품 데이터

// 제품 모달 검색 폼
const productSearch = ref({
    prodCode: '',
    prodName: ''
});

// 제품 데이터 로드 함수 (실제 API 호출)
const fetchProducts = async () => {
    try {
        // 백엔드 API가 있다고 가정하고 호출
        // 실제 데이터와 구조가 다를 수 있으므로 필요에 따라 수정
        const response = await axios.get('/api/products/search', {
            params: {
                prodCode: productSearch.value.prodCode,
                prodName: productSearch.value.prodName
            }
        });
        allProducts.value = response.data.list.map((item) => ({
            productId: item.prod_id,
            productType: item.prod_type, // '반제품', '완제품'
            productName: item.prod_name,
            specification: item.spec,
            productPrice: item.price
        }));
        filteredProducts.value = allProducts.value;
    } catch (error) {
        console.error('제품 데이터 로드 실패:', error);
        // 예시 데이터로 대체
        allProducts.value = [
            { productId: 'P001', productType: '반제품', productName: '반제품_분말형', specification: null, productPrice: null },
            { productId: 'P001-20', productType: '완제품', productName: '분말형비료', specification: '20KG', productPrice: 5000 },
            { productId: 'P001-40', productType: '완제품', productName: '분말형비료', specification: '40KG', productPrice: 9500 },
            { productId: 'P002', productType: '완제품', productName: '완제품_과립형', specification: null, productPrice: null },
            { productId: 'P002-20', productType: '완제품', productName: '과립형비료', specification: '20KG', productPrice: 12000 },
            { productId: 'P002-40', productType: '완제품', productName: '과립형비료', specification: '40KG', productPrice: 23000 },
            { productId: 'P003-05', productType: '완제품', productName: '액상형비료', specification: '5L', productPrice: 7000 },
            { productId: 'P003-10', productType: '완제품', productName: '액상형비료', specification: '10L', productPrice: 13000 },
            { productId: 'P005', productType: '완제품', productName: '연습', specification: null, productPrice: null },
            { productId: 'P007', productType: '완제품', productName: '연습', specification: null, productPrice: null },
            { productId: 'P008', productType: '완제품', productName: '연습', specification: null, productPrice: null }
        ];
        filteredProducts.value = allProducts.value;
    }
};

// 제품 모달 열기
const openProductModal = async () => {
    await fetchProducts();
    showProductDialog.value = true;
};

// 제품 검색 필터링
const searchProducts = () => {
    filteredProducts.value = allProducts.value.filter((product) => {
        const matchesCode = !productSearch.value.prodCode || product.productId.includes(productSearch.value.prodCode);
        const matchesName = !productSearch.value.prodName || product.productName.includes(productSearch.value.prodName);
        return matchesCode && matchesName;
    });
};

const selectProduct = (event) => {
    const product = event.data;
    search.value.prodCode = product.productId;
    search.value.productName = product.productName;
    search.value.spec = product.specification;
    showProductDialog.value = false;
};

// 동적 품목 및 규격 데이터
const productList = ['분말형', '과립형', '액상형'];
const productSpecs = {
    분말형: ['20KG', '40KG'],
    과립형: ['20KG', '40KG'],
    액상형: ['5L', '10L', '20L']
};

// 품명에 따라 동적으로 변하는 규격 옵션
const specOptions = computed(() => {
    return productSpecs[search.value.productName] || [];
});

// 주문 데이터
const orders = ref([]);

// 주문 데이터 조회
const fetchOrders = async () => {
    try {
        const delDateValue = search.value.deliveryDate;
        let formattedDelDate = null;
        if (delDateValue) {
            const year = delDateValue.getFullYear();
            const month = String(delDateValue.getMonth() + 1).padStart(2, '0');
            const day = String(delDateValue.getDate()).padStart(2, '0');
            formattedDelDate = `${year}-${month}-${day}`;
        }

        const queryParams = {
            orderId: search.value.orderId || null,
            orderStatus: search.value.orderStatus ? orderStateMapReverse.value[search.value.orderStatus] : null,
            productName: search.value.productName || null,
            partnerId: search.value.partCode || null,
            delDate: formattedDelDate,
            spec: search.value.spec || null // Added spec to queryParams
        };

        const response = await axios.get('/api/sales/orderSearch', { params: queryParams });

        if (response.data?.list && Array.isArray(response.data.list)) {
            orders.value = response.data.list.map((item) => ({
                orderId: item.order_id,
                partnerId: item.partner_id,
                partnerName: item.partner_name,
                productId: item.product_id,
                productName: item.product_name,
                manager: item.manager,
                quantity: item.quantity,
                deliveryAddr: item.delivery_addr,
                orderDate: item.order_date,
                delDate: item.del_date,
                ordState: getStatusText(item.ord_status),
                orderManager: item.order_manager,
                spec: item.spec,
                orderDetailId: item.order_detail_id // ✅ 추가: 백엔드에서 받아온 order_detail_id
            }));
        } else {
            orders.value = [];
            console.warn('서버 응답에 유효한 리스트 데이터가 없습니다.', response.data);
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

// 주문 상태에 따른 Tag 색상
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

// 주문수정 폼 상태
const orderUpdate = ref({
    originDeliveryDate: '',
    changeDeliveryDate: null,
    changeReason: '',
    manager: ''
});

// 조회 실행 (now calls fetchOrders)
const searchOrders = () => {
    fetchOrders();
};

// 초기화
const resetFilters = () => {
    search.value = {
        orderId: '',
        orderStatus: '',
        partCode: '',
        prodCode: '',
        manager: '',
        productName: '',
        addr: '',
        partName: '',
        spec: '',
        deliveryDate: null
    };
    fetchOrders();
};

// 주문 수정 저장
const saveOrderUpdate = async () => {
    if (!selectedOrder.value) {
        alert('수정할 주문내역을 먼저 선택해주세요.');
        return;
    }
    if (!orderUpdate.value.changeDeliveryDate) {
        alert('변경할 납기일을 선택해주세요.');
        return;
    }
    if (!orderUpdate.value.changeReason) {
        alert('변경 사유를 입력해주세요.');
        return;
    }
    try {
        const updatePayload = {
            orderId: selectedOrder.value.orderId,
            orderDate: selectedOrder.value.orderDate, // ✅ 추가: 원본 주문 날짜
            orderDetailId: selectedOrder.value.orderDetailId, // ✅ 추가: order_detail_id
            changeDeliveryDate: orderUpdate.value.changeDeliveryDate?.toISOString().slice(0, 10),
            changeReason: orderUpdate.value.changeReason
        };
        await axios.put('/api/sales/updateOrderDelivery', updatePayload);
        alert('납기일 변경이 완료되었습니다.');
        fetchOrders(); // 변경 후 목록 새로고침
    } catch (error) {
        console.error('납기일 변경 실패:', error);
        alert('납기일 변경에 실패했습니다. 다시 시도해주세요.');
    }
};

// 행 선택 시 기존납기일 및 담당자 채움
const onOrderSelect = (event) => {
    const order = event.data;
    selectedOrder.value = { ...order }; // ✅ 추가: 선택된 행 전체를 저장
    orderUpdate.value.originDeliveryDate = order.delDate;
    orderUpdate.value.manager = order.orderManager;
};

// 거래처 모달 페이징
const supplierTotalPages = computed(() => Math.ceil(suppliers.value.length / supplierPageSize.value));
const pagedSupplierList = computed(() => {
    const start = (supplierCurrentPage.value - 1) * supplierPageSize.value;
    return suppliers.value.slice(start, start + supplierPageSize.value);
});

onMounted(() => {
    fetchOrders(); // 초기 데이터 로드
});
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl mb-4 mt-6">검색</div>
            <div class="flex space-x-2">
                <Button label="조회" rounded @click="searchOrders" class="p-button-success" />
                <Button label="초기화" severity="info" rounded @click="resetFilters" />
            </div>
        </div>

        <div class="mb-6 p-4 border rounded-md bg-gray-100">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">거래처코드</label>
                    <InputGroup>
                        <InputText v-model="search.partCode" placeholder="SUP002" readonly />
                        <Button icon="pi pi-search" class="p-button-secondary" @click="openSupplierModal" />
                    </InputGroup>
                </div>
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">제품코드</label>
                    <InputGroup>
                        <InputText v-model="search.prodCode" placeholder="P001" readonly />
                        <Button icon="pi pi-search" class="p-button-secondary" @click="openProductModal" />
                    </InputGroup>
                </div>
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">품명</label>
                    <div class="flex flex-wrap gap-3">
                        <div v-for="item in productList" :key="item" class="flex items-center gap-2">
                            <RadioButton v-model="search.productName" :inputId="item" :value="item" />
                            <label :for="item">{{ item }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">규격</label>
                    <div class="flex flex-wrap gap-3">
                        <div v-for="item in specOptions" :key="item" class="flex items-center gap-2">
                            <RadioButton v-model="search.spec" :inputId="`spec-${item}`" :value="item" />
                            <label :for="`spec-${item}`">{{ item }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">납기</label>
                    <Calendar v-model="search.deliveryDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                </div>
                <div class="flex flex-col space-y-1">
                    <label class="font-semibold text-sm">주문상태</label>
                    <div class="flex flex-wrap gap-3">
                        <div class="flex items-center gap-2" v-for="state in Object.values(orderStateMap)" :key="state">
                            <RadioButton v-model="search.orderStatus" :inputId="`orderState-${state}`" name="orderStatus" :value="state" />
                            <label :for="`orderState-${state}`">{{ state }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex space-x-6">
            <div class="w-2/3">
                <div class="font-semibold text-xl mb-4 mt-7">검색내역</div>
                <DataTable :value="orders" selectionMode="single" dataKey="orderId" v-model:selection="selectedOrder" @rowSelect="onOrderSelect" :rowHover="true">
                    <Column field="orderId" header="주문번호" style="min-width: 100px" frozen class="font-bold" />
                    <Column field="partnerId" header="거래처코드" style="min-width: 120px" />
                    <Column field="partnerName" header="거래처명" style="min-width: 120px" />
                    <Column field="productId" header="제품코드" style="min-width: 120px" />
                    <Column field="productName" header="제품명" style="min-width: 120px" />
                    <Column field="spec" header="규격" style="min-width: 80px" />
                    <Column field="manager" header="거래담당자" style="min-width: 120px" />
                    <Column field="quantity" header="수량" style="min-width: 80px" />
                    <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
                    <Column field="orderDate" header="등록일자" style="min-width: 100px" />
                    <Column field="delDate" header="납기일자" style="min-width: 100px" />
                    <Column field="ordState" header="주문상태" style="min-width: 120px">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.ordState" :severity="getSeverity(slotProps.data.ordState)" :rounded="true" class="px-3 py-1 text-sm" />
                        </template>
                    </Column>
                    <Column field="orderManager" header="담당자" style="min-width: 100px" />
                </DataTable>
                <Paginator :rows="10" :totalRecords="orders.length" :rowsPerPageOptions="[10, 20, 30]" />
            </div>

            <div class="w-1/3">
                <div class="flex justify-end space-x-2 mb-4">
                    <Button label="저장" rounded @click="saveOrderUpdate" class="p-button-success" />
                    <Button
                        label="초기화"
                        severity="info"
                        rounded
                        @click="
                            () => {
                                orderUpdate.value = { originDeliveryDate: '', changeDeliveryDate: null, changeReason: '', manager: '' };
                                selectedOrder = null; // Reset selection on update form clear
                            }
                        "
                    />
                </div>
                <div class="font-semibold text-xl mb-4 mt-6">반품등록</div>
                <div class="bg-gray-100 p-4 rounded-lg border border-gray-300">
                    <div class="grid grid-cols-1 gap-5">
                        <div class="flex flex-col space-y-1">
                            <label class="font-semibold text-sm">반품사유</label>
                            <InputText v-model="orderUpdate.changeReason" placeholder="자연재해 예정" />
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label class="font-semibold text-sm">담당자</label>
                            <InputText v-model="orderUpdate.manager" readonly />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="showSupplierDialog" modal header="거래처 검색" :style="{ width: '30vw' }" class="centered-dialog">
            <div class="p-4">
                <p class="font-bold mb-3 text-lg">🔍 거래처를 선택하세요</p>
                <ul class="mb-3">
                    <li
                        v-for="supplier in pagedSupplierList"
                        :key="supplier.partnerId"
                        :class="['cursor-pointer hover:text-blue-600 mb-2 px-2 py-1 rounded', search.partCode === supplier.partnerId ? 'bg-blue-100 text-blue-700 font-semibold' : '']"
                        @click="selectSupplierFromDialog(supplier)"
                    >
                        • {{ supplier.partnerId }} - {{ supplier.partnerName }} - {{ supplier.address }} - {{ supplier.ceo }} - {{ supplier.manager }} - {{ supplier.mainTel }}
                    </li>
                </ul>
            </div>
            <div class="flex justify-center gap-2 pb-4">
                <Button label="이전" @click="supplierCurrentPage--" :disabled="supplierCurrentPage === 1" size="small" />
                <span class="px-2">페이지 {{ supplierCurrentPage }} / {{ supplierTotalPages }}</span>
                <Button label="다음" @click="supplierCurrentPage++" :disabled="supplierCurrentPage === supplierTotalPages" size="small" />
            </div>
        </Dialog>

        <Dialog v-model:visible="showProductDialog" modal header="제품 목록" :style="{ width: '50vw' }" class="centered-dialog">
            <div class="p-4">
                <div class="flex items-center gap-4 mb-4">
                    <label class="font-semibold">제품코드</label>
                    <InputText v-model="productSearch.prodCode" @keyup.enter="searchProducts" />
                    <label class="font-semibold">제품명</label>
                    <InputText v-model="productSearch.prodName" @keyup.enter="searchProducts" />
                    <Button label="검색" icon="pi pi-search" class="p-button-success" @click="searchProducts" />
                </div>
                <DataTable :value="filteredProducts" selectionMode="single" dataKey="productId" @rowSelect="selectProduct">
                    <Column field="productType" header="제품유형"></Column>
                    <Column field="productId" header="제품코드"></Column>
                    <Column field="productName" header="제품명"></Column>
                </DataTable>
            </div>
            <template #footer>
                <div class="flex justify-center">
                    <Button label="선택 완료" severity="success" @click="showProductDialog = false" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
/* PrimeVue 모달창 가운데 정렬 스타일 */
:deep(.centered-dialog .p-dialog) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    margin: 0 !important;
    z-index: 1000;
}

/* PrimeVue DataTable 선택된 행 포커스 스타일 */
:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
    background-color: #e3f2fd !important; /* light blue background */
    color: #1565c0 !important; /* dark blue text */
    font-weight: bold;
}
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: #e8eaf6 !important; /* light hover effect */
    cursor: pointer;
}
</style>
