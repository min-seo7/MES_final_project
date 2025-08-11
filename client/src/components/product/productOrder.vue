<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import DatePicker from 'primevue/datepicker';
const search = ref({
    productPlanCode: '',
    planStartDate: '',
    planEndDate: '',
    director: ''
});

// 모달 상태 관리
const showModal = ref(false);
const modalType = ref('');

const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const selectModalValue = (value) => {
    if (modalType.value === 'productPlanCode') search.value.productPlanCode = value.code;
    else if (modalType.value === 'planStartDate') search.value.planStartDate = value.startDate;
    else if (modalType.value === 'planEndDate') search.value.planEndDate = value.endDate;
    else if (modalType.value === 'director') search.value.director = value.director;
    showModal.value = false;
};
const productPlanCodeList = ref([
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:10', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:20', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P003-20', startDate: '2025-08-10 09:30', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P003-40', startDate: '2025-08-10 09:40', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:50', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 10:00', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 10:10', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 10:20', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 10:30', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 10:40', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 10:50', endDate: '2025-08-10 18:00', director: '김지시' }, //
    { code: 'PL20250808P002-20', startDate: '2025-08-10 10:55', endDate: '2025-08-10 18:00', director: '김지시' } //
]);

// const currentPage = ref(1);
// const pageSize = 5;
// eslint-disable-next-line no-undef
// const totalPages = computed(() => Math.ceil(productPlanCodeList.value.length / pageSize));

// // eslint-disable-next-line no-undef
// const pagedProductPlanCodes = computed(() => {
//     const start = (currentPage.value - 1) * pageSize;

//     return productPlanCodeList.value.slice(start, start + pageSize);
// });

const products = ref([
    {
        id: 1,
        startDatetime: new Date('2025-08-10T10:10:00'),
        endDatetime: new Date('2025-08-12T10:10:00'),
        productname: '과립형비료 20kg',
        productPlanQty: 10000,
        productType: '과립형',
        undefinedQty: 9000,
        currentQty: 1000,
        line: 'B01',
        lastname: '김지시'
    },
    {
        id: 2,
        startDatetime: new Date('2025-08-10T10:20:00'),
        endDatetime: new Date('2025-08-12T10:20:00'),
        productname: '과립형비료 20kg',
        productPlanQty: 10000,
        productType: '과립형',
        undefinedQty: 9000,
        currentQty: 1000,
        line: 'B01',
        lastname: '김지시'
    },
    {
        id: 3,
        startDatetime: new Date('2025-08-10T10:30:00'),
        endDatetime: new Date('2025-08-12T10:30:00'),
        productname: '과립형비료 20kg',
        productPlanQty: 10000,
        productType: '과립형',
        undefinedQty: 9000,
        currentQty: 1000,
        line: 'B01',
        lastname: '김지시'
    }
]);
const selectedProducts = ref([]);
const hiddenProductIds = ref(new Set());

// 체크박스가 찍힌 제품들을 넣을 배열
const filteredProducts = computed(() => {
    // 선택된 상품이 없으면 원본 데이터 전체를 반환
    return products.value.filter((p) => !hiddenProductIds.value.has(p.id));
    // const selectedIds = new Set(selectedProducts.value.map((prow) => prow.id));
    // 선택된 행의 id를 set컬렉션으로 map을 이용해서 배열을 반환하고 수집된다
    // return products.value.filter((prow) => !selectedIds.has(prow.id));
    // 제품배열에 필터를 걸어서 선택되지 않은 id를 가진 데이터들을 리턴
});
const hideSelected = () => {
    // 선택된 상품들의 ID를 hiddenProductIds Set에 추가
    selectedProducts.value.forEach((p) => hiddenProductIds.value.add(p.id));

    // 숨기기 후 선택 상태 초기화
    selectedProducts.value = [];
};

const columns = ref([
    { field: 'startDatetime', header: '생산시작일시' },
    { field: 'endDatetime', header: '생산종료일시' },
    { field: 'productname', header: '제품명' },
    { field: 'productPlanQty', header: '생산계획수량' },
    { field: 'productType', header: '제품형태' },
    { field: 'undefinedQty', header: '미지시수량' },
    { field: 'currentQty', header: '현지시수량' },
    { field: 'line', header: '라인' },
    { field: 'lastname', header: '생산지시자' }
]);

// const formatCurrency = (value) => {
//     return value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
// };
const formatDate = (value) => {
    // if (!value) return '';
    // const date = new Date(value);
    // return date.toLocaleString('ko-KR'); // 또는 원하는 형식으로 포맷
    const date = typeof value === 'string' ? new Date(value) : value;
    if (!date) return '';

    // 원하는 형식으로 포맷팅
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};
const onDateTimeUpdate = (data, field, value) => {
    data[field] = value;
};
const onCellEditComplete = (event) => {
    // event 객체에서 편집된 정보를 가져옵니다.
    let { data, newValue, field } = event;
    console.log(data);
    // newValue가 Date 객체인지 확인하고 할당
    if (['startDatetime', 'endDatetime'].includes(field)) {
        if (newValue instanceof Date) {
            // newValue가 Date 객체인 경우에만 할당
            data[field] = newValue;
        } else {
            // 날짜 선택을 취소하거나 다른 유효하지 않은 값이 들어온 경우
            data[field] = null;
        }
    }
    // 그 외 필드 처리 로직은 그대로 유지
    else if (['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)) {
        if (isNaN(newValue) || newValue < 0) {
            console.warn('음수는 허용되지 않습니다.');
            return;
        }
        data[field] = newValue;
    } else {
        data[field] = newValue;
    }
};
const addNewRow = () => {
    const newProduct = {
        id: products.value.length ? Math.max(...products.value.map((p) => p.id)) + 1 : 1,
        startDatetime: null,
        endDatetime: null,
        productname: '',
        productPlanQty: 0,
        productType: '',
        undefinedQty: 0,
        currentQty: 0,
        line: '',
        lastname: '김지시'
    };
    // Add the new object to the data array
    products.value.push(newProduct);
};

const dropContent = () => {
    Object.assign(search.value, {
        productPlanCode: ''
    });
};
</script>
<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 지시등록 " rounded @click="insertWork" />
        <Button label=" 초기화 " severity="info" rounded @click="dropContent" />
    </div>
    <div class="font-semibold text-xl mb-4">작업지시</div>
    <div class="card flex justify-center gap-6 py-4">
        <!-- 생산계획코드 영역 -->
        <div class="flex flex-col">
            <label for="planCode" class="mb-1">생산계획코드</label>
            <div class="flex items-center gap-2">
                <!-- <InputText class="w-64" v-model="search.productPlanCode" readonly />
                <Button icon="pi pi-search" severity="secondary" variant="text" @click="openModal('productPlanCode')" /> -->
                <IconField iconPosition="left">
                    <InputText class="w-64" ref="inputValue" v-model="search.productPlanCode" id="planCodeInput" readonly />
                    <InputIcon class="pi pi-search" @click="openModal('productPlanCode')" />
                </IconField>
            </div>
        </div>

        <!-- 지시자 영역 -->
        <div class="flex flex-col">
            <label for="lastname" class="mb-1">지시자</label>
            <InputText id="lastnameTxt" type="text" readonly />
        </div>
    </div>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 행추가 " rounded @click="addNewRow" />
        <Button label=" 선택삭제 " severity="danger" rounded @click="hideSelected" />
    </div>
    <div class="flex-auto card">
        <DataTable
            v-model:selection="selectedProducts"
            :value="filteredProducts"
            scrollable
            scrollHeight="400px"
            editMode="cell"
            @cell-edit-complete="onCellEditComplete"
            :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }) => ({
                        class: [{ '!py-0': state['d_editing'] }]
                    })
                }
            }"
            dataKey="id"
        >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                <template #body="{ data, field }">
                    <span v-if="['startDatetime', 'endDatetime'].includes(field)">
                        {{ formatDate(data[field]) }}
                    </span>
                    <span v-else>{{ data[field] }}</span>
                </template>
                <template #editor="{ data, field }">
                    <template v-if="['startDatetime', 'endDatetime'].includes(field)">
                        <DatePicker v-model="data[field]" dateFormat="yy-mm-dd" showTime hourFormat="24" fluid @update:modelValue="onDateTimeUpdate(data, field, $event)" />
                    </template>
                    <template v-else-if="['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)">
                        <InputNumber v-model="data[field]" autofocus fluid />
                    </template>
                    <template v-else>
                        <InputText v-model="data[field]" autofocus fluid />
                    </template>
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="showModal" modal header="생산계획코드 리스트" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold mb-4 text-lg">
            🔍
            {{
                {
                    productPlanCode: '생산계획코드',
                    productStartDate: '생산시작예정일',
                    productEndDate: '생산종료예정일',
                    productName: '제품명'
                }[modalType]
            }}
        </p>

        <div v-if="modalType === 'productPlanCode'">
            <!-- <ul class="mb-3"> -->

            <DataTable :value="productPlanCodeList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 20rem" class="mb-3">
                <Column field="code" header="생산계획코드">
                    <template #body="{ data }">
                        <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                            {{ data.code }}
                        </span>
                    </template>
                </Column>
                <Column field="startDate" header="생산시작일시"></Column>
                <Column field="endDate" header="생산종료일시"></Column>
                <Column field="director" header="지시자"></Column>
            </DataTable>
        </div>
    </Dialog>
</template>
