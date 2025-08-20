<script setup>
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';

const search = ref({
    productPlanCode: ''
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
    // 생산계획코드 모달 처리
    if (modalType.value === 'productPlanCode') {
        search.value.productPlanCode = value.code;
    }
    showModal.value = false;
};
const productionOrderList = ref([]);
const loading = ref(true); // 로딩 상태를 관리하는 변수
const columns = ref([
    { field: 'wo_no', header: '공정지시코드' },
    { field: 'startDate', header: '작업시작일시' },
    { field: 'endDate', header: '작업종료일시' },
    { field: 'product_id', header: '제품코드' },
    { field: 'product_name', header: '제품명' },
    { field: 'specification', header: '규격' },
    { field: 'unit', header: '단위' },
    { field: 'use_order', header: '공정순서' },
    { field: 'process', header: '공정' },
    { field: 'process_name', header: '공정명' },
    { field: 'line_id', header: '라인코드' },
    { field: 'equipment_id', header: '설비코드' },
    { field: 'prd_noworder_qty', header: '현지시수량' },
    { field: 'in_qty', header: '투입량' },
    { field: 'def_qty', header: '불량량' },
    { field: 'qty', header: '생산량' },
    { field: 'status', header: '상태' }
]);
const items = ref([]);
const selectedRow = ref({});
const onRowSelect = async (event) => {
    let selectedData = event.data;
    console.log('선택된 데이터:', selectedData);
    in_qty.value = selectedData.in_qty ? selectedData.in_qty : 0; // 투입량 초기화
    def_qty.value = selectedData.def_qty ? selectedData.def_qty : 0; // 불량량 초기화
    // const rowIdx = selectedData.use_order-2 > 0 ? selectedData.use_order-2 : 0; // use_order가 1부터 시작하므로 -2
    // const rowData = items.value[rowIdx]; // 해당 인덱스의 데이터 가져오기
    // console.log('선택된 행의 데이터:', rowData);
    const response = await axios.get(`/api/production/checkWoStatus?wo_no=${selectedData.wo_no}`);
     if (selectedData.status == '대기' &&response.data.status == '진행') {
            alert('해당 작업지시에 이미 진행 중인 공정이 있어요!');
            return;
    } 
        
        try {
        // 선택된 데이터에서 필요한 정보를 가져와서 작업자 이름을 조회
        const insertedName = await axios.get(`/api/production/selectEname?wo_no=${selectedData.wo_no}&process_id=${selectedData.process}`);
        if (insertedName.data.success) {
            console.log('작업자 이름:', insertedName.data.e_name);
            worker.value = insertedName.data.e_name ? insertedName.data.e_name : ""; // 작업자 이름 업데이트
            wo_no.value = selectedData.wo_no;
            process.value = selectedData.process;
            process_name.value = selectedData.process_name;
            inQuantity.value = selectedData.prd_noworder_qty;
            lineId.value = selectedData.line_id;
            productId.value = selectedData.product_id;
            productName.value = selectedData.product_name;
            specification.value = selectedData.specification;
            unit.value = selectedData.unit;
            equipmentCode.value = selectedData.equipment_id;
            status.value = selectedData.status;
        } else {
            console.error('작업자를 등록하지 않았거나 조회를 실패하였습니다.');
             wo_no.value = selectedData.wo_no;
            process.value = selectedData.process;
            process_name.value = selectedData.process_name;
            inQuantity.value = selectedData.prd_noworder_qty;
            lineId.value = selectedData.line_id;
            productId.value = selectedData.product_id;
            productName.value = selectedData.product_name;
            specification.value = selectedData.specification;
            unit.value = selectedData.unit;
            equipmentCode.value = selectedData.equipment_id;
            status.value = selectedData.status;
        }
    
    } catch (error) {
        console.error('데이터 가져오기 실패:', error);
        return;
    }finally {
        loading.value = false;
  }
    console.log('선택된 항목:', selectedData);
};
const onCellEditComplete = (event) => {
    // 셀 수정 완료 시 처리 로직을 여기에 구현
    console.log('셀 수정 완료:', event);
};
const worker = ref(''); // 초기값
const process = ref('');
const wo_no = ref('');
const in_qty = ref(0);
const def_qty = ref(0);
const qty = ref(0);
const process_name = ref('');
const productId = ref('');
const productName = ref('');
const specification = ref('');
const unit = ref('');
const startDate = ref('');
const endDate = ref('');
const inQuantity = ref(0);
const lineId = ref('');
const equipmentCode = ref('');
const equipmentName = ref('');
const productionQuantity = ref(0);
const performanceInsStartDate = ref('');
const performanceInsEndDate = ref('');
const status = ref('');
const counter = ref(1); // 실적번호용 카운트 (3자리)
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
const generateCode = () => {
    // 현재 날짜를 YYYYMMDD 형식으로 가져오기
    const now = new Date();
    console.log(now);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateString = `${year}${month}${day}`;

    // 3자리 일련번호를 문자열로 변환 (001, 002...)
    const sequenceNumber = String(counter.value).padStart(3, '0');

    // 최종 코드 생성
    const newCode = `PF${dateString}-${sequenceNumber}`;
    // 다음 일련번호를 위해 카운터 증가
    counter.value++;

    return newCode;

    // 이거 DB에서 seq로 자동 부여되게 할수는 있음 현재는 이 코드로 만들어진 더미데이터가 있어서 DB단에서 생성이 불가 PK제약조건위배
    // concat(CONCAT('PF', DATE_FORMAT(NOW(), '%Y%m%d'),'-',LPAD(NEXT VALUE FOR pf_code_seq, 3, '0'))
};
const fetchProductionOrderList = async () => {
    try {
        const response = await axios.get('/api/production/productionOrderList');
        // Check if response.data exists and has a 'list' property that is an array

        if (response.data && Array.isArray(response.data.list)) {
            productionOrderList.value = response.data.list.map((item) => ({
                wo_no: item.wo_no,
                ord_no: item.ord_no,
                p_st_date: item.p_st_date,
                p_ed_date: item.p_ed_date,
                line_id: item.line_id,
                product_name: item.product_name,
                specification: item.specification,
                unit: item.unit,
                prd_noworder_qty: item.prd_noworder_qty
            }));
            console.log(response);
        } else {
            // This case handles when the server sends an unexpected format
            console.error('서버 응답 형식이 올바르지 않습니다:', response.data);
            productionOrderList.value = [];
        }
    } catch (error) {
        // This handles network errors or server response status codes like 4xx, 5xx
        console.error('실패:', error);
    } finally {
        loading.value = false;
    }
};

// API 호출 함수
const fetchProductionProcess = async () => {
    try {
        const response = await axios.get('/api/production/productionResultRegist');
        items.value = response.data.list.map((item) => ({
            wo_no: item.wo_no,
            startDate: item.startDate,
            endDate: item.endDate,
            use_order: item.use_order,
            process: item.process_id,
            process_name: item.process_name,
            line_id: item.line_id,
            product_id: item.product_id,
            product_name: item.product_name,
            specification: item.specification,
            unit: item.unit,
            useOrder: item.use_order,
            equipment_id: item.equipment_id,
            prd_noworder_qty: item.prd_noworder_qty,
            in_qty: item.in_qty ? item.in_qty : 0,
            def_qty: item.def_qty ? item.def_qty : 0,
            qty: item.qty ? item.qty : 0,
            status: item.status
        }));
        console.log(response);
    } catch (error) {
        // console.log(items.value);
        console.error('실패:', error);
    }
};

onMounted(async () => {
    await fetchProductionOrderList();
    await fetchProductionProcess();
});
// const performanceNumberInsert = () => {
//     performanceNumber.value = generateCode();
// };
const registStartPerformance = async () => {
    if (status.value == '완료' || status.value == '진행') {
        alert('이미 실적이 등록되었거나 공정진행중입니다');
        return;
    } else {
        // console.log(now);
        // const year = now.getFullYear();
        // const month = (now.getMonth() + 1).toString().padStart(2, '0');
        // const day = now.getDate().toString().padStart(2, '0');
        // const hour = now.getHours();
        // const minute = now.getMinutes();
        // console.log(hour, minute);
        // const dateString = `${year}-${month}-${day} ${hour}:${minute}`;
        // step 1. 작업시작 일시가 먼저 디스플레이에 기입
        performanceInsStartDate.value = new Date();
        const newCode = generateCode();
        try {
            const payload = {
                wo_no: wo_no.value,
                pf_code: newCode,
                e_name: worker.value,
                process_id: process.value,
                in_qty: inQuantity.value,
                line_id: lineId.value,
                product_id: productId.value,
                prd_name: productName.value,
                specification: specification.value,
                unit: unit.value,
                eq_code: equipmentCode.value,
                w_st_date: performanceInsStartDate.value
            };
            // step 2. 투입량을 수정
            const result = await axios.post('/api/production/insertPerform', payload);
            if (result) {
                alert('실적이 정상적으로 등록되었습니다.');
                resetData();
                fetchProductionProcess();
            } else {
                console.log('실적이 정상적으로 등록되지못했습니다.', result.data);
            }
        } catch (error) {
            console.error('실패:', error);
        }
    }
};
const registEndPerformance = async () => {
    if (status.value == '완료' || status.value == '대기') {
        alert('이미 실적이 등록되었거나 작업대기중입니다');
        return;
    }else{
        performanceInsEndDate.value = new Date();
        console.log('def_qty:', def_qty.value);
        
        const setData ={
            wo_no: wo_no.value,
            qty: in_qty.value - def_qty.value, // 투입량에서 불량량을 제외한 생산량
            status:3,
            w_ed_date: performanceInsEndDate.value
        };
      const result =  await axios.put('/api/production/updatePerform',setData);
            if (result) {
                alert('작업이 종료되었습니다.');
                resetData();
                fetchProductionProcess();
            } else {
                console.error('작업 종료 실패:', response.data.message);
            }
        
           
    }
};
const resetData = () => {
    process.value = '';
    process_name.value = '';
    startDate.value = '';
    endDate.value = '';
    inQuantity.value = 0;
    lineId.value = '';
    productName.value = '';
    productId.value = '';
    specification.value = '';
    unit.value = '';
    wo_no.value = '';
    equipmentCode.value = '';
    equipmentName.value = '';
    productionQuantity.value = 0;
    status.value = '';
    performanceInsStartDate.value = '';
    performanceInsEndDate.value = '';
};
</script>
<template>
    <div class="col-span-1 flex items-center gap-2">
        <div class="w-full flex justify-end gap-2">
            <!-- <Button label=" 실적등록 " rounded @click="performanceInsert" /> -->
            <Button label=" 작업시작 " rounded @click="registStartPerformance" />
            <Button label=" 작업종료 " rounded @click="registEndPerformance" />
            <Button label=" 지시목록 " rounded @click="openModal('orderList')" />
            <Button label=" 초기화 " severity="info" rounded @click="resetData" />
        </div>
    </div>
    <div class="h-[calc(100vh - 100px)] overflow-hidden flex flex-col p-4">
        <div class="flex-shrink-0 bg-white p-4 rounded-lg shadow-md mb-2">
            <div class="grid grid-cols-4 gap-4 items-center">
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">작업자</label>
                    <InputText class="flex-1" v-model="worker" />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">공정코드</label>
                    <InputText class="flex-1" v-model="process" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">공정명</label>
                    <InputText class="flex-1" v-model="process_name" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">라인</label>
                    <InputText class="flex-1" v-model="lineId" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">제품코드</label>
                    <InputText class="flex-1" v-model="productId" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">제품명</label>
                    <InputText class="flex-1" v-model="productName" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">규격</label>
                    <InputText class="flex-1" v-model="specification" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">단위</label>
                    <InputText class="flex-1" v-model="unit" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">설비코드</label>
                    <InputText class="flex-1" v-model="equipmentCode" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">투입량</label>
                    <InputNumber class="flex-1" v-model="inQuantity" />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">진행상태</label>
                    <InputText class="flex-1" v-model="status" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">작업코드</label>
                    <InputText class="flex-1" v-model="wo_no" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">시작 일시</label>
                    <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="performanceInsStartDate" />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">종료 일시</label>
                    <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="performanceInsEndDate" />
                </div>
            </div>
        </div>

        <div class="flex-grow overflow-y-auto">
            <DataTable :value="items" :paginator="true" :rows="10" :selection="selectedRow" selectionMode="single" scrollable scrollHeight="400px" editMode="cell" @cell-edit-complete="onCellEditComplete" @row-select="onRowSelect">
                <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                    <template #body="{ data, field }" v-if="col.field === 'startDate' || col.field === 'endDate'">
                        {{ formatDate(data[field]) }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <Dialog v-model:visible="showModal" modal header="생산지시 리스트" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold mb-4 text-lg">
            🔍
            {{
                {
                    orderList: '지시목록'
                }[modalType]
            }}
        </p>

        <div v-if="modalType === 'orderList'">
            <DataTable :value="productionOrderList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
                <Column field="wo_no" header="생산지시코드">
                    <template #body="{ data }">
                        <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                            {{ data.wo_no }}
                        </span>
                    </template>
                </Column>
                <Column field="ord_no" header="작업지시번호"></Column>
                <Column field="line_id" header="라인코드"></Column>
                <Column field="product_name" header="제품명"></Column>
                <Column field="specification" header="규격"></Column>
                <Column field="unit" header="단위"></Column>
                <Column field="prd_noworder_qty" header="현지시수량"></Column>
            </DataTable>
        </div>
    </Dialog>
</template>
