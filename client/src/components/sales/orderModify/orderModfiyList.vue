<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Dialog from 'primevue/dialog';
import axios from 'axios';
import Tag from 'primevue/tag';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar';

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

// 검색 필터 상태
const searchFilters = ref({
    orderId: '',
    orderStatus: '', // 라디오 버튼
    productName: '', // 제품명
    partnerId: '',
    delDate: null,
    spec: ''
});

const items = ref([]);

// 거래처 모달 관련
const showSupplierDialog = ref(false);
const allSuppliers = ref([]);
const filteredSuppliers = ref([]);
const selectedSupplierFromDialog = ref(null);

// 거래처 모달 검색 폼
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

// 거래처 검색 필터링 로직
const searchSuppliers = async () => {
    await fetchSuppliers();
};

// "선택 완료" 버튼 클릭 시
const selectSupplierAndClose = () => {
    if (selectedSupplierFromDialog.value) {
        searchFilters.value.partnerId = selectedSupplierFromDialog.value.partnerId;
    }
    showSupplierDialog.value = false;
};

// 제품 모달 관련
const showProductDialog = ref(false);
const allProducts = ref([]);
const filteredProducts = ref([]);
const selectedProductFromDialog = ref(null);

// 제품 모달 검색 폼
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
    await fetchProducts();
    selectedProductFromDialog.value = null;
    showProductDialog.value = true;
};

// 제품 검색 필터링 로직
const searchProducts = async () => {
    await fetchProducts();
};

// "선택 완료" 버튼 클릭 시
const selectProductAndClose = () => {
    if (selectedProductFromDialog.value) {
        searchFilters.value.productName = selectedProductFromDialog.value.productName;
    }
    showProductDialog.value = false;
};

//주문 데이터 조회
const fetchOrders = async () => {
    try {
        const delDateValue = searchFilters.value.delDate;
        let formattedDelDate = null;
        if (delDateValue) {
            const year = delDateValue.getFullYear();
            const month = String(delDateValue.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
            const day = String(delDateValue.getDate()).padStart(2, '0');
            formattedDelDate = `${year}-${month}-${day}`;
        }
        const queryParams = {
            orderId: searchFilters.value.orderId || null,
            orderStatus: searchFilters.value.orderStatus ? orderStateMapReverse.value[searchFilters.value.orderStatus] : null,
            productName: searchFilters.value.productName || null,
            partnerId: searchFilters.value.partnerId || null,
            delDate: formattedDelDate
        };

        const response = await axios.get('/api/sales/orderModify', { params: queryParams });

        if (response.data?.list && Array.isArray(response.data.list)) {
            items.value = response.data.list.map((item) => ({
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
                changeDate: item.change_date,
                changeReason: item.change_reason,
                orderManager: item.order_manager
            }));
        } else {
            items.value = [];
            console.warn('서버 응답에 유효한 리스트 데이터가 없습니다.', response.data);
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

// 필터 초기화
const resetFilters = () => {
    searchFilters.value.orderId = '';
    searchFilters.value.orderStatus = '';
    searchFilters.value.productName = '';
    searchFilters.value.partnerId = '';
    searchFilters.value.delDate = null;
    // 초기화 후 전체 데이터 다시 조회
    fetchOrders();
};

onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">주문내역 조회</h1>
            <div class="flex space-x-2">
                <Button label="조회" rounded @click="fetchOrders" />
                <Button label="초기화" severity="info" rounded @click="resetFilters" />
            </div>
        </div>

        <Toolbar class="mb-4">
            <template #center>
                <div class="flex flex-wrap gap-6 p-4">
                    <div class="flex flex-col">
                        <label for="orderId" class="font-semibold text-sm mb-1">주문번호</label>
                        <InputText id="orderId" type="text" class="w-60" v-model="searchFilters.orderId" />
                    </div>

                    <div class="flex flex-col">
                        <label for="partnerId" class="font-semibold text-sm mb-1">거래처코드</label>
                        <IconField iconPosition="left" class="w-full">
                            <InputText id="partnerId" type="text" class="w-60" v-model="searchFilters.partnerId" readonly />
                            <InputIcon class="pi pi-search" @click="openSupplierModal" />
                        </IconField>
                    </div>

                    <div class="flex flex-col">
                        <label for="productName" class="font-semibold text-sm mb-1">제품명</label>
                        <IconField iconPosition="left" class="w-full">
                            <InputText id="productName" type="text" class="w-60" v-model="searchFilters.productName" readonly />
                            <InputIcon class="pi pi-search" @click="openProductModal" />
                        </IconField>
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">납기일자</label>
                        <DatePicker :showIcon="true" v-model="searchFilters.delDate" dateFormat="yy-mm-dd" />
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">주문상태</label>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex items-center gap-2" v-for="state in Object.values(orderStateMap)" :key="state">
                                <RadioButton v-model="searchFilters.orderStatus" :inputId="`orderState-${state}`" name="orderStatus" :value="state" />
                                <label :for="`orderState-${state}`">{{ state }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Toolbar>

        <div class="font-semibold text-xl mb-4 mt-6">
            주문내역
            <DataTable :value="items" :paginator="true" :rows="10" :rowsPerPageOptions="[10, 20, 30]" class="mt-3">
                <Column field="orderId" header="주문번호" style="min-width: 100px" frozen class="font-bold" />
                <Column field="partnerId" header="거래처코드" style="min-width: 120px" />
                <Column field="partnerName" header="거래처명" style="min-width: 120px" />
                <Column field="productId" header="제품코드" style="min-width: 120px" />
                <Column field="productName" header="제품명" style="min-width: 120px" />
                <Column field="manager" header="거래담당자" style="min-width: 120px" />
                <Column field="quantity" header="수량" style="min-width: 80px" />
                <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
                <Column field="orderDate" header="등록일자" style="min-width: 100px" />
                <Column field="delDate" header="변경납기일자" style="min-width: 100px" />
                <Column field="changeDate" header="수정일" style="min-width: 120px" />
                <Column field="changeReason" header="변경사유" style="min-width: 120px" />
                <Column field="orderManager" header="담당자" style="min-width: 120px" />
            </DataTable>
        </div>

        <Dialog v-model:visible="showSupplierDialog" modal header="거래처 검색" :style="{ width: '50vw' }" class="centered-dialog">
            <div class="p-4">
                <div class="flex flex-col gap-4 mb-4">
                    <div class="flex items-center gap-4">
                        <label class="font-semibold text-sm w-20">거래처코드</label>
                        <InputText v-model="supplierSearch.partnerId" @keyup.enter="searchSuppliers" placeholder="거래처코드" />
                        <label class="font-semibold text-sm">거래처명</label>
                        <InputText v-model="supplierSearch.partnerName" @keyup.enter="searchSuppliers" placeholder="거래처명" />
                        <Button label="검색" icon="pi pi-search" class="p-button-success" @click="searchSuppliers" />
                    </div>
                </div>
                <DataTable :value="filteredSuppliers" selectionMode="single" dataKey="partnerId" v-model:selection="selectedSupplierFromDialog">
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
                <div class="flex justify-center">
                    <Button label="선택 완료" severity="success" @click="selectSupplierAndClose" />
                </div>
            </template>
        </Dialog>

        <Dialog v-model:visible="showProductDialog" modal header="제품 목록" :style="{ width: '50vw' }" class="centered-dialog">
            <div class="p-4">
                <div class="flex flex-col gap-4 mb-4">
                    <div class="flex items-center gap-4">
                        <label class="font-semibold text-sm w-20">제품코드</label>
                        <InputText v-model="productSearch.prodCode" @keyup.enter="searchProducts" placeholder="제품코드" />
                        <label class="font-semibold text-sm">제품명</label>
                        <InputText v-model="productSearch.prodName" @keyup.enter="searchProducts" placeholder="제품명" />
                        <Button label="검색" icon="pi pi-search" class="p-button-success" @click="searchProducts" />
                    </div>
                </div>
                <DataTable :value="filteredProducts" selectionMode="single" dataKey="productId" v-model:selection="selectedProductFromDialog">
                    <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                    <Column field="productType" header="제품유형"></Column>
                    <Column field="productId" header="제품코드"></Column>
                    <Column field="productName" header="제품명"></Column>
                    <Column field="specification" header="규격"></Column>
                </DataTable>
            </div>
            <template #footer>
                <div class="flex justify-center">
                    <Button label="선택 완료" severity="success" @click="selectProductAndClose" />
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
