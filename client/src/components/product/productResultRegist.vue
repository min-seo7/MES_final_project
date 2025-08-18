<script setup>
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';

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
const worker = ref('박형식'); // 초기값
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

// API 호출 함수
const fetchProductionProcess = async () => {
    try {
        const response = await axios.get('/api/production/productionResultRegist');
        items.value = response.data.list.map((item) => ({
            process: item.process_id,
            line: item.line_id,
            productId: item.product_id,
            productName: item.product_name,
            specification: item.specification,
            unit: item.unit,
            useOrder: item.use_order,
            equipmentCode: item.equipment_id,
            productionQuantity: item.prd_noworder_qty,
            inQty: 0,
            defQty: 0,
            qty: 0,
            status: item.status
        }));
        console.log(response);
    } catch (error) {
        // console.log(items.value);
        console.error('실패:', error);
    }
};

onMounted(() => {
    fetchProductionProcess();
});

const performanceInsert = () => {
    // const performanceInsertDate = new Date();
    // console.log(performanceInsertDate);
    const payload = {
        // performanceNumber: performanceNumber.value,
        worker: worker.value,
        process: process.value,
        startDate: startDate.value,
        endDate: endDate.value,
        planQuantity: planQuantity.value,
        line: line.value,
        productName: productName.value,
        equipmentCode: equipmentCode.value,
        equipmentName: equipmentName.value,
        productionQuantity: productionQuantity.value
        // ,performanceInsStartDate: performanceInsStartDate.value
        // ,performanceInsEndDate: performanceInsEndDate.value
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
// const performanceNumberInsert = () => {
//     performanceNumber.value = generateCode();
// };
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
};
</script>
<template>
    <div class="col-span-1 flex items-center gap-2">
        <div class="w-full flex justify-end gap-2">
            <Button label=" 실적등록 " rounded @click="performanceInsert" />
            <!-- <Button label=" 실적번호부여 " rounded @click="performanceNumberInsert" /> -->
            <!-- <Button label=" 실적시작 " rounded @click="registStartPerformance" /> -->
            <!-- <Button label=" 실적종료 " rounded @click="registEndPerformance" /> -->
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
                    <label class="w-24 text-right">작업시작일시</label>
                    <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="startDate" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">작업종료일시</label>
                    <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="endDate" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">공정</label>
                    <InputText class="flex-1" v-model="process" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">계획수량</label>
                    <InputNumber class="flex-1" v-model="planQuantity" disabled />
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
                    <label class="w-24 text-right">설비명</label>
                    <InputText class="flex-1" v-model="equipmentName" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">생산 수량</label>
                    <InputNumber class="flex-1" v-model="productionQuantity" disabled />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">공정 상태</label>
                    <InputText class="flex-1" v-model="status" disabled />
                </div>
                <!-- <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">실적 시작 일시</label>
                    <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="performanceInsStartDate" />
                </div>
                <div class="col-span-1 flex items-center gap-2">
                    <label class="w-24 text-right">실적 종료 일시</label>
                    <DatePicker class="flex-1" dateFormat="yy-mm-dd" showTime hourFormat="24" v-model="performanceInsEndDate" />
                </div> -->
            </div>
        </div>

        <div class="flex-grow overflow-y-auto">
            <DataTable :value="items" :paginator="true" :rows="4" :selection="selectedRow" selectionMode="single" scrollable scrollHeight="400px" editMode="cell" @cell-edit-complete="onCellEditComplete" @row-select="onRowSelect">
                <Column field="process" header="공정"></Column>
                <Column field="line" header="라인"></Column>
                <Column field="productionQuantity" header="생산수량"></Column>
                <Column field="productId" header="제품코드"></Column>
                <Column field="productName" header="제품명"></Column>
                <Column field="specification" header="규격"></Column>
                <Column field="unit" header="단위"></Column>
                <Column field="prd_form" header="제품구분"></Column>
                <Column field="equipmentCode" header="설비코드"></Column>
                <Column field="equipmentName" header="설비명"></Column>
                <Column field="startDate" header="작업시작일시"
                    ><template #body="{ data }">
                        {{ formatDate(data.startDate) }}
                    </template></Column
                >
                <Column field="endDate" header="작업종료일시"
                    ><template #body="{ data }">
                        {{ formatDate(data.endDate) }}
                    </template></Column
                >
                <Column field="status" header="상태"></Column>
            </DataTable>
        </div>
    </div>
</template>
