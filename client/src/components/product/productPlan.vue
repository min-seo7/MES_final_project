<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
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
    if (modalType.value === 'productCode') search.value.productCode = value.code;
    else if (modalType.value === 'name') search.value.name = value.name;
    showModal.value = false;
};
const productCodeList = ref([
    { code: 'PRD001-20', name: '분말형비료 20kg', sizeSpec: '20kg' }, //
    { code: 'PRD001-40', name: '분말형비료 40kg', sizeSpec: '40kg' }, //
    { code: 'PRD002-20', name: '과립형비료 20kg', sizeSpec: '20kg' }, //
    { code: 'PRD002-40', name: '과립형비료 40kg', sizeSpec: '40kg' }, //
    { code: 'PRD003-05', name: '액상형비료 5L', sizeSpec: '5L' }, //
    { code: 'PRD003-10', name: '액상형비료 10L', sizeSpec: '10L' } //
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
    { id: 1, productCode: 'PRD001-20', productname: '분말형비료 20kg', line: 'A01', productPlanQty: 10000, plannedQty: 1000, undefinedQty: 9000, currentQty: 1000, productType: '완제품' },
    { id: 2, productCode: 'PRD002-20', productname: '분말형비료 20kg', line: 'B01', productPlanQty: 10000, plannedQty: 1000, undefinedQty: 9000, currentQty: 1000, productType: '완제품' },
    { id: 3, productCode: 'PRD003-10', productname: '액상형비료 10L', line: 'C01', productPlanQty: 10000, plannedQty: 1000, undefinedQty: 9000, currentQty: 1000, productType: '완제품' }
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
    { field: 'productCode', header: '제품코드' },
    { field: 'productname', header: '제품명' },
    { field: 'line', header: '라인' },
    { field: 'productPlanQty', header: '생산계획수량' },
    { field: 'plannedQty', header: '기지시수량' },
    { field: 'productType', header: '제품형태' }
]);

// const formatCurrency = (value) => {
//     return value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
// };
const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleString('ko-KR'); // 또는 원하는 형식으로 포맷
};

const onCellEditComplete = (event) => {
    // event 객체에서 편집된 정보를 가져옵니다.
    let { data, newValue, field } = event;
    console.log(data);
    //예시: 가격이 0보다 작으면 업데이트하지 않음
    if (field === 'price' && newValue < 0) {
        console.error('가격은 0보다 작을 수 없습니다.');
        return;
    }
    if (['productPlanQty', 'plannedQty'].includes(field)) {
        if (isNaN(newValue) || newValue < 0) {
            console.warn('음수는 허용되지 않습니다.');

            return;
        }
    }

    // // 데이터 업데이트
    data[field] = newValue;
    // // 여기에서 API 호출 등의 로직을 추가할 수 있습니다.
};
const addNewRow = () => {
    // Create a new data object for the row
    const newProduct = {
        id: products.value.length + 1, // Generate a unique ID
        productCode: '',
        productname: '',
        line: '',
        productPlanQty: 0,
        plannedQty: 1000,
        productType: '',
        lastname: '김관리'
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
        <Button label=" 계획등록 " rounded @click="insertPlan" />
        <Button label=" 초기화 " severity="info" rounded @click="dropContent" />
    </div>
    <div class="font-semibold text-xl mb-4">계획등록</div>
    <div class="card flex justify-center gap-6 py-4">
        <!-- 생산계획코드 영역 -->
        <div class="flex flex-col">
            <label for="planCode" class="mb-1">계획구분</label>
            <div class="flex items-center gap-2">
                <InputText class="w-64" list="item-list" />
                <!-- <Button icon="pi pi-search" severity="secondary" variant="text" @click="openModal('productPlanCode')" /> -->
                <!-- <IconField iconPosition="left">
                    <InputText class="w-64" ref="inputValue" v-model="search.productPlanCode" id="planCodeInput" readonly />
                    <InputIcon class="pi pi-search" @click="openModal('productPlanCode')" />
                </IconField> -->
            </div>
        </div>
        <datalist id="item-list">
            <option value="계획생산"></option>
            <option value="주문생산"></option>
            <option value="긴급생산"></option>
        </datalist>

        <!-- 지시자 영역 -->
        <div class="flex flex-col">
            <label for="lastname" class="mb-1">계획일자</label>
            <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="planDate" />
        </div>
        <div class="flex flex-col">
            <label for="lastname" class="mb-1">계획시작일시</label>
            <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="planStartDate" />
        </div>
        <div class="flex flex-col">
            <label for="lastname" class="mb-1">계획종료일시</label>
            <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="planEndDate" />
        </div>
        <div class="flex flex-col">
            <label for="lastname" class="mb-1">납기일시</label>
            <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="dueDate" />
        </div>
        <div class="flex flex-col">
            <label for="lastname" class="mb-1">지시자</label>
            <InputText id="lastnameTxt" type="text" value="김관리" disabled />
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
                    <!-- {{ field === ['name', 'endDate'] ? formatCurrency(data[field]) : data[field] }} -->
                    <span v-if="['startDatetime', 'endDatetime'].includes(field)">
                        {{ formatDate(data[field]) }}
                    </span>
                    <span v-else>{{ data[field] }}</span>
                </template>
                <template #editor="{ data, field }">
                    <template v-if="['startDatetime', 'endDatetime'].includes(field)">
                        <Calendar v-model="data[field]" dateFormat="yy-mm-dd" showTime hourFormat="24" fluid />
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
