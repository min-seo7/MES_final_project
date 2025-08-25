<script setup>
import { ref, computed, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import axios from 'axios';
import { useUserStore } from '@/store/index';

let userInfo = useUserStore(); // user session information
console.log('session joined user name : ', userInfo.lastname ? userInfo.lastname : null);
const search = ref({
    productPlanCode: '',
    planStartDate: '',
    planEndDate: '',
    director: ''
});
const currentEditRow = ref(null);

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
    if (modalType.value === 'productPlanCode') {
        search.value.productPlanCode = value.code;
    }
    if (modalType.value === 'productCode') {
        if (currentEditRow.value) {
            // 변경할 행의 인덱스 찾기
            const rowIndex = products.value.findIndex((p) => p.id === currentEditRow.value.id);
            if (rowIndex !== -1) {
                // 행의 제품 코드와 제품명 업데이트
                products.value[rowIndex].productCode = value.productCode;
                products.value[rowIndex].productname = value.productName;
                products.value[rowIndex].productType = value.productType;
                products.value[rowIndex].specification = value.specification;
                products.value[rowIndex].unit = value.unit;
                products.value[rowIndex].lineId = value.lineId;
                products.value[rowIndex].linename = value.linename;
            }

            currentEditRow.value = null; // 편집 중인 행 초기화
        }
    }
    showModal.value = false;
};
// const productCodeList = ref([
//     { code: 'PRD001', name: '분말형비료', specification: 'kg', unit: 20, prd_form: '완제품' }, //
//     { code: 'PRD001', name: '분말형비료', specification: 'kg', unit: 40, prd_form: '완제품' }, //
//     { code: 'PRD002', name: '과립형비료', specification: 'kg', unit: 20, prd_form: '완제품' }, //
//     { code: 'PRD002', name: '과립형비료', specification: 'kg', unit: 40, prd_form: '완제품' }, //
//     { code: 'PRD003', name: '액상형비료', specification: 'L', unit: 5, prd_form: '완제품' }, //
//     { code: 'PRD003', name: '액상형비료', specification: 'L', unit: 10, prd_form: '완제품' }, //
//     { code: 'PRD001', name: '분말형비료', specification: null, unit: null, prd_form: '반제품' }, //
//     { code: 'PRD001', name: '과립형비료', specification: null, unit: null, prd_form: '반제품' }, //
//     { code: 'PRD001', name: '액상형비료', specification: null, unit: null, prd_form: '반제품' } //
// ]);

const products = ref([
    { id: 1, productCode: 'P001', productname: '분말형비료', productType: '완제품', specification: 20, unit: 'kg', lineId: 'L001', linename: '라인001', productPlanQty: 10000, plannedQty: 1000 },
    { id: 2, productCode: 'P003', productname: '과립형비료', productType: '완제품', specification: 20, unit: 'kg', lineId: 'L002', linename: '라인002', productPlanQty: 10000, plannedQty: 1000 }
    // { id: 3, productCode: 'PRD003', productname: '액상형비료', line: 'C01', productPlanQty: 10000, plannedQty: 1000,  currentQty: 1000, productType: '완제품' }
]);
const selectedProducts = ref([]);
const hiddenProductIds = ref(new Set());
const productInfoList = ref([]); // 제품정보 리스트

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
    { field: 'productType', header: '제품유형' },
    { field: 'specification', header: '규격' },
    { field: 'unit', header: '단위' },
    { field: 'lineId', header: '라인코드' },
    { field: 'linename', header: '라인명' },
    { field: 'productPlanQty', header: '생산계획수량' },
    { field: 'plannedQty', header: '기지시수량' }
]);

// const formatCurrency = (value) => {
//     return value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
// };
// const formatDate = (value) => {
//     if (!value) return '';
//     const date = new Date(value);
//     return date.toLocaleString('ko-KR'); // 또는 원하는 형식으로 포맷
// };
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};
const productListMoal = async () => {
    try {
        const response = await axios.get('/api/production/productListModal'); // 실제 API 엔드포인트로 변경
        console.log(response.data.list);
        if (Array.isArray(response.data.list)) {
            productInfoList.value = response.data.list.map((item) => ({
                productCode: item.product_id,
                productName: item.product_name,
                productType: item.product_type,
                specification: item.specification,
                unit: item.unit,
                lineId: item.line_id,
                linename: item.line_name
            }));
        } else {
            console.error('제품 정보가 배열이 아닙니다:', response.data.list);
        }
    } catch (error) {
        console.error('제품 정보를 가져오는 중 오류 발생:', error);
    }
};

const onCellEditComplete = (event) => {
    // event 객체에서 편집된 정보를 가져옵니다.
    let { data, newValue, field } = event;
    console.log(data);
    if (['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)) {
        if (newValue == null || isNaN(newValue) || newValue < 0) {
            return;
        }
        data[field] = newValue;
        if (field == 'productPlanQty' || field == 'currentQty') {
            data.undefinedQty = (data.productPlanQty || 0) - (data.currentQty || 0);
        }
    }
    // 그 외 일반 텍스트 필드 처리
    else {
        data[field] = newValue;
    }
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
        lastname: userInfo.lastname || '김관리'
    };
    // Add the new object to the data array
    products.value.push(newProduct);
};

// 데이터 모델
const planData = ref({
    planType: null, // 계획 구분 (코드 값 저장)
    planDate: null,
    planStartDate: null,
    planEndDate: null,
    dueDate: null,
    director: userInfo.lastname || '김계획'
});

// 계획 구분 Dropdown 옵션
const planCategories = ref([
    { label: '계획생산', value: 'planFormCode001' },
    { label: '주문생산', value: 'planFormCode002' },
    { label: '긴급생산', value: 'planFormCode003' }
]);

const dropContent = () => {
    Object.assign(search.value, {
        productPlanCode: '',
        planType: null
    });
};

const insertPlan = async () => {
    try {
        const payload = {
            planType: planData.value.planType,
            planDate: formatDate(planData.value.planDate),
            planStartDate: formatDate(planData.value.planStartDate),
            planEndDate: formatDate(planData.value.planEndDate),
            dueDate: formatDate(planData.value.dueDate),
            director: userInfo.lastname || '김계획',
            products: products.value.filter((p) => !hiddenProductIds.value.has(p.id))
        };
        console.log('payload : ', payload);
        const response = await axios.post('/api/production/insertPlan', payload);
        if (response) {
            alert('계획이 성공적으로 등록되었습니다.');
        }
    } catch (error) {
        console.error('계획 등록 중 오류 발생:', error);
    }
};

onMounted(async () => {
    await productListMoal();
});
</script>
<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 계획등록 " class="text-xs px-2 py-1 h-[28px]" rounded @click="insertPlan" />
        <Button label=" 초기화 " class="text-xs px-2 py-1 h-[28px]" severity="info" rounded @click="dropContent" />
    </div>
    <div class="font-semibold text-xl mb-4">계획등록</div>
    <div class="card flex justify-center gap-6 py-4">
        <!-- 생산계획코드 영역 -->
        <div class="flex flex-col">
            <!-- <label for="planCode" class="mb-1">계획구분</label>
            <div class="flex items-center gap-2">
                <InputText class="w-64" list="item-list" />
            </div> -->
            <label for="planType" class="mb-1">계획구분</label>
            <div class="flex items-center gap-2">
                <Dropdown id="planType" v-model="planData.planType" :options="planCategories" optionLabel="label" optionValue="value" placeholder="계획 구분 선택" class="w-64" />
            </div>
        </div>
        <datalist id="item-list">
            <option value="계획생산"></option>
            <option value="주문생산"></option>
            <option value="긴급생산"></option>
        </datalist>

        <!-- 지시자 영역 -->
        <div class="flex flex-col">
            <label for="planDate" class="mb-1">계획일자</label>
            <DatePicker class="flex-1" dateFormat="yy-mm-dd" v-model="planData.planDate" showIcon fluid iconDisplay="input" />
        </div>
        <div class="flex flex-col">
            <label for="planStartDate" class="mb-1">계획시작일시</label>
            <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="planData.planStartDate" showIcon fluid iconDisplay="input" />
        </div>
        <div class="flex flex-col">
            <label for="planEndDate" class="mb-1">계획종료일시</label>
            <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="planData.planEndDate" showIcon fluid iconDisplay="input" />
        </div>
        <div class="flex flex-col">
            <label for="dueDate" class="mb-1">납기일시</label>
            <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="planData.dueDate" showIcon fluid iconDisplay="input" />
        </div>
        <div class="flex flex-col">
            <label for="lastname" class="mb-1">지시자</label>
            <InputText id="lastnameTxt" type="text" v-model="userInfo.lastname" disabled />
        </div>
    </div>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 행추가 " class="text-xs px-2 py-1 h-[28px]" rounded @click="addNewRow" />
        <Button label=" 선택삭제 " class="text-xs px-2 py-1 h-[28px]" severity="danger" rounded @click="hideSelected" />
    </div>
    <div class="flex-auto card">
        <DataTable
            v-model:selection="selectedProducts"
            :value="filteredProducts"
            :paginator="true"
            :rows="4"
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
                    <span>{{ data[field] }}</span>
                </template>
                <template #editor="{ data, field }">
                    <template v-if="['productCode'].includes(field)">
                        <InputText
                            v-model="data[field]"
                            autofocus
                            @click="
                                () => {
                                    currentEditRow = data;
                                    openModal('productCode');
                                }
                            "
                        />
                    </template>
                    <template v-else>
                        <InputText v-model="data[field]" autofocus />
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
                    productCode: '제품명'
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
        <div v-else-if="modalType === 'productCode'">
            <!-- <ul class="mb-3"> -->

            <DataTable :value="productInfoList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 20rem" class="mb-3">
                <Column field="productCode" header="제품코드">
                    <template #body="{ data }">
                        <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                            {{ data.productCode }}
                        </span>
                    </template>
                </Column>
                <Column field="productName" header="제품명"></Column>
                <Column field="productType" header="제품유형"></Column>
                <Column field="specification" header="규격"></Column>
                <Column field="unit" header="단위"></Column>
                <Column field="lineId" header="라인코드"></Column>
                <Column field="linename" header="라인명"></Column>
            </DataTable>
        </div>
    </Dialog>
</template>
