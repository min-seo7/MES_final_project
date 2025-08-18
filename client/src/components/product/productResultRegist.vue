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
}
const productionOrderList= ref([]);
const loading = ref(true); // 로딩 상태를 관리하는 변수
const columns = ref([
    { field: 'use_order', header: '공정순서' },
    { field: 'process', header: '공정' },
    { field: 'line_id', header: '라인코드' },
    { field: 'equipment_id', header: '설비코드' },
    { field: 'prd_noworder_qty', header: '현지시수량' },
    { field: 'in_qty', header: '투입량' },
    { field: 'def_qty', header: '불량량' },
    { field: 'qty', header: '생산량' },
    { field: 'status', header: '상태' }
]);
const products = ref([
    {
        process: '분말형',
        line: 'A01',
        planQuantity: 10000,
        productionQuantity: 1000,
        productId: 'P001',
        productName: '분말형비료',
        specification: '20',
        unit: 'kg',
        prd_form: '완제품',
        equipmentCode: 'EQ-COMB-01',
        equipmentName: '배합기#1',
        startDate: '2025-08-10 09:00',
        endDate: '2025-08-12 17:30',
        status: '완료'
    },
    {
        process: '분말형',
        line: 'A01',
        planQuantity: 10000,
        productionQuantity: 1000,
        productId: 'P001',
        productName: '분말형비료',
        specification: '20',
        unit: 'kg',
        prd_form: '완제품',
        equipmentCode: 'EQ-FERM-01',
        equipmentName: '발효기#1',
        startDate: '2025-08-10 09:00',
        endDate: '2025-08-12 17:30',
        status: '진행'
    }
    // ... 이미지에 표시된 다른 행 데이터들
]);
const items = ref([]);
const selectedRow = ref(null);
const onRowSelect = (event) => {
    const selectedData = event.data;
    if (selectedData.status == '진행') {
        alert('공정이 진행중입니다.\n실적을 등록합니다.');
        //return;
    }
    process.value = selectedData.process;
    startDate.value = selectedData.startDate;
    endDate.value = selectedData.endDate;
    planQuantity.value = selectedData.planQuantity;
    line.value = selectedData.line;
    productName.value = selectedData.productName;
    equipmentCode.value = selectedData.equipmentCode;
    equipmentName.value = selectedData.equipmentName;
    productionQuantity.value = selectedData.productionQuantity;
    status.value = selectedData.status;
    console.log('선택된 항목:', selectedData);
};
const onCellEditComplete = (event) => {
    // 셀 수정 완료 시 처리 로직을 여기에 구현
    console.log('셀 수정 완료:', event);
};
const worker = ref(''); // 초기값
const process = ref('');
const startDate = ref('');
const endDate = ref('');
const planQuantity = ref(0);
const line = ref('');
const productName = ref('');
const performanceNumber = ref(''); // 실적번호
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
            use_order: item.use_order,
            process: item.process_id,
            line_id: item.line_id,
            product_id: item.product_id,
            product_name: item.product_name,
            specification: item.specification,
            unit: item.unit,
            useOrder: item.use_order,
            equipment_id: item.equipment_id,
            prd_noworder_qty: item.prd_noworder_qty,
            in_qty: 0,
            def_qty: 0,
            qty: 0,
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

const performanceInsert = () => {
    // const performanceInsertDate = new Date();
    // console.log(performanceInsertDate);
    const payload = {
        performanceNumber: performanceNumber.value,
        worker: worker.value,
        process: process.value,
        planQuantity: planQuantity.value,
        line: line.value,
        productName: productName.value,
        equipmentCode: equipmentCode.value,
        productionQuantity: productionQuantity.value
        ,performanceInsStartDate: performanceInsStartDate.value
        ,performanceInsEndDate: performanceInsEndDate.value
    };
    console.log(payload);
    // if (!payload.performanceNumber) {
    //     alert('실적 번호를 먼저 부여해주세요.');
    //     return;
    // }
    axios.post('/api/insertperform', payload).then((response) => {
        console.log('실적 등록 성공:', response.data);
        alert('실적이 성공적으로 등록되었습니다.');
        resetData();
    });
};
const performanceNumberInsert = () => {
    performanceNumber.value = generateCode();
};
const registStartPerformance = () => {
    // console.log(now);
    // const year = now.getFullYear();
    // const month = (now.getMonth() + 1).toString().padStart(2, '0');
    // const day = now.getDate().toString().padStart(2, '0');
    // const hour = now.getHours();
    // const minute = now.getMinutes();
    // console.log(hour, minute);
    // const dateString = `${year}-${month}-${day} ${hour}:${minute}`;
    performanceInsStartDate.value = new Date();
};
const registEndPerformance = () => {
    performanceInsEndDate.value = new Date();
};
const resetData = () => {
    process.value = '';
    startDate.value = '';
    endDate.value = '';
    planQuantity.value = 0;
    line.value = '';
    productName.value = '';
    equipmentCode.value = '';
    equipmentName.value = '';
    productionQuantity.value = 0;
    performanceNumber.value = '';
    status.value = '';
    performanceInsStartDate.value = '';
    performanceInsEndDate.value = '';
};
</script>
<template>
    <div class="col-span-1 flex items-center gap-2">
        <div class="w-full flex justify-end gap-2">
            <Button label=" 실적등록 " rounded @click="performanceInsert" />
            <Button label=" 실적번호부여 " rounded @click="performanceNumberInsert" />
            <Button label=" 실적시작 " rounded @click="registStartPerformance" />
            <Button label=" 실적종료 " rounded @click="registEndPerformance" />
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
                    <label class="w-24 text-right">공정</label>
                    <InputText class="flex-1" v-model="process" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">라인</label>
                    <InputText class="flex-1" v-model="line" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">제품명</label>
                    <InputText class="flex-1" v-model="productName" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">실적번호</label>
                    <InputText class="flex-1" placeholder="번호자동부여" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">설비 코드</label>
                    <InputText class="flex-1" v-model="equipmentCode" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">생산 수량</label>
                    <InputNumber class="flex-1" v-model="productionQuantity" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">공정 상태</label>
                    <InputText class="flex-1" v-model="status" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">실적 시작 일시</label>
                    <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="performanceInsStartDate" />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">실적 종료 일시</label>
                    <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="performanceInsEndDate" />
                </div>
            </div>
        </div>

        <div class="flex-grow overflow-y-auto">
            <DataTable :value="items" :paginator="true" :rows="4" :selection="selectedRow" selectionMode="single" scrollable scrollHeight="400px" editMode="cell" @cell-edit-complete="onCellEditComplete" @row-select="onRowSelect">
               <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                <template #body="{ data }" v-if="col.field === 'startDate' || col.field === 'endDate'">
                    {{ formatDate(data[col.field]) }}
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
