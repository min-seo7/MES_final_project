<script setup>
import { ref, onMounted, watch } from 'vue';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Calendar from 'primevue/calendar';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import axios from 'axios';

// 상태 변수
const ship = ref(null);
const returnDateRange = ref({ startDate: null, endDate: null });
const searchInput = ref({ orderId: '', partId: '', partName: '', manager: '' });

// 검색 필터 상태
const searchFilters = ref({
    orderId: '',
    orderStatus: '', // 라디오 버튼
    productName: '', // 제품명
    partnerId: '',
    delDate: null
});

// 화면에 표시할 데이터
const customers2 = ref([]);

// 상태코드(int) → 상태명(string) 매핑
const orderStateMap = { 1: '반품등록', 2: '반품완료' };

// 날짜 포맷 함수
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 반품상태에 따른 색상
const getSeverity = (status) => {
    switch (status) {
        case '반품등록':
            return 'contrast';
        case '반품완료':
            return 'success';
        default:
            return null;
    }
};

// 조회 버튼 클릭 시 API 호출 및 데이터 갱신
const searchOrders = async () => {
    try {
        const startDate = returnDateRange.value.startDate ? formatDate(returnDateRange.value.startDate) : null;
        const endDate = returnDateRange.value.endDate ? formatDate(returnDateRange.value.endDate) : null;
        const reStatusInt = ship.value === '반품등록' ? 1 : ship.value === '반품완료' ? 2 : null;

        const response = await axios.get('/api/sales/returnSearch', {
            params: {
                orderId: searchInput.value.orderId || null,
                partnerId: searchInput.value.partId || null,
                reStatus: reStatusInt,
                startDate,
                endDate
            }
        });

        customers2.value =
            response.data?.list?.map((item) => ({
                returnId: item.return_id,
                productId: item.product_id,
                productName: item.product_name,
                partnerName: item.partner_name,
                partnerId: item.partner_id,
                manager: item.manager,
                quantity: item.quantity,
                deliveryAddr: item.delivery_addr,
                delDate: item.del_date,
                shipmentDate: item.shipment_date,
                returnDate: item.return_date,
                reState: orderStateMap[item.re_status] || '알수없음',
                returnReason: item.return_reason,
                name: item.order_manager
            })) || [];
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
};

// 초기화 버튼 클릭 시 모든 값 리셋
const resetFilters = () => {
    ship.value = null;
    returnDateRange.value.startDate = null;
    returnDateRange.value.endDate = null;
    searchInput.value = { orderId: '', partId: '', partName: '', manager: '' };
    searchOrders();
};

// --- 거래처 모달 관련 ---
const showSupplierDialog = ref(false);
const allSuppliers = ref([]);
const filteredSuppliers = ref([]);
const selectedSupplierFromDialog = ref(null);
const supplierSearch = ref({ partnerId: '', partnerName: '' });

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

const openSupplierModal = async () => {
    supplierSearch.value = { partnerId: '', partnerName: '' };
    selectedSupplierFromDialog.value = null;
    await fetchSuppliers();
    showSupplierDialog.value = true;
};

const selectSupplierAndClose = () => {
    if (selectedSupplierFromDialog.value) {
        searchInput.value.partId = selectedSupplierFromDialog.value.partnerId;
        searchInput.value.partName = selectedSupplierFromDialog.value.partnerName;
        searchInput.value.manager = selectedSupplierFromDialog.value.manager;
    }
    showSupplierDialog.value = false;
};
// 주문 모달 관련
const showOrdersModal = ref(false);
const ordersList = ref([]);
const selectedOrdersFromDialog = ref(null);

// 주문 데이터 로드
const fetchOrdersList = async () => {
    try {
        const response = await axios.get('/api/sales/ordsListModal');
        ordersList.value = response.data.list.map((item) => ({
            orderId: item.order_id,
            orderDate: item.order_date,
            orderManager: item.order_manager,
            deliveryAddr: item.delivery_addr,
            manager: item.manager,
            partnerName: item.partner_name
        }));
    } catch (error) {
        console.error('주문서 데이터 로드 실패:', error);
    }
};

// 주문 모달 열기
const openOrdersModal = async () => {
    await fetchOrdersList();
    selectedOrdersFromDialog.value = null;
    showOrdersModal.value = true;
};

// "선택 완료" 버튼 클릭 시
const selectOrderAndClose = () => {
    if (selectedOrdersFromDialog.value) {
        searchInput.value.orderId = selectedOrdersFromDialog.value.orderId;
        searchFilters.value.orderId = selectedOrdersFromDialog.value.orderId;
    }
    showOrdersModal.value = false;
};
// 모달 열릴 때 스크롤 제어
watch(showSupplierDialog, (isShowing) => {
    document.body.style.overflow = isShowing ? 'hidden' : '';
});

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(searchOrders);
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
                        <label class="font-semibold text-sm mb-1">주문번호</label>
                        <InputGroup>
                            <IconField iconPosition="left">
                                <InputText v-model="searchInput.orderId" placeholder="ORD001" @keyup.enter="searchOrders" readonly />
                                <InputIcon class="pi pi-search" @click="openOrdersModal" />
                            </IconField>
                        </InputGroup>
                    </div>

                    <!-- 거래처코드 입력 + 모달 연결 -->
                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">거래처코드</label>
                        <InputGroup>
                            <IconField iconPosition="left">
                                <InputText v-model="searchInput.partId" placeholder="SUP002" readonly />
                                <InputIcon class="pi pi-search" @click="openSupplierModal" />
                            </IconField>
                        </InputGroup>
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">* 반품일</label>
                        <div class="flex items-center gap-2">
                            <Calendar v-model="returnDateRange.startDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                            <span>~</span>
                            <Calendar v-model="returnDateRange.endDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <label class="font-semibold text-sm mb-1">반품상태</label>
                        <div class="flex flex-wrap gap-3">
                            <div class="flex items-center gap-2">
                                <RadioButton v-model="ship" inputId="return1" name="ship" value="반품등록" />
                                <label for="return1">반품등록</label>
                            </div>
                            <div class="flex items-center gap-2">
                                <RadioButton v-model="ship" inputId="return2" name="ship" value="반품완료" />
                                <label for="return2">반품완료</label>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Toolbar>

        <DataTable :value="customers2" paginator :rows="5" class="mt-6">
            <Column field="returnId" header="반품번호" style="min-width: 80px" />
            <Column field="productId" header="제품코드" style="min-width: 0px" />
            <Column field="productName" header="제품명" style="min-width: 100px" />
            <Column field="partnerName" header="거래처명" style="min-width: 80px" />
            <Column field="partnerId" header="거래처코드" style="min-width: 80px" />
            <Column field="quantity" header="수량" style="min-width: 80px" />
            <Column field="deliveryAddr" header="배송지" style="min-width: 100px" />
            <Column field="delDate" header="납기일자" style="min-width: 80px" />
            <Column field="shipmentDate" header="출하일자" style="min-width: 100px">
                <template #body="slotProps">{{ formatDate(slotProps.data.shipmentDate) || 'N/A' }}</template>
            </Column>
            <Column field="returnDate" header="반품일자" style="min-width: 100px">
                <template #body="slotProps">{{ formatDate(slotProps.data.returnDate) || 'N/A' }}</template>
            </Column>
            <Column field="manager" header="거래처담당자" style="min-width: 80px" />
            <Column field="reState" header="반품상태" style="min-width: 100px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.reState" :severity="getSeverity(slotProps.data.reState)" :rounded="true" class="px-3 py-1 text-sm" />
                </template>
            </Column>
            <Column field="returnReason" header="반품사유" style="min-width: 100px">
                <template #body="slotProps">
                    <span :title="slotProps.data.returnReason">{{ slotProps.data.returnReason }}</span>
                </template>
            </Column>
            <Column field="name" header="담당자" style="min-width: 100px" />
        </DataTable>

        <!-- 거래처 모달 -->
        <Dialog v-model:visible="showSupplierDialog" modal header="거래처 검색" :style="{ width: '50vw' }" class="centered-dialog">
            <div class="p-4">
                <DataTable :value="filteredSuppliers" selectionMode="single" dataKey="partnerId" v-model:selection="selectedSupplierFromDialog" :rowHover="true" :paginator="true" :rows="5">
                    <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                    <Column field="partnerId" header="거래처코드" />
                    <Column field="partnerName" header="거래처명" />
                    <Column field="ceo" header="대표자" />
                    <Column field="address" header="주소" />
                    <Column field="manager" header="담당자" />
                    <Column field="mainTel" header="전화번호" />
                </DataTable>
            </div>
            <template #footer>
                <div class="w-full flex justify-center">
                    <Button label="선택 완료" @click="selectSupplierAndClose" />
                </div>
            </template>
        </Dialog>
        <Dialog v-model:visible="showOrdersModal" modal header="주문서 목록" :style="{ width: '50vw' }" class="centered-dialog">
            <div class="p-4">
                <DataTable :value="ordersList" selectionMode="single" dataKey="orderId" v-model:selection="selectedOrdersFromDialog" :rowHover="true" :paginator="true" :rows="5">
                    <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                    <Column field="orderId" header="주문번호"></Column>
                    <Column field="orderDate" header="주문일자"></Column>
                    <Column field="partnerName" header="거래처명"></Column>
                    <Column field="orderManager" header="담당자"></Column>
                    <Column field="deliveryAddr" header="배송지"></Column>
                </DataTable>
            </div>
            <template #footer>
                <div class="w-full flex justify-center">
                    <Button label="선택 완료" @click="selectOrderAndClose" />
                </div>
            </template>
        </Dialog>
    </div>
</template>
