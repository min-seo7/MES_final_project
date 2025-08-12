<script setup>
import { ref, computed } from 'vue';
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

// 날짜 예시
const today = new Date();

// 검색 폼 상태
const search = ref({
    partCode: '',
    prodCode: '',
    manager: '',
    productName: '',
    addr: '',
    partName: '',
    spec: '',
    deliveryDate: null
});

// 반품등록 폼 상태
const returnOrder = ref({
    returnDate: today,
    returnReason: '',
    manager: ''
});

// 검색내역에서 선택된 행
const selectedOrder = ref(null);

// 모달 및 데이터
const showSupplierDialog = ref(false);
const suppliers = ref([
    { partCode: 'SUP002', partName: '태호 렌치', manager: '홍oo', prodCode: 'P001', addr: 'LA' },
    { partCode: 'SUP003', partName: '대한물산', manager: '김철수', prodCode: 'P002', addr: '부산' }
]);

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

// 더미 주문 데이터
const allOrders = [
    {
        ordernum: '001',
        partName: '태호 렌치',
        partCode: 'SUP002',
        addr: 'LA',
        productName: '분말형',
        spec: '40KG',
        qty: 1000,
        createDate: '2025-09-10',
        deliveryDate: '2025-10-15',
        productState: '제품입고',
        name: '김미국'
    },
    {
        ordernum: '002',
        partName: '태호 렌치',
        partCode: 'SUP002',
        addr: 'LA',
        productName: '액상형',
        spec: '20L',
        qty: 3000,
        createDate: '2025-09-10',
        deliveryDate: '2025-10-30',
        productState: '생산중',
        name: '김미국'
    }
];

const filteredOrders = ref([...allOrders]);

// 주문 상태에 따른 Tag 색상
const getSeverity = (status) => {
    switch (status) {
        case '제품입고':
            return 'success';
        case '생산중':
            return 'info';
        case '반품등록':
            return 'contrast';
        default:
            return null;
    }
};

// 메소드
const searchOrders = () => {
    filteredOrders.value = allOrders.filter((order) => {
        let match = true;
        if (search.value.partCode && order.partCode !== search.value.partCode) match = false;
        if (search.value.productName && order.productName !== search.value.productName) match = false;
        if (search.value.spec && order.spec !== search.value.spec) match = false;
        return match;
    });
};

const resetFilters = () => {
    search.value = {
        partCode: '',
        prodCode: '',
        manager: '',
        productName: '',
        addr: '',
        partName: '',
        spec: '',
        deliveryDate: null
    };
    filteredOrders.value = [...allOrders];
};

const saveReturn = () => {
    if (!selectedOrder.value) {
        alert('수정할 주문내역을 먼저 선택해주세요.');
        return;
    }

    const returnHistory = {
        ...selectedOrder.value, // 선택된 주문 정보
        ...returnOrder.value, // 반품 등록 정보
        returnDate: returnOrder.value.returnDate.toISOString().slice(0, 10) // 날짜 형식 통일
    };

    console.log('반품내역 저장:', returnHistory);
    alert('반품 등록이 완료되었습니다.');
    resetReturnForm();
};

const resetReturnForm = () => {
    selectedOrder.value = null;
    returnOrder.value = {
        returnDate: new Date(),
        returnReason: '',
        manager: ''
    };
};

const onOrderSelect = (event) => {
    // 테이블에서 행을 클릭하면 해당 주문 담당자의 이름으로 반품 담당자를 자동 설정
    returnOrder.value.manager = event.data.name;
};

const onSupplierSelectFromDialog = (event) => {
    const selectedSupplier = event.data;
    if (selectedSupplier) {
        search.value.partCode = selectedSupplier.partCode;
        search.value.partName = selectedSupplier.partName;
        search.value.manager = selectedSupplier.manager;
        search.value.prodCode = selectedSupplier.prodCode;
        search.value.addr = selectedSupplier.addr;
        showSupplierDialog.value = false;
    }
};
</script>
<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
        <div class="flex justify-end space-x-2 mb-6">
            <Button label="조회" rounded @click="searchOrders" class="p-button-success" />
            <Button label="초기화" severity="info" rounded @click="resetFilters" />
        </div>

        <div class="p-4 border-b border-gray-200">
            <div class="bg-gray-200 px-4 py-2 font-bold text-lg mb-4">검색</div>
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
                    <div class="flex flex-col space-y-1">
                        <label class="font-semibold text-sm">거래처코드</label>
                        <InputGroup>
                            <InputText v-model="search.partCode" placeholder="SUP002" readonly />
                            <Button icon="pi pi-search" class="p-button-secondary" @click="showSupplierDialog = true" />
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
                                <RadioButton v-model="search.spec" :inputId="item" :value="item" />
                                <label :for="item">{{ item }}</label>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label class="font-semibold text-sm">납기</label>
                        <Calendar v-model="search.deliveryDate" dateFormat="yy-mm-dd" showIcon class="w-full" />
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label class="font-semibold text-sm">제품코드</label>
                        <InputText v-model="search.prodCode" placeholder="P001" readonly />
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label class="font-semibold text-sm">배송지</label>
                        <InputText v-model="search.addr" placeholder="LA" readonly />
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label class="font-semibold text-sm">거래처 담당자</label>
                        <InputText v-model="search.manager" placeholder="홍oo" readonly />
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label class="font-semibold text-sm">거래처명</label>
                        <InputText v-model="search.partName" placeholder="태호 렌치" readonly />
                    </div>
                </div>
            </div>
        </div>

        <div class="my-6">
            <div class="bg-gray-200 px-4 py-2 font-bold text-lg mb-4">검색내역</div>
            <DataTable :value="filteredOrders" scrollable scrollHeight="200px" class="mt-6" selectionMode="single" dataKey="ordernum" v-model:selection="selectedOrder" @rowSelect="onOrderSelect">
                <Column field="ordernum" header="주문번호" style="min-width: 80px" />
                <Column field="partName" header="거래처명" style="min-width: 100px" />
                <Column field="partCode" header="거래처코드" style="min-width: 100px" />
                <Column field="addr" header="배송지" style="min-width: 80px" />
                <Column field="productName" header="제품명" style="min-width: 120px" />
                <Column field="spec" header="규격" style="min-width: 80px" />
                <Column field="qty" header="수량" style="min-width: 80px" />
                <Column field="createDate" header="등록일" style="min-width: 100px" />
                <Column field="deliveryDate" header="납기일" style="min-width: 100px" />
                <Column field="productState" header="제품상태" style="min-width: 100px">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.productState" :severity="getSeverity(slotProps.data.productState)" :rounded="true" />
                    </template>
                </Column>
                <Column field="name" header="이름" style="min-width: 80px" />
            </DataTable>
            <Paginator :rows="10" :totalRecords="filteredOrders.length" :rowsPerPageOptions="[10, 20, 30]" />
        </div>

        <div class="mt-8">
            <div class="flex justify-end space-x-2 mb-4">
                <Button label="저장" rounded @click="saveReturn" class="p-button-success" />
                <Button label="초기화" severity="info" rounded @click="resetReturnForm" />
            </div>
            <div class="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div class="flex flex-col space-y-1">
                        <label class="font-semibold text-sm">반품등록일</label>
                        <Calendar v-model="returnOrder.returnDate" dateFormat="yy-mm-dd" showIcon />
                    </div>
                    <div class="flex flex-col space-y-1 col-span-1 md:col-span-2">
                        <label class="font-semibold text-sm">반품사유</label>
                        <InputText v-model="returnOrder.returnReason" placeholder="포장터져서 오염되었습니다." />
                    </div>
                    <div class="flex flex-col space-y-1">
                        <label class="font-semibold text-sm">담당자</label>
                        <InputText v-model="returnOrder.manager" readonly />
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="showSupplierDialog" modal header="거래처 검색" :style="{ width: '50vw' }">
            <DataTable :value="suppliers" selectionMode="single" dataKey="partCode" @rowSelect="onSupplierSelectFromDialog">
                <Column field="partCode" header="거래처코드"></Column>
                <Column field="partName" header="거래처명"></Column>
                <Column field="manager" header="담당자"></Column>
            </DataTable>
        </Dialog>
    </div>
</template>
