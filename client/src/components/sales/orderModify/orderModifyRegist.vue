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
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Toolbar from 'primevue/toolbar';

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
const allSuppliers = ref([]);
const filteredSuppliers = ref([]);
const selectedSupplierFromDialog = ref(null);
const supplierSearch = ref({
    partnerId: '',
    partnerName: ''
});

// 거래처 데이터 로드 및 필터링
const fetchSuppliers = async () => {
    try {
        const response = await axios.get('/api/sales/ordPaModalList', {
            params: {
                partnerId: supplierSearch.value.partnerId,
                partnerName: supplierSearch.value.partnerName
            }
        });
        allSuppliers.value = response.data.list.map((item) => ({
            partnerId: item.partner_id,
            partnerName: item.partner_name,
            ceo: item.manager,
            address: item.address,
            manager: item.manager,
            mainTel: item.main_tel
        }));
        filteredSuppliers.value = allSuppliers.value;
    } catch (error) {
        console.error('거래처 데이터 로드 실패:', error);
        allSuppliers.value = [];
        filteredSuppliers.value = [];
    }
};

// 거래처 모달 열기
const openSupplierModal = async () => {
    supplierSearch.value = { partnerId: '', partnerName: '' };
    selectedSupplierFromDialog.value = null;
    await fetchSuppliers();
    showSupplierDialog.value = true;
};

// // 거래처 검색 필터링 로직
// const searchSuppliers = async () => {
//     await fetchSuppliers();
// };

// "선택 완료" 버튼 클릭 시
const selectSupplierAndClose = () => {
    if (selectedSupplierFromDialog.value) {
        search.value.partCode = selectedSupplierFromDialog.value.partnerId;
        search.value.partName = selectedSupplierFromDialog.value.partnerName;
    }
    showSupplierDialog.value = false;
};

// 제품 모달 관련
const showProductDialog = ref(false);
const allProducts = ref([]);
const filteredProducts = ref([]);
const selectedProductFromDialog = ref(null);
const productSearch = ref({
    prodCode: '',
    prodName: ''
});

const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/sales/ordModalPrdList', {
            params: {
                prodCode: productSearch.value.prodCode,
                prodName: productSearch.value.prodName
            }
        });
        allProducts.value = response.data.list.map((item) => ({
            productId: item.product_id,
            productType: item.product_type,
            productName: item.product_name,
            specification: item.specification,
            productPrice: item.product_price,
            unit: item.unit,
            price: item.price
        }));
        filteredProducts.value = allProducts.value;
    } catch (error) {
        console.error('제품 데이터 로드 실패:', error);
        allProducts.value = [];
        filteredProducts.value = [];
    }
};

// 제품 모달 열기
const openProductModal = async () => {
    productSearch.value = { prodCode: '', prodName: '' };
    await fetchProducts();
    selectedProductFromDialog.value = null;
    showProductDialog.value = true;
};

// // 제품 검색 필터링 로직
// const searchProducts = async () => {
//     await fetchProducts();
// };

// "선택 완료" 버튼 클릭 시
const selectProductAndClose = () => {
    if (selectedProductFromDialog.value) {
        search.value.prodCode = selectedProductFromDialog.value.productId;
        search.value.productName = selectedProductFromDialog.value.productName;
    }
    showProductDialog.value = false;
};

// 주문 데이터 및 페이지네이션 상태
const orders = ref([]);
const totalRecords = ref(0);
const first = ref(0);
const rows = ref(5);
const paginatedOrders = computed(() => {
    return orders.value.slice(first.value, first.value + rows.value);
});

// 주문 데이터 조회
const fetchOrders = async () => {
    try {
        const delDateValue = search.value.deliveryDate;
        let formattedDelDate = null;
        if (delDateValue instanceof Date) {
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
            spec: search.value.spec || null
        };

        const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(([_, value]) => value !== null && value !== '' && value !== undefined));

        const response = await axios.get('/api/sales/delDateSearch', { params: filteredParams });

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
                orderDetailId: item.order_detail_id
            }));
            totalRecords.value = orders.value.length;
            first.value = 0;
        } else {
            orders.value = [];
            totalRecords.value = 0;
            console.warn('서버 응답에 유효한 리스트 데이터가 없습니다.', response.data);
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

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

const searchOrders = () => {
    fetchOrders();
};

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
        const changeDateValue = orderUpdate.value.changeDeliveryDate;
        let formattedChangeDate = null;
        if (changeDateValue instanceof Date) {
            const year = changeDateValue.getFullYear();
            const month = String(changeDateValue.getMonth() + 1).padStart(2, '0');
            const day = String(changeDateValue.getDate()).padStart(2, '0');
            formattedChangeDate = `${year}-${month}-${day}`;
        } else {
            formattedChangeDate = changeDateValue;
        }

        const updatePayload = {
            orderId: selectedOrder.value.orderId,
            orderDate: selectedOrder.value.orderDate,
            orderDetailId: selectedOrder.value.orderDetailId,
            changeDeliveryDate: formattedChangeDate,
            changeReason: orderUpdate.value.changeReason
        };
        await axios.put('/api/sales/updateOrderDelivery', updatePayload);
        alert('납기일 변경이 완료되었습니다.');
        fetchOrders();
    } catch (error) {
        console.error('납기일 변경 실패:', error);
        alert('납기일 변경에 실패했습니다. 다시 시도해주세요.');
    }
};

const onOrderSelect = (event) => {
    const order = event.data;
    selectedOrder.value = { ...order };
    orderUpdate.value.originDeliveryDate = order.delDate;
    orderUpdate.value.manager = order.orderManager;
};

const onPage = (event) => {
    first.value = event.first;
    rows.value = event.rows;
};

onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">검색</h1>
            <div class="flex space-x-2">
                <Button label="조회" rounded @click="searchOrders" />
                <Button label="초기화" severity="info" rounded @click="resetFilters" />
            </div>
        </div>
        <Toolbar class="mb-4">
            <template #center>
                <div class="flex flex-wrap gap-6 p-4">
                    <div class="flex flex-col">
                        <label for="partCode" class="font-semibold text-sm mb-1">거래처코드</label>
                        <InputGroup>
                            <IconField iconPosition="left">
                                <InputText id="partCode" type="text" class="w-60" v-model="search.partCode" readonly />
                                <InputIcon class="pi pi-search" @click="openSupplierModal" />
                            </IconField>
                        </InputGroup>
                    </div>

                    <div class="flex flex-col">
                        <label for="prodCode" class="font-semibold text-sm mb-1">제품코드</label>
                        <InputGroup>
                            <IconField iconPosition="left">
                                <InputText id="prodCode" type="text" class="w-60" v-model="search.prodCode" readonly />
                                <InputIcon class="pi pi-search" @click="openProductModal" />
                            </IconField>
                        </InputGroup>
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm">납기일</label>
                        <Calendar v-model="search.deliveryDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                    </div>
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm">주문상태</label>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex items-center gap-2" v-for="state in Object.values(orderStateMap)" :key="state">
                                <RadioButton v-model="search.orderStatus" :inputId="`orderState-${state}`" name="orderStatus" :value="state" />
                                <label :for="`orderState-${state}`">{{ state }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Toolbar>

        <div class="flex space-x-6">
            <div class="w-2/3">
                <br />
                <div class="font-semibold text-xl mb-4 mt-7">검색내역</div>
                <DataTable :value="paginatedOrders" selectionMode="single" dataKey="orderDetailId" v-model:selection="selectedOrder" @rowSelect="onOrderSelect" :rowHover="true">
                    <Column field="orderId" header="주문번호" style="min-width: 100px" />
                    <Column field="partnerId" header="거래처코드" style="min-width: 120px" />
                    <Column field="partnerName" header="거래처명" style="min-width: 120px" />
                    <Column field="productId" header="제품코드" style="min-width: 120px" />
                    <Column field="productName" header="제품명" style="min-width: 120px" />
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
                <Paginator v-model:first="first" :rows="rows" :totalRecords="totalRecords" @page="onPage" />
            </div>

            <div class="w-1/3">
                <div class="flex justify-end space-x-2 mb-4">
                    <Button label="저장" rounded @click="saveOrderUpdate" />
                    <Button
                        label="초기화"
                        severity="info"
                        rounded
                        @click="
                            () => {
                                orderUpdate.value = { originDeliveryDate: '', changeDeliveryDate: null, changeReason: '', manager: '' };
                                selectedOrder.value = null;
                            }
                        "
                    />
                </div>

                <div class="font-semibold text-xl mb-4 mt-6">수정</div>
                <div class="bg-gray-100 p-4 rounded-lg border border-gray-300" style="background-color: white">
                    <div class="grid grid-cols-1 gap-5">
                        <div class="flex flex-col space-y-1">
                            <label class="font-semibold text-sm">기존납기일</label>
                            <InputText v-model="orderUpdate.originDeliveryDate" readonly style="background-color: lightgrey" />
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label class="font-semibold text-sm">변경납기일</label>
                            <Calendar v-model="orderUpdate.changeDeliveryDate" dateFormat="yy-mm-dd" showIcon />
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label class="font-semibold text-sm">변경사유</label>
                            <InputText v-model="orderUpdate.changeReason" placeholder="자연재해 예정" />
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label class="font-semibold text-sm">담당자</label>
                            <InputText v-model="orderUpdate.manager" readonly style="background-color: lightgrey" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="showSupplierDialog" modal header="거래처 검색" :style="{ width: '50vw' }" class="centered-dialog">
            <div class="p-4">
                <DataTable :value="filteredSuppliers" selectionMode="single" dataKey="partnerId" v-model:selection="selectedSupplierFromDialog" :rowHover="true" :paginator="true" :rows="5">
                    <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                    <Column field="partnerId" header="거래처코드"></Column>
                    <Column field="partnerName" header="거래처명"></Column>
                    <Column field="ceo" header="대표자"></Column>
                    <Column field="address" header="주소"></Column>
                    <Column field="manager" header="담당자"></Column>
                    <Column field="mainTel" header="전화번호"></Column>
                </DataTable>
            </div>
            <template #footer>
                <div class="w-full flex justify-center">
                    <Button label="선택 완료" @click="selectSupplierAndClose" />
                </div>
            </template>
        </Dialog>

        <Dialog v-model:visible="showProductDialog" modal header="제품 목록" :style="{ width: '50vw' }" class="centered-dialog">
            <div class="p-4">
                <DataTable :value="filteredProducts" selectionMode="single" dataKey="productId" v-model:selection="selectedProductFromDialog" :rowHover="true" :paginator="true" :rows="5">
                    <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                    <Column field="productType" header="제품유형"></Column>
                    <Column field="productId" header="제품코드"></Column>
                    <Column field="productName" header="제품명"></Column>
                    <Column field="specification" header="규격"></Column>
                    <Column field="unit" header="단위"></Column>
                </DataTable>
            </div>
            <template #footer>
                <div class="w-full flex justify-center">
                    <Button label="선택 완료" @click="selectProductAndClose" />
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
/* 모달이 열릴 때 배경 스크롤 방지 */
:deep(.p-dialog-mask) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경 */
    z-index: 999; /* 모달보다 낮은 z-index */
    overflow: hidden; /* 스크롤 방지 */
}
</style>
