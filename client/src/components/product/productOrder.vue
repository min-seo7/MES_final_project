<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';

//const dateValue = ref({});
const search = ref({
    productPlanCode: '',
    planStartDate: '',
    planEndDate: '',
    director: ''
});

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
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:10', endDate: '2025-08-10 18:00', director: '김관리' },
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:20', endDate: '2025-08-10 18:00', director: '김관리' },
    { code: 'PL20250808P003-20', startDate: '2025-08-10 09:30', endDate: '2025-08-10 18:00', director: '김관리' },
    { code: 'PL20250808P003-40', startDate: '2025-08-10 09:40', endDate: '2025-08-10 18:00', director: '김관리' },
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:50', endDate: '2025-08-10 18:00', director: '김관리' }
]);

const products = ref([
    {
        id: 1,
        startDatetime: new Date('2025-08-10 10:00'),
        endDatetime: new Date('2025-08-12 10:10'),
        productname: '과립형비료 20kg',
        productPlanQty: 10000,
        productType: '과립형',
        undefinedQty: 9000,
        currentQty: 1000,
        line: 'B01',
        lastname: '김관리'
    },
    {
        id: 2,
        startDatetime: new Date('2025-08-10 10:20'),
        endDatetime: new Date('2025-08-12 10:20'),
        productname: '과립형비료 20kg',
        productPlanQty: 10000,
        productType: '과립형',
        undefinedQty: 9000,
        currentQty: 1000,
        line: 'B01',
        lastname: '김관리'
    }
]);

const selectedProducts = ref([]);
const hiddenProductIds = ref(new Set());

const filteredProducts = computed(() => {
    if (!products.value) {
        return []; // Return an empty array if it's undefined
    }
    return products.value.filter((p) => !hiddenProductIds.value.has(p.id));
});

const hideSelected = () => {
    selectedProducts.value.forEach((p) => hiddenProductIds.value.add(p.id));
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

const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleString('ko-KR');
};

// const onDateTimeUpdate = (data, field, value) => {
//     data[field] = value;
// };

const startProduction = async () => {
    //선택된 행을 하나하나 넣어서 들어간다
    //console.log('현재 선택된 행들:', selectedProducts.value);
    // console.log(formatDate(selectedProducts.value.startDatetime));
    // console.log(formatDate(selectedProducts.value.endDatetime));
    //selectedProducts.value = event.value;
    const payload = {
        director: '김지시',
        details: selectedProducts.value
    };
    try {
        await axios.post('/api/production/productionOrder', payload);
        console.log('성공:');
    } catch (err) {
        console.log(err);
    }
};
const onSelectionChange = (event) => {
    //console.log('선택된 행들:', event.value);
    selectedProducts.value = event.value;
    selectedProducts.value.forEach((product) => {
        if (product.endDatetime) {
            product.endDatetime = formatDate(product.endDatetime);
        }
        if (product.startDatetime) {
            product.startDatetime = formatDate(product.startDatetime);
        }
    });
};

const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;
    if (['startDatetime', 'endDatetime'].includes(field)) {
        // console.log(newValue, newValue instanceof Date);
        if (newValue instanceof Date || newValue === null) {
            data[field] = newValue;
            // console.log(data, field, data[field]);
        } else {
            data[field] = null;
        }
    } else if (['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)) {
        if (isNaN(newValue) || newValue < 0) {
            console.warn('음수는 허용되지 않습니다.');
            return;
        }
        data[field] = newValue;
        if (field == 'productPlanQty' || field == 'currentQty') {
            data.undefinedQty = (data.productPlanQty || 0) - (data.currentQty || 0);
        }
    } else {
        data[field] = newValue;
    }
    if (['productname', 'productType', 'line'].includes(field)) {
        if (field == 'productname') {
            data.productType = data.productname.slice(0, 3);
            if (data.productname.slice(0, 3) == '분말형') {
                data.line = 'A01';
            } else if (data.productname.slice(0, 3) == '과립형') {
                data.line = 'B01';
            } else {
                data.line = 'C01';
            }
        }
    }
    event.preventDefault();

    // event 핸들러 발생시 데이트피커가 날짜를 선택하는것이 첫번째 이벤트 ,
    //  찍고 나서 찍은 날짜를 가져오는것이 두번째 이벤트 인데
    // 둘이 순차적으로 처리되는게 아니라 기존에 있던 이벤트가 진행중인데 가져오라고 해버리니까 처리를 할수가 없다 이런건가
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
    newProduct.undefinedQty = (newProduct.productPlanQty || 0) - (newProduct.currentQty || 0);
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
        <Button label=" 지시등록 " @click="startProduction" rounded />
        <Button label=" 초기화 " severity="info" rounded @click="dropContent" />
    </div>

    <div class="font-semibold text-xl mb-4">작업지시</div>

    <div class="card flex justify-center gap-6 py-4">
        <div class="flex flex-col">
            <label for="planCode" class="mb-1">생산계획코드</label>
            <IconField iconPosition="left">
                <InputText class="w-64" v-model="search.productPlanCode" readonly />
                <InputIcon class="pi pi-search" @click="openModal('productPlanCode')" />
            </IconField>
        </div>

        <div class="flex flex-col">
            <label for="lastname" class="mb-1">지시자</label>
            <InputText id="lastnameTxt" value="김지시" type="text" readonly />
        </div>
    </div>

    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 행추가 " rounded @click="addNewRow" />
        <Button label=" 선택삭제 " severity="danger" rounded @click="hideSelected" />
    </div>

    <div class="flex-auto card">
        <DataTable v-model:selection="selectedProducts" :value="filteredProducts" :paginator="true" :rows="4" scrollable scrollHeight="400px" @selection-change="onSelectionChange" editMode="cell" @cell-edit-complete="onCellEditComplete" dataKey="id">
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
                        <!-- <input type="datetime-local" /> -->
                        <DatePicker v-model="data[field]" dateFormat="yy-mm-dd" showTime hourFormat="24" />
                    </template>
                    <!--  -->
                    <template v-else-if="['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)">
                        <InputNumber v-model="data[field]" autofocus fluid />
                    </template>
                    <!--  -->
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
            <DataTable :value="productPlanCodeList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
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
