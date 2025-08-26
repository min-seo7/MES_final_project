<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import IconField from 'primevue/iconfield';
import { useLayout } from '@/layout/composables/layout';
const { getPrimary, getSurface, isDarkTheme } = useLayout();
import axios from 'axios';
import Button from 'primevue/button';
import InputIcon from 'primevue/inputicon';

// 검색 조건 상태 관리
const search = ref({
    processName: '',
    lineId: '',
    processCode: '',
    productionEndDate: null,
    lastname: '',
    productType: null,
    productForm: null
});

// 모달 상태 관리
const showModal = ref(false);
const modalType = ref('');

const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;
    if (type === 'temporaryProcess') {
        startInterval(); // 모달 열릴 때 시작
    }
};

const closeModal = () => {
    showModal.value = false;
    stopInterval(); // 모달 닫을 때 정리
};

const selectModalValue = (value) => {
    if (modalType.value === 'processCode') {
        //search.value.processCode = value.processName.slice(0, 3);
        search.value.processCode = value.processId;
        search.value.lineId = value.lineId;
    }

    showModal.value = false;
};
let processList = ref([]);
// const productType = ref(null);
// const productForm = ref(null);
const lineData = ref(null);
const lineOptions = ref(null);
let intervalId = null;

// 55 ~ 60 사이의 랜덤 정수를 생성하는 함수
// function getRandomTemperature() {
//     // Math.random()은 0 이상 1 미만의 값을 반환합니다.
//     // (max - min + 1)을 곱하여 범위 조절
//     // Math.floor()로 소수점을 버리고 정수만 남김
//     return Math.floor(Math.random() * (63 - 55 + 1)) + 55;
// }
// 랜덤 온도 생성 (60℃ ±2)
function getRandomTemperature() {
    const min = 65;
    const max = 69;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    lineData.value = {
        labels: [],
        datasets: [
            {
                label: '발효기',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                data: [],
                fill: false,
                tension: 0.3,
                pointHoverRadius: 7,
                pointBackgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                pointBorderColor: '#fff'
            }
        ]
    };
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            },
            datalabels: {
                color: textColorSecondary,
                display: true,
                align: 'top',
                formatter: (value) => {
                    return value + '℃';
                }
            }
        },
        scales: {
            x: {
                ticks: { color: textColorSecondary },
                grid: { color: surfaceBorder, drawBorder: false },
                title: { display: true, text: '시간', color: textColor }
            },
            y: {
                ticks: { color: textColorSecondary },
                grid: { color: surfaceBorder, drawBorder: false },
                title: { display: true, text: '온도 (℃)', color: textColor },
                min: 55,
                max: 75
            }
        },
        responsive: true,
        animation: false,
        maintainAspectRatio: false
    };
}
// 새로운 랜덤 온도 데이터를 추가하는 함수
function addRandomTemperature() {
    if (!lineData.value) return;
    const now = new Date().toLocaleTimeString();
    const newTemp = getRandomTemperature();

    const labels = [...lineData.value.labels];
    const data = [...lineData.value.datasets[0].data];

    if (labels.length > 20) {
        labels.shift();
        data.shift();
    }

    labels.push(now);
    data.push(newTemp);

    lineData.value = {
        ...lineData.value,
        labels,
        datasets: [{ ...lineData.value.datasets[0], data }]
    };
}
// 인터벌 제어
function startInterval() {
    if (intervalId) return;
    intervalId = setInterval(addRandomTemperature, 3000);
}

function stopInterval() {
    clearInterval(intervalId);
    intervalId = null;
}

const columns = ref([
    { field: 'processId', header: '공정코드' },
    { field: 'processName', header: '공정' },
    { field: 'productId', header: '제품코드' },
    { field: 'productName', header: '제품명' },
    { field: 'specification', header: '규격' },
    { field: 'unit', header: '단위' },
    { field: 'productType', header: '제품유형' },
    { field: 'productForm', header: '제품구분' },
    { field: 'equipmentCode', header: '설비코드' },
    { field: 'equipmentName', header: '설비명' },
    { field: 'productionEndDate', header: '작업종료일' },
    { field: 'qty', header: '생산량' },
    { field: 'line', header: '라인' },
    { field: 'lastname', header: '작업자' }
]);
const selectProcessList = ref([]);

// const formatCurrency = (value) => {
//     return value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
// };
const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    //return date.toLocaleString('ko-KR').slice(0, 11); // 또는 원하는 형식으로 포맷
    return date.toLocaleString('ko-KR');
};
const formatDateOrigin = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};
// const formatDateDB = (date) => {
//     if (!date) return null;
//     // 'ko-KR' 로케일을 사용하면 한국 표준시를 기준으로 날짜를 포맷합니다.
//     const formatter = new Intl.DateTimeFormat('ko-KR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         timeZone: 'Asia/Seoul'
//     });
//     const parts = formatter.formatToParts(date);
//     const year = parts.find((part) => part.type === 'year').value;
//     const month = parts.find((part) => part.type === 'month').value;
//     const day = parts.find((part) => part.type === 'day').value;
//     return `${year}-${month}-${day}`;
// };
const dropContent = async () => {
    Object.assign(search.value, {
        productionEndDate: null,
        processCode: '',
        lineId: '',
        lastname: '',
        productType: null,
        productForm: null
    });
    await processSelectList();
};
const selectPrcList = async () => {
    try {
        const response = await axios.get('/api/production/selectProcessList');
        console.log(response.data.list);
        const list = response.data.list;
        if (Array.isArray(list)) {
            // map() 함수를 사용하여 각 항목을 변환
            processList.value = list.map((item) => ({
                processId: item.process_id,
                processName: item.process_name,
                order: item.use_order,
                lineId: item.line_id,
                lineName: item.line_name
            }));
        } else {
            console.error('API 응답이 예상한 배열 형태가 아닙니다.', list);
            processList.value = [];
        }
        console.log('가져온 데이터:', processList);
    } catch (error) {
        console.error('공정 목록 조회 실패:', error);
    }
};
const processSelectList = async () => {
    try {
        const result = await axios.get('/api/production/processesNotSearchList');
        console.log(result.data.list);
        const list = result.data.list;
        if (Array.isArray(list) == false) {
            selectProcessList.value = [];
            return;
        } else {
            selectProcessList.value = list.map((item) => ({
                processId: item.process_id,
                processName: item.process_name,
                productId: item.product_id,
                productName: item.product_name,
                productType: item.product_type,
                productForm: item.product_form,
                specification: item.specification,
                unit: item.unit,
                equipmentCode: item.equipment_id,
                equipmentName: item.equipment_name,
                productionEndDate: formatDateOrigin(item.endDate),
                qty: item.qty,
                line: item.line_id,
                lastname: item.lastname
            }));
        }
    } catch (error) {
        console.error('공정 조회 실패:', error);
    }
};
const filterPerformance = async () => {
    try {
        const selectedDate = search.value.productionEndDate;
        let startDateString = null;
        let nextDayString = null;
        console.log('선택된 날짜:', selectedDate);
        if (selectedDate) {
            // 올바른 YYYY-MM-DD 문자열을 수동으로 만듭니다.
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');

            startDateString = `${year}-${month}-${day}`;

            // 다음 날짜를 계산해서 YYYY-MM-DD 문자열을 만듭니다.
            const nextDayDate = new Date(selectedDate);
            nextDayDate.setDate(selectedDate.getDate() + 1);

            const nextYear = nextDayDate.getFullYear();
            const nextMonth = String(nextDayDate.getMonth() + 1).padStart(2, '0');
            const nextDay = String(nextDayDate.getDate()).padStart(2, '0');

            nextDayString = `${nextYear}-${nextMonth}-${nextDay}`;
        }

        const payload = {
            w_ed_date: startDateString ? startDateString : null,
            //w_ed_date: search.value.productionEndDate ? search.value.productionEndDate.toLocaleString('KO-KR') : null,
            nextDay: nextDayString ? nextDayString : null,
            process_id: search.value.processCode || null,
            line_id: search.value.lineId || null,
            e_name: search.value.lastname || null,
            product_type: search.value.productType || null,
            product_form: search.value.productForm || null
        };
        console.log('전달될 파라미터:', payload);

        const res = await axios.post('/api/production/filterPerformance', payload);
        console.log(res.data.list);
        if (!Array.isArray(res.data.list)) {
            selectProcessList.value = [];
            return;
        } else {
            selectProcessList.value = res.data.list.map((item) => ({
                processId: item.process_id,
                processName: item.process_name,
                productId: item.product_id,
                productName: item.product_name,
                productType: item.product_type,
                productForm: item.product_form,
                specification: item.specification,
                unit: item.unit,
                equipmentCode: item.equipment_id,
                equipmentName: item.equipment_name,
                productionEndDate: item.endDate,
                qty: item.qty,
                line: item.line_id,
                lastname: item.lastname
            }));
        }
        console.log('필터링된 데이터:', selectProcessList.value);
    } catch (err) {
        console.log('조회 필터 실패');
    }
};

onMounted(async () => {
    await setColorOptions();
    //intervalId = await setInterval( addRandomTemperature, 5000); // 1초마다 새로운 온도 데이터를 추가합니다.

    // 컴포넌트가 언마운트될 때 메모리 누수를 방지하기 위해 인터벌을 정리합니다.

    await selectPrcList();
    await processSelectList();
});
onUnmounted(async () => {
    stopInterval();
});
watch(
    [getPrimary, getSurface, isDarkTheme],
    () => {
        setColorOptions();
    },
    { immediate: true }
);
</script>
<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 조회 " class="text-xs px-2 py-1 h-[28px]" rounded @click="filterPerformance" />
        <Button label=" 설비상태 " class="text-xs px-2 py-1 h-[28px]" rounded @click="openModal('temporaryProcess')" severity="warn" />
        <Button label=" 초기화 " class="text-xs px-2 py-1 h-[28px]" rounded severity="info" @click="dropContent" />
    </div>
    <div class="font-semibold text-xl mb-2">실적조회</div>
    <div class="h-[calc(100vh - 100px)] overflow-hidden flex flex-col p-4">
        <div class="flex-shrink-0 bg-white p-4 rounded-lg shadow-md mb-2">
            <!-- grid-cols-3으로 세 개의 균일한 열을 만듭니다. -->
            <div class="grid grid-cols-3 gap-2 items-center">
                <!-- 첫 번째 행 -->
                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">작업종료일</label>
                    <DatePicker class="w-64" v-model="search.productionEndDate" dateFormat="yy-mm-dd" showIcon fluid iconDisplay="input" />
                </div>

                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">공정</label>
                    <IconField iconPosition="left">
                        <InputText class="w-64" ref="inputValue" v-model="search.processCode" id="processCode" />
                        <InputIcon class="pi pi-search" @click="openModal('processCode')" />
                    </IconField>
                </div>
                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">라인</label>
                    <InputText class="w-64" ref="inputValue" v-model="search.lineId" id="lineId" />
                </div>

                <!-- 두 번째 행 -->
                <!-- col-start-1을 사용하여 첫 번째 열부터 시작하도록 합니다. -->
                <div class="flex items-center gap-2 col-start-1">
                    <label class="w-24 text-right">작업자</label>
                    <InputText class="w-64" ref="inputValue" v-model="search.lastname" id="lastname" />
                </div>
                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">제품유형</label>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="search.productForm" inputId="powder" name="product_form" value="분말형" />
                        <label for="powder">분말형</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="search.productForm" inputId="granule" name="product_form" value="과립형" />
                        <label for="granule">과립형</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="search.productForm" inputId="liquid" name="product_form" value="액상형" />
                        <label for="liquid">액상형</label>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">제품형태</label>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="search.productType" inputId="fin" name="product_type" value="완제품" />
                        <label for="fin">완제품</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="search.productType" inputId="halfFin" name="product_type" value="반제품" />
                        <label for="halfFin">반제품</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md mb-2">
            <DataTable
                :value="selectProcessList"
                :paginator="true"
                :rows="9"
                scrollable
                scrollHeight="400px"
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
                <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                    <template #body="{ data, field }">
                        <span v-if="field === 'productionEndDate'">
                            {{ formatDate(data[field]) }}
                        </span>
                        <span v-else>{{ data[field] }}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>

    <!-- <div class="flex-auto card mt-2"></div> -->

    <Dialog v-model:visible="showModal" modal header="공정리스트" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold mb-4 text-lg">
            🔍
            {{
                {
                    processCode: '공정코드',
                    temporaryProcess: '공정생산량대비설비온도'
                }[modalType]
            }}
        </p>
        <div v-if="modalType === 'processCode'">
            <DataTable :value="processList" :paginator="true" :rows="5" scrollable scrollHeight="400px" tableStyle="min-width: 20rem" class="mb-3">
                <Column field="processCode" header="공정코드">
                    <template #body="{ data }">
                        <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                            {{ data.processId }}
                        </span>
                    </template>
                </Column>
                <Column field="processName" header="공정명"></Column>
                <Column field="order" header="공정순서"></Column>
                <Column field="lineId" header="라인코드"></Column>
                <Column field="lineName" header="라인명"></Column>
            </DataTable>
        </div>
        <div v-else-if="modalType === 'temporaryProcess'">
            <div class="card">
                <Chart type="line" :data="lineData" :options="lineOptions" class="h-80" />
            </div>
        </div>
    </Dialog>
</template>
