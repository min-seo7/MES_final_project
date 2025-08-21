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
    productPlanCode: ''
});
const productInstance = ref({
    productname: '',
    productType: '',
    line_id: '',
    specification: '',
    unit: '',
    prd_form: '',
    line_name: '',
    productId: ''
});
const currentEditRow = ref(null);
const showModal = ref(false);
const modalType = ref('');

const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

// const selectModalValue = (value) => {
//     if (modalType.value === 'productPlanCode') {
//     search.value.productPlanCode = value.code;
//     }
//     else if (modalType.value === 'productNameInputModal') {
//         search.value.productname = value.name;
//         search.value.productType = value.type;
//         search.value.line_id = value.line_id;
//         search.value.specification = value.specification;
//         search.value.unit = value.unit;
//         search.value.prd_form = value.prd_form;
//     // }

//      if (currentEditRow.value) {
//             // 저장된 행의 필드 값을 모달에서 선택한 값으로 덮어씁니다.
//             currentEditRow.value.productname = value.name;
//             currentEditRow.value.productType = value.type;
//             currentEditRow.value.line_id = value.line_id;
//             currentEditRow.value.specification = value.specification;
//             currentEditRow.value.unit = value.unit;
//             currentEditRow.value.prd_form = value.prd_form;

//             // 작업이 끝났으므로 편집 중인 행 상태를 초기화합니다.
//             currentEditRow.value = null;
//         }
//     }
//     showModal.value = false;
// };
const selectModalValue = (value) => {
    // 생산계획코드 모달 처리
    if (modalType.value === 'productPlanCode') {
        search.value.productPlanCode = value.code;
    }
    // 제품명 모달 처리
    else if (modalType.value === 'productNameInputModal') {
        productInstance.value.productname = value.name;
        productInstance.value.productId = value.code;
        productInstance.value.productType = value.type;
        productInstance.value.line_id = value.line_id;
        productInstance.value.line_name = value.line_name;
        productInstance.value.specification = value.specification;
        productInstance.value.unit = value.unit;
        productInstance.value.prd_form = value.prd_form;

        // currentEditRow에 값이 있어야만 DataTable의 행을 업데이트합니다.
        if (currentEditRow.value) {
            // 이전에 선택했던 행 데이터를 저장해둡니다.

            currentEditRow.value.productname = value.name;
            currentEditRow.value.productId = value.code;
            currentEditRow.value.productType = value.type;
            currentEditRow.value.line_id = value.line_id;
            currentEditRow.value.line_name = value.line_name;
            currentEditRow.value.specification = value.specification;
            currentEditRow.value.unit = value.unit;
            currentEditRow.value.prd_form = value.prd_form;

            // onCellEditComplete 이벤트를 인위적으로 발생시켜 데이터테이블 업데이트 강제
            const syntheticEvent = {
                data: currentEditRow.value, // 업데이트된 행 데이터
                // 여기를 수정:
                // newValue에 변경된 '제품명(name)' 문자열 값만 할당
                newValue: value.name,
                field: 'productname',
                originalEvent: null,
                preventDefault: () => {}
            };
            // 작업이 끝났으므로 편집 중인 행 상태를 초기화합니다.
            currentEditRow.value = null;
        }
        productInstance.value = null;
    }
    showModal.value = false;
};

const productPlanCodeList = ref([
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:10', endDate: '2025-08-10 18:00', director: '김관리' },
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:20', endDate: '2025-08-10 18:00', director: '김관리' },
    { code: 'PL20250808P003-20', startDate: '2025-08-10 09:30', endDate: '2025-08-10 18:00', director: '김관리' },
    { code: 'PL20250808P003-40', startDate: '2025-08-10 09:40', endDate: '2025-08-10 18:00', director: '김관리' },
    { code: 'PL20250808P002-20', startDate: '2025-08-10 09:50', endDate: '2025-08-10 18:00', director: '김관리' }
]);
const productNameList = ref([
    { code: 'P001', name: '분말형비료', type: '분말형', specification: 20, unit: 'kg', line_id: 'line001', line_name: '라인A', prd_form: '완제품' },
    { code: 'P001', name: '분말형비료', type: '분말형', specification: 40, unit: 'kg', line_id: 'line001', line_name: '라인A', prd_form: '완제품' },
    { code: 'P002', name: '과립형비료', type: '과립형', specification: 20, unit: 'kg', line_id: 'line002', line_name: '라인B', prd_form: '완제품' },
    { code: 'P002', name: '과립형비료', type: '과립형', specification: 40, unit: 'kg', line_id: 'line002', line_name: '라인B', prd_form: '완제품' },
    { code: 'P003', name: '액체형비료', type: '액체형', specification: 5, unit: 'L', line_id: 'line003', line_name: '라인C', prd_form: '완제품' },
    { code: 'P003', name: '액체형비료', type: '액체형', specification: 10, unit: 'L', line_id: 'line003', line_name: '라인C', prd_form: '완제품' },
    { code: 'P001', name: '분말형비료', type: '분말형', specification: null, unit: null, line_id: 'line001', line_name: '라인A', prd_form: '반제품' },
    { code: 'P002', name: '과립형비료', type: '과립형', specification: null, unit: null, line_id: 'line002', line_name: '라인B', prd_form: '반제품' },
    { code: 'P003', name: '액체형비료', type: '액체형', specification: null, unit: null, line_id: 'line003', line_name: '라인C', prd_form: '반제품' }
]);
const lineInfoList = ref([
    { line_id: 'line001', line_name: '라인A', productname: '분말형비료' },
    { line_id: 'line002', line_name: '라인B', productname: '과립형비료' },
    { line_id: 'line003', line_name: '라인C', productname: '액체형비료' }
]);
const products = ref([
    {
        id: 1,
        startDatetime: new Date('2025-08-10 10:00'),
        endDatetime: new Date('2025-08-12 10:10'),
        productId: 'P002',
        productname: '과립형비료',
        productPlanQty: 10000,
        productType: '과립형',
        specification: 20,
        unit: 'kg',
        prd_form: '완제품',
        undefinedQty: 9000,
        currentQty: 1000,
        line_id: 'line002',
        line_name: '라인B',
        lastname: '김관리'
    },
    {
        id: 2,
        startDatetime: new Date('2025-08-10 10:20'),
        endDatetime: new Date('2025-08-12 10:20'),
        productId: 'P002',
        productname: '과립형비료',
        productPlanQty: 10000,
        productType: '과립형',
        specification: 20,
        unit: 'kg',
        prd_form: '완제품',
        undefinedQty: 9000,
        currentQty: 1000,
        line_id: 'line002',
        line_name: '라인B',
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
    { field: 'productId', header: '제품코드' },
    { field: 'productname', header: '제품명' },
    { field: 'productPlanQty', header: '생산계획수량' },
    { field: 'productType', header: '제품형태' },
    { field: 'specification', header: '제품규격' },
    { field: 'unit', header: '단위' },
    { field: 'prd_form', header: '제품구분' },
    { field: 'undefinedQty', header: '미지시수량' },
    { field: 'currentQty', header: '현지시수량' },
    { field: 'line_id', header: '라인코드' },
    { field: 'line_name', header: '라인명' },
    { field: 'lastname', header: '생산지시자' }
]);

const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleString('ko-KR');
};

const startProduction = async () => {
    //선택된 행을 하나하나 넣어서 들어간다
    //console.log('현재 선택된 행들:', selectedProducts.value);
    // console.log(formatDate(selectedProducts.value.startDatetime));
    // console.log(formatDate(selectedProducts.value.endDatetime));
    //selectedProducts.value = event.value;

    // const payload = {
    // // 로그인이 된경우 세션에 저장된 사람의 이름으로 등록될예정
    //     plan_detail_no: search.value.productPlanCode || null,
    //     details: selectedProducts.value
    // };
    //
    const formatForDB = (date) => {
        if ((!date) instanceof Date) {
            return null;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    // console.log('sdt: ',selectedProducts.value.startDatetime);
    // console.log('edt: ',selectedProducts.value.endDatetime);
    const mappedDetails = selectedProducts.value.map((product) => {
        // console.log('시작일시:', product.startDatetime.toLocaleString('ko-KR'));
        // console.log('종료일시:', product.endDatetime.toLocaleString('ko-KR'));
        return {
            p_st_date: formatForDB(product.startDatetime),
            p_ed_date: formatForDB(product.endDatetime),
            prd_noworder_qty: product.currentQty,
            line_id: product.line_id,
            ord_no: null,
            product_name: product.productname,
            plan_detail_no: search.value.productPlanCode || null,
            specification: product.specification,
            unit: product.unit,
            prd_form: product.prd_form,
            product_id: product.productId
        };
    });
    console.log('p_st_date:', mappedDetails.p_st_date);
    // console.log('맵핑된 제품들:', mappedDetails);
    const payload = {
        director: '김지시',
        plan_detail_no: search.value.productPlanCode || null,
        // details: selectedProducts.value
        details: mappedDetails
    };
    try {
        console.log('전송할 데이터:', payload.details);
        // 서버에 POST 요청을 보내기
        await axios.post('/api/production/productionOrder', payload);
        console.log('성공:');
    } catch (err) {
        console.log(err);
    }
};
const onSelectionChange = (event) => {
    selectedProducts.value = event.value;
    console.log('선택된 행들:', event.value);
    alert('선택된 행들: ' + event.value.length + '개');
    // selectedProducts.value.forEach((product) => {
    //     if (product.endDatetime) {
    //         product.endDatetime = formatDate(product.endDatetime);
    //     }
    //     if (product.startDatetime) {
    //         product.startDatetime = formatDate(product.startDatetime);
    //     }
    // });
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
        event.preventDefault();
    } else if (['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)) {
        if (isNaN(newValue) || newValue < 0) {
            console.warn('음수는 허용되지 않습니다.');

            return;
        }
        data[field] = newValue;
        if (field == 'productPlanQty' || field == 'currentQty') {
            data.undefinedQty = (data.productPlanQty || 0) - (data.currentQty || 0);
        }

        // } else if (['productname'].includes(field)) {
        //     if (field == 'productname') {

        // currentEditRow.value = data; // 현재 편집 중인 행을 저장
        // console.log('현재 편집 중인 행:', currentEditRow.value);
        // openModal('productNameInputModal'); // 모달 열기
        // event.preventDefault();
        // }
    } else {
        data[field] = newValue;
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
        unit: '',
        specification: '',
        prd_form: '',
        undefinedQty: 0,
        currentQty: 0,
        line_id: '',
        line_name: '',
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

    <div class="flex flex-row gap-4 h-full">
        <div class="flex-grow card">
            <DataTable
                v-model:selection="selectedProducts"
                :value="filteredProducts"
                :paginator="true"
                :rows="4"
                scrollable
                scrollHeight="400px"
                @selection-change="onSelectionChange"
                editMode="cell"
                @cell-edit-complete="onCellEditComplete"
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
                            <DatePicker v-model="data[field]" dateFormat="yy-mm-dd" showTime hourFormat="24" />
                        </template>
                        <template v-else-if="['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)">
                            <InputNumber v-model="data[field]" autofocus fluid />
                        </template>
                        <template v-else-if="['productname'].includes(field)">
                            <InputText
                                v-model="data[field]"
                                @click="
                                    () => {
                                        productInstance = data;
                                        openModal('productNameInputModal');
                                    }
                                "
                                readonly
                            />
                        </template>
                        <template v-else>
                            <InputText v-model="data[field]" autofocus fluid />
                        </template>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- <div class="w-1/3 card">
            <h3 class="font-bold text-lg mb-4">BOM 소요 정보</h3>
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">제품코드</label>
                <InputText class="mt-1 block w-full" />
            </div>
            <div class="mt-2">
                <Button label="저장" class="w-full mt-4" />
            </div>
        </div> -->
    </div>

    <Dialog v-model:visible="showModal" modal header="생산계획코드 리스트" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold mb-4 text-lg">
            🔍
            {{
                {
                    productPlanCode: '생산계획코드',
                    productNameInputModal: '제품명',
                    lineInfoModal: '생산라인 정보'
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
        <div v-else-if="modalType === 'productNameInputModal'">
            <DataTable :value="productNameList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
                <Column field="name" header="제품명">
                    <template #body="{ data }">
                        <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                            {{ data.name }}
                        </span>
                    </template>
                </Column>
                <Column field="code" header="제품코드"></Column>
                <Column field="type" header="제품형태"></Column>
                <Column field="line_id" header="생산라인"></Column>
                <Column field="line_name" header="라인명"></Column>
                <Column field="prd_form" header="제품구분"></Column>
            </DataTable>
        </div>
    </Dialog>
</template>
