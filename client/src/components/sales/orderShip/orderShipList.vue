<script setup>
import { ref, computed, onMounted } from 'vue';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar';
// import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator'; // Paginator 컴포넌트 추가
import Dialog from 'primevue/dialog';
import axios from 'axios';

// 상태 변수
const ship = ref('');
const searchFilters = ref({ prodCode: '', partCode: '', startDate: null, endDate: null });
const customers2 = ref([]);

// 페이징 관련 변수
const totalRecords = ref(0);
const first = ref(0);
const rows = ref(10);

// 모달 관련 상태 변수
const showSupplierModal = ref(false);
const supplierList = ref([]);
const showProductModal = ref(false);
const productList = ref([]);

// 상태코드 ↔ 상태명 매핑
const shipStateMap = { 1: '출하대기', 2: '출하중', 3: '출하완료' };
const shipStateMapReverse = computed(() => Object.fromEntries(Object.entries(shipStateMap).map(([k, v]) => [v, k])));

// 출하 상태별 색상 설정
const getSeverity = (status) => {
    switch (status) {
        case '출하대기':
            return 'contrast';
        case '출하중':
            return 'warning';
        case '출하완료':
            return 'success';
        default:
            return null;
    }
};

const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// API 호출 함수 (페이징 포함)
const fetchShipList = async () => {
    try {
        const params = {
            productId: searchFilters.value.prodCode || null,
            partnerId: searchFilters.value.partCode || null,
            shipStatus: ship.value ? shipStateMapReverse.value[ship.value] : null,
            startDate: searchFilters.value.startDate ? formatDate(searchFilters.value.startDate) : null,
            endDate: searchFilters.value.endDate ? formatDate(searchFilters.value.endDate) : null
        };
        const res = await axios.get('/api/sales/shipReqSearch', { params });
        if (res.data?.list) {
            customers2.value = res.data.list.map((item) => ({
                shipmentId: item.shipment_id,
                productId: item.product_id,
                productName: item.product_name,
                partnerName: item.partner_name,
                quantity: item.quantity,
                deliveryAddr: item.delivery_addr,
                delDate: item.del_date,
                shipmentDate: item.shipment_date,
                shipState: shipStateMap[item.ship_status] ?? item.ship_status,
                manager: item.manager,
                orderManager: item.order_manager
            }));
            totalRecords.value = customers2.value.length; // 전체 레코드 수 업데이트
        }
    } catch (err) {
        console.error('출하 내역 데이터 로드 실패', err);
        customers2.value = [];
        totalRecords.value = 0;
    }
};

const fetchSuppliers = async () => {
    try {
        const response = await axios.get('/api/sales/ordPaModalList');
        supplierList.value = response.data.list.map((item) => ({
            code: item.partner_id,
            name: item.partner_name,
            address: item.address,
            manager: item.manager
        }));
    } catch (error) {
        console.error('거래처 데이터 로드 실패:', error);
        supplierList.value = [];
    }
};

const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/sales/ordModalPrdList');
        productList.value = response.data.list.map((item) => ({
            code: item.product_id,
            name: item.product_name,
            spec: item.specification,
            stock: item.stock || 0
        }));
    } catch (error) {
        console.error('제품 데이터 로드 실패:', error);
        productList.value = [];
    }
};

// 모달 열기/선택 함수
const openSupplierModal = () => {
    showSupplierModal.value = true;
    fetchSuppliers();
};

const selectSupplier = (event) => {
    const supplier = event.data;
    searchFilters.value.partCode = supplier.code;
    showSupplierModal.value = false;
};

const openProductModal = () => {
    showProductModal.value = true;
    fetchProducts();
};

const selectProduct = (event) => {
    const product = event.data;
    searchFilters.value.prodCode = product.code;
    showProductModal.value = false;
};

// 조회 / 초기화
const searchOrders = () => {
    fetchShipList();
};

const resetFilters = () => {
    searchFilters.value = { prodCode: '', partCode: '', startDate: null, endDate: null };
    ship.value = '';
    fetchShipList();
};

// 페이징 이벤트 핸들러
const onPage = (event) => {
    first.value = event.first;
    rows.value = event.rows;
};

// 페이징된 데이터 계산
const paginatedData = computed(() => {
    const start = first.value;
    const end = first.value + rows.value;
    return customers2.value.slice(start, end);
});

// 초기 로딩 시 데이터 조회
onMounted(fetchShipList);
</script>

<template>
    <div class="p-4 bg-gray-100 min-h-screen">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">출하내역 조회</h1>
            <div class="flex space-x-2">
                <Button label="조회" rounded @click="searchOrders" />
                <Button label="초기화" severity="info" rounded @click="resetFilters" />
            </div>
        </div>
        <div class="p-4 border rounded-md shadow-md mb-8" style="background-color: white">
            <div class="flex flex-row flex-wrap gap-4 items-end">
                <div class="flex-1">
                    <label class="font-semibold text-sm mb-1">제품코드</label>
                    <InputGroup>
                        <IconField iconPosition="right">
                            <InputText v-model="searchFilters.prodCode" placeholder="제품코드" />
                            <InputIcon class="pi pi-search cursor-pointer" @click="openProductModal" />
                        </IconField>
                    </InputGroup>
                </div>

                <div class="flex-1">
                    <label class="font-semibold text-sm">거래처코드</label>
                    <InputGroup>
                        <IconField iconPosition="right">
                            <InputText v-model="searchFilters.partCode" placeholder="거래처코드" />
                            <InputIcon class="pi pi-search cursor-pointer" @click="openSupplierModal" />
                        </IconField>
                    </InputGroup>
                </div>

                <div class="flex-none">
                    <label class="font-semibold text-sm mb-1">조회 납기일</label>
                    <div class="flex gap-2">
                        <Calendar v-model="searchFilters.startDate" dateFormat="yy-mm-dd" placeholder="시작일" showIcon />
                        <span>~</span>
                        <Calendar v-model="searchFilters.endDate" dateFormat="yy-mm-dd" placeholder="종료일" showIcon />
                    </div>
                </div>

                <div class="flex-none">
                    <label class="font-semibold text-sm mb-1">출하상태</label>
                    <div class="flex flex-wrap gap-3">
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="ship" inputId="ship1" name="ship" value="출하대기" />
                            <label for="ship1">출하대기</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="ship" inputId="ship2" name="ship" value="출하중" />
                            <label for="ship2">출하중</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton v-model="ship" inputId="ship3" name="ship" value="출하완료" />
                            <label for="ship3">출하완료</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="font-semibold text-xl mb-4">출하내역</div>
        <DataTable :value="paginatedData" scrollable scrollHeight="400px" class="mt-4">
            <Column field="shipmentId" header="출하번호" style="min-width: 100px" frozen class="font-bold" />
            <Column field="productId" header="제품코드" style="min-width: 100px" />
            <Column field="productName" header="제품명" style="min-width: 120px" />
            <Column field="partnerName" header="거래처명" style="min-width: 120px" />
            <Column field="quantity" header="수량" style="min-width: 80px" />
            <Column field="deliveryAddr" header="배송지" style="min-width: 150px" />
            <Column field="delDate" header="납기일자" style="min-width: 120px" />
            <Column field="shipmentDate" header="출하일자" style="min-width: 120px" />
            <Column field="shipState" header="출하상태" style="min-width: 120px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.shipState" :severity="getSeverity(slotProps.data.shipState)" rounded class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="orderManager" header="담당자" style="min-width: 100px" />
        </DataTable>

        <div class="flex justify-center mt-4">
            <Paginator :rows="rows" :totalRecords="totalRecords" :rowsPerPageOptions="[10, 20, 30]" @page="onPage" />
        </div>

        <Dialog v-model:visible="showSupplierModal" modal header="거래처 검색" :style="{ width: '50vw' }">
            <DataTable :value="supplierList" selectionMode="single" @row-select="selectSupplier">
                <Column field="code" header="거래처코드" />
                <Column field="name" header="거래처명" />
                <Column field="address" header="주소" />
                <Column field="manager" header="담당자" />
            </DataTable>
        </Dialog>

        <Dialog v-model:visible="showProductModal" modal header="제품 검색" :style="{ width: '50vw' }">
            <DataTable :value="productList" selectionMode="single" @row-select="selectProduct">
                <Column field="code" header="제품코드" />
                <Column field="name" header="제품명" />
                <Column field="spec" header="규격" />
            </DataTable>
        </Dialog>
    </div>
</template>

<style scoped></style>
