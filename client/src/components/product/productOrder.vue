<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import { useUserStore } from '@/store/index';

let userInfo = useUserStore(); // user session information
console.log('session joined user name : ', userInfo.lastname);
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
const prdOrderList = ref([]);
const prdPlanList = ref([
    // { field: 'plan_detail_no', header: '생산계획상세코드' },
    // { field: 'plan_no', header: '생산계획코드' },
    // { field: 'startDate', header: '생산시작일시' },
    // { field: 'endDate', header: '생산종료일시' },
    // { field: 'planned_qty', header: '기지시수량' },
    // { field: 'line_id', header: '라인코드' },
    // { field: 'line_name', header: '라인명' },
    // { field: 'product_id', header: '제품코드' },
    // { field: 'product_type', header: '제품형태' },
    // { field: 'productname', header: '제품명' },
    // { field: 'productForm', header: '제품구분' },
    // { field: 'specification', header: '규격' },
    // { field: 'unit', header: '단위' }
]);
const currentEditRow = ref(null);
const showModal = ref(false);
const modalType = ref('');
//
// const startDate = ref('');
// const endDate = ref('');
// const productId = ref('');
// const productName = ref('');
// const productType = ref('');
// const specification = ref('');
// const unit = ref('');
// const productForm = ref('');
// const prd_noworder_qty = ref(0);
// const line_id = ref('');
// const line_name = ref('');
// const lastname = ref('');
//
const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};
const fetchPrdOrders = async () => {
    try {
        const response = await axios.get('/api/production/productionOrder');
        console.log(response.data.list);
        // API 응답 데이터를 prdOrderList에 할당
        if (Array.isArray(response.data.list)) {
            // 2. 배열이면 prdOrderList에 할당
            prdOrderList.value = response.data.list.map((item) => ({
                startDate: formatDate(item.startDate),
                endDate: formatDate(item.endDate),
                prd_noworder_qty: item.prd_noworder_qty,
                line_id: item.line_id,
                line_name: item.line_name,
                product_id: item.product_id,
                product_type: item.product_type,
                productname: item.product_name,
                specification: item.specification,
                unit: item.unit,
                prd_form: item.prd_form,
                lastname: userInfo.lastname || '김지시'
            }));
        } else {
            // 3. 배열이 아니면 빈 배열로 초기화
            prdOrderList.value = [];
            console.warn('서버 응답이 배열이 아닙니다. DataTable에 빈 배열을 할당합니다.');
        }
        console.log('데이터 조회 성공:', prdOrderList.value);
    } catch (error) {
        console.error('데이터 조회 실패:', error);
    }
};
const fetchPlanList = async () => {
    try {
        const response = await axios.get('/api/production/fetchPlanList');
        if (response) {
            console.log('생산 계획 조회 성공');
            console.log(response.data.list);
            prdPlanList.value = response.data.list.map((item) => ({
                plan_detail_no: item.planDetailNo,
                plan_no: item.plan_no,
                // startDate: formatDate(item.startDate),
                // endDate: formatDate(item.endDate),
                startDate: item.startDate,
                endDate: item.endDate,
                planned_qty: item.planned_qty,
                line_id: item.line_id,
                line_name: item.line_name,
                product_id: item.product_id,
                product_type: item.p_type,
                productname: item.product_name,
                productForm: item.product_form,
                specification: item.specification,
                unit: item.unit
            }));
        } else {
            console.log('조회가 정상적으로 이루어 지지 않았습니다!');
        }
    } catch (error) {
        console.error(error);
    }
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
        search.value.productPlanCode = value.plan_detail_no;
        console.log(value.startDate);
        const newProduct = {
            id: products.value.length ? Math.max(...products.value.map((p) => p.id)) + 1 : 1,
            startDatetime: value.startDate,
            endDatetime: value.endDate,
            productId: value.product_id,
            productname: value.productname,
            productPlanQty: value.planned_qty,
            productType: value.p_type, // API 응답 필드명에 맞게 수정
            specification: value.specification,
            unit: value.unit,
            prd_form: value.productForm,
            undefinedQty: value.planned_qty, // 미지시수량을 계획수량과 동일하게 설정
            currentQty: 0, // 현지시수량은 0으로 시작
            line_id: value.line_id,
            line_name: value.line_name,
            lastname: userInfo.lastname || '김관리'
        };

        // 새로운 행을 products 배열에 추가
        products.value.push(newProduct);
        console.log('생산계획 데이터가 새로운 행으로 추가되었습니다:', newProduct);

        // currentEditRow.value.startDatetime = formatDate(value.startDate);
        // currentEditRow.value.endDatetime = formatDate(value.endDate);
        // currentEditRow.value.productname = value.productname;
        // currentEditRow.value.productId = value.product_id;
        // currentEditRow.value.productType = value.product_type;
        // currentEditRow.value.line_id = value.line_id;
        // currentEditRow.value.line_name = value.line_name;
        // currentEditRow.value.specification = value.specification;
        // currentEditRow.value.unit = value.unit;
        // currentEditRow.value.prd_form = value.productForm;
    }
    // 제품명 모달 처리
    else if (modalType.value === 'productNameInputModal') {
        if (currentEditRow.value) {
            // 변경할 행의 인덱스 찾기
            const rowIndex = products.value.findIndex((p) => p.id === currentEditRow.value.id);

            if (rowIndex !== -1) {
                // 원본 배열의 해당 행 데이터를 직접 업데이트
                products.value[rowIndex].productname = value.name;
                products.value[rowIndex].productId = value.code;
                products.value[rowIndex].productType = value.type;
                products.value[rowIndex].line_id = value.line_id;
                products.value[rowIndex].line_name = value.line_name;
                products.value[rowIndex].specification = value.specification;
                products.value[rowIndex].unit = value.unit;
                products.value[rowIndex].prd_form = value.prd_form;
            }
            // 편집 중인 행 상태 초기화
            currentEditRow.value = null;
        }

        productInstance.value.productname = value.name;
        productInstance.value.productId = value.code;
        productInstance.value.productType = value.type;
        productInstance.value.line_id = value.line_id;
        productInstance.value.line_name = value.line_name;
        productInstance.value.specification = value.specification;
        productInstance.value.unit = value.unit;
        productInstance.value.prd_form = value.prd_form;

        // currentEditRow에 값이 있어야만 DataTable의 행을 업데이트합니다.
        // if (currentEditRow.value) {
        //     // 이전에 선택했던 행 데이터를 저장해둡니다.

        //     currentEditRow.value.productname = value.name;
        //     currentEditRow.value.productId = value.code;
        //     currentEditRow.value.productType = value.type;
        //     currentEditRow.value.line_id = value.line_id;
        //     currentEditRow.value.line_name = value.line_name;
        //     currentEditRow.value.specification = value.specification;
        //     currentEditRow.value.unit = value.unit;
        //     currentEditRow.value.prd_form = value.prd_form;

        //     // onCellEditComplete 이벤트를 인위적으로 발생시켜 데이터테이블 업데이트 강제
        //     // const syntheticEvent = {
        //     //     data: currentEditRow.value, // 업데이트된 행 데이터
        //     //     // 여기를 수정:
        //     //     // newValue에 변경된 '제품명(name)' 문자열 값만 할당
        //     //     newValue: value.name,
        //     //     field: 'productname',
        //     //     originalEvent: null,
        //     //     preventDefault: () => {}
        //     // };
        //     // 작업이 끝났으므로 편집 중인 행 상태를 초기화합니다.
        //     currentEditRow.value = null;
        // }
        // productInstance.value = null;
    }
    showModal.value = false;
};

const productNameList = ref([
    { code: 'P001', name: '분말형비료', product_cate: 'P001', type: '분말형', specification: 20, unit: 'kg', line_id: 'L001', line_name: '라인001', prd_form: '완제품' },
    { code: 'P002', name: '분말형비료', product_cate: 'P001', type: '분말형', specification: 40, unit: 'kg', line_id: 'L001', line_name: '라인001', prd_form: '완제품' },
    { code: 'P003', name: '과립형비료', product_cate: 'P002', type: '과립형', specification: 20, unit: 'kg', line_id: 'L002', line_name: '라인002', prd_form: '완제품' },
    { code: 'P004', name: '과립형비료', product_cate: 'P002', type: '과립형', specification: 40, unit: 'kg', line_id: 'L002', line_name: '라인002', prd_form: '완제품' },
    { code: 'P005', name: '액상형비료', product_cate: 'P003', type: '액상형', specification: 5, unit: 'L', line_id: 'L003', line_name: '라인003', prd_form: '완제품' },
    { code: 'P006', name: '액상형비료', product_cate: 'P003', type: '액상형', specification: 10, unit: 'L', line_id: 'L003', line_name: '라인003', prd_form: '완제품' },
    { code: 'P007', name: '분말형비료', product_cate: 'P001', type: '분말형', specification: null, unit: null, line_id: 'L001', line_name: '라인001', prd_form: '반제품' },
    { code: 'P008', name: '과립형비료', product_cate: 'P002', type: '과립형', specification: null, unit: null, line_id: 'L002', line_name: '라인002', prd_form: '반제품' },
    { code: 'P009', name: '액상형비료', product_cate: 'P003', type: '액상형', specification: null, unit: null, line_id: 'L003', line_name: '라인003', prd_form: '반제품' }
]);
// const lineInfoList = ref([
//     { line_id: 'line001', line_name: '라인A', productname: '분말형비료' },
//     { line_id: 'line002', line_name: '라인B', productname: '과립형비료' },
//     { line_id: 'line003', line_name: '라인C', productname: '액체형비료' }
// ]);
const products = ref([]);
const productCodeToBomId = {
    P001: 'BOM001',
    P002: 'BOM001',
    P003: 'BOM002',
    P004: 'BOM002',
    P005: 'BOM003',
    P006: 'BOM003',
    P007: 'BOM001',
    P008: 'BOM002',
    P009: 'BOM003'
};
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

const prdOrderDetailcolumns = ref([
    { field: 'startDate', header: '생산시작일시' },
    { field: 'endDate', header: '생산종료일시' },
    { field: 'product_id', header: '제품코드' },
    { field: 'productname', header: '제품명' },
    { field: 'product_type', header: '제품형태' },
    { field: 'specification', header: '제품규격' },
    { field: 'unit', header: '단위' },
    { field: 'prd_form', header: '제품구분' },
    { field: 'prd_noworder_qty', header: '현지시수량' },
    { field: 'line_id', header: '라인코드' },
    { field: 'line_name', header: '라인명' },
    { field: 'lastname', header: '생산지시자' }
]);

const formatDate = (value) => {
    // if (!value) return '';
    // return new Date(value).toLocaleString('ko-KR');
    if (!value) return '';
    if (value instanceof Date) {
        // Date 객체일 경우
        return value.toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' });
    }
    // 문자열일 경우 (서버에서 넘어온 경우)
    return new Date(value).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' });
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
        director: userInfo.lastname || '김지시',
        plan_detail_no: search.value.productPlanCode || null,
        // details: selectedProducts.value
        details: mappedDetails
    };
    // 3-2. BOM 요청용 payload (bom_id 포함)
    const bomPayload = selectedProducts.value.map((product) => ({
        req_qty: product.currentQty,
        bom_id: productCodeToBomId[product.productId] || null // 제품코드에 해당하는 BOM ID
    }));
    try {
        console.log('전송할 데이터:', payload.details);
        // 서버에 POST 요청을 보내기
        const response = await axios.post('/api/production/productionOrder', payload);
        console.log('성공:', response.data);

        if (response) {
            products.value = []; // 데이터 테이블 초기화
            selectedProducts.value = []; // 선택된 행 초기화
            hiddenProductIds.value = new Set(); // 숨겨진 행 초기화
            //prdOrderList.value = null;
        }
    } catch (err) {
        console.log(err);
    }

    try {
        await axios.post('/api/production/bomRequestInsert', { details: bomPayload });
        console.log('BOM 요청 성공');
    } catch (err) {
        console.log('BOM 요청 실패:', err);
    }
};
// const onSelectionChange = (event) => {
//     // selectedProducts.value = event.value;
//     selectedProducts.value = event.value.map((product) => ({
//         ...product,
//         bom_id: productCodeToBomId[product.productId] || null
//     }));
//     console.log('선택된 행들:', selectedProducts.value);
//     alert('선택된 행들: ' + selectedProducts.value.length + '개');
//     // selectedProducts.value.forEach((product) => {
//     //     if (product.endDatetime) {
//     //         product.endDatetime = formatDate(product.endDatetime);
//     //     }
//     //     if (product.startDatetime) {
//     //         product.startDatetime = formatDate(product.startDatetime);
//     //     }
//     // });
// };

// const onCellEditComplete = (event) => {
//     let { data, newValue, field } = event;
//     if (['startDatetime', 'endDatetime'].includes(field)) {
//         // console.log(newValue, newValue instanceof Date);
//         if (newValue instanceof Date || newValue === null) {
//             data[field] = newValue;
//             // console.log(data, field, data[field]);
//         } else {
//             data[field] = null;
//         }
//         event.preventDefault();
//     } else if (['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)) {
//         if (isNaN(newValue) || newValue < 0) {
//             console.warn('음수는 허용되지 않습니다.');

//             return;
//         }
//         data[field] = newValue;
//         if (field == 'productPlanQty' || field == 'currentQty') {
//             data.undefinedQty = (data.productPlanQty || 0) - (data.currentQty || 0);
//         }

//         // } else if (['productname'].includes(field)) {
//         //     if (field == 'productname') {

//         // currentEditRow.value = data; // 현재 편집 중인 행을 저장
//         // console.log('현재 편집 중인 행:', currentEditRow.value);
//         // openModal('productNameInputModal'); // 모달 열기
//         // event.preventDefault();
//         // }
//     } else {
//         data[field] = newValue;
//     }
//     event.preventDefault();

//     // event 핸들러 발생시 데이트피커가 날짜를 선택하는것이 첫번째 이벤트 ,
//     //  찍고 나서 찍은 날짜를 가져오는것이 두번째 이벤트 인데
//     // 둘이 순차적으로 처리되는게 아니라 기존에 있던 이벤트가 진행중인데 가져오라고 해버리니까 처리를 할수가 없다 이런건가
// };
const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;
    // DatePicker 필드 처리
    console.log(newValue);
    if (['startDatetime', 'endDatetime'].includes(field)) {
        if (newValue instanceof Date) {
            data[field] = newValue;
        } else {
            data[field] = null;
        }
    }
    // 숫자 입력 필드 처리
    else if (['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)) {
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
    // 중요: 여기에서 event.preventDefault(); 를 사용하지 마세요.
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
        lastname: userInfo.lastname || '김관리'
    };
    newProduct.undefinedQty = (newProduct.productPlanQty || 0) - (newProduct.currentQty || 0);
    products.value.push(newProduct);
};

const dropContent = () => {
    Object.assign(search.value, {
        productPlanCode: ''
    });
};
onMounted(async () => {
    await fetchPrdOrders();
    await fetchPlanList();
});
</script>

<template>
    <div class="flex justify-end mb-4 space-x-2">
        <div class="space-x-2">
            <Button label=" 지시등록 " class="text-xs px-2 py-1 h-[28px]" @click="startProduction" rounded />
            <Button label=" 초기화 " class="text-xs px-2 py-1 h-[28px]" severity="info" rounded @click="dropContent" />
        </div>
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
            <InputText id="lastnameTxt" v-model="userInfo.lastname" type="text" readonly />
        </div>
    </div>
    <div class="mb-6">
        <DataTable :value="prdOrderList" tableStyle="min-width: 50rem" :paginator="true" :rows="4" scrollable scrollHeight="200px">
            <Column v-for="col of prdOrderDetailcolumns" :key="col.field" :field="col.field" :header="col.header">
                <template #body="{ data, field }">
                    <!-- <span v-if="col.field === 'startDate' || col.field === 'endDate'">
                        {{ formatDate(data[field]) }}
                    </span> -->
                    <span v-if="col.field === 'lastname'">
                        {{ userInfo.lastname }}
                    </span>
                    <span v-else>{{ data[field] }}</span>
                </template>
            </Column>
        </DataTable>
    </div>

    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 행추가 " class="text-xs px-2 py-1 h-[28px]" rounded @click="addNewRow" />
        <Button label=" 선택삭제 " class="text-xs px-2 py-1 h-[28px]" severity="danger" rounded @click="hideSelected" />
    </div>

    <div class="flex flex-row gap-4 h-full">
        <div class="flex-grow card">
            <!-- <DataTable
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
            > -->
            <DataTable v-model:selection="selectedProducts" :value="filteredProducts" :paginator="true" :rows="6" editMode="cell" scrollable scrollHeight="190px" @cell-edit-complete="onCellEditComplete" dataKey="id">
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
                            <!-- <DatePicker
                                :key="data.id"
                                v-model="data[field]"
                                dateFormat="yy-mm-dd"
                                showTime
                                hourFormat="24"
                                @change="
                                    (e) => {
                                        data[field] = e;
                                    }
                                "
                            /> -->
                            <input type="datetime-local" v-model="data[field]" @change="data[field] = data[field] ? new Date(data[field]) : null" class="p-1 border rounded w-full" />
                        </template>
                        <template v-else-if="['productPlanQty', 'undefinedQty', 'currentQty'].includes(field)">
                            <InputNumber v-model="data[field]" autofocus fluid />
                        </template>
                        <template v-else-if="['productname'].includes(field)">
                            <InputText
                                v-model="data[field]"
                                @click="
                                    () => {
                                        currentEditRow = data;
                                        console.log('data List : ', data);
                                        console.log('productname : ', currentEditRow.productname);
                                        // productInstance = data;
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

    <Dialog v-model:visible="showModal" modal header="생산계획코드 리스트" :style="{ width: '72vw' }" @hide="closeModal">
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
            <DataTable :value="prdPlanList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
                <Column field="plan_detail_no" header="생산계획상세코드">
                    <template #body="{ data }">
                        <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                            {{ data.plan_detail_no }}
                        </span>
                    </template>
                </Column>
                <Column field="plan_no" header="생산계획코드"></Column>
                <Column field="startDate" header="생산시작일시">
                    <template #body="{ data }">
                        <span>
                            {{ formatDate(data.startDate) }}
                        </span>
                    </template>
                </Column>
                <Column field="endDate" header="생산종료일시">
                    <template #body="{ data }">
                        <span>
                            {{ formatDate(data.endDate) }}
                        </span>
                    </template>
                </Column>
                <Column field="planned_qty" header="기지시수량"></Column>
                <Column field="product_id" header="제품코드"></Column>
                <Column field="productname" header="제품명"></Column>
                <Column field="product_type" header="제품형태"></Column>
                <Column field="productForm" header="제품구분"></Column>
                <Column field="line_id" header="라인코드"></Column>
                <Column field="line_name" header="라인명"></Column>
                <Column field="specification" header="규격"></Column>
                <Column field="unit" header="단위"></Column>
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
                <Column field="product_cate" header="제품분류코드"></Column>
                <Column field="type" header="제품형태"></Column>
                <Column field="line_id" header="생산라인"></Column>
                <Column field="line_name" header="라인명"></Column>
                <Column field="prd_form" header="제품구분"></Column>
            </DataTable>
        </div>
    </Dialog>
</template>
