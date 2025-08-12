<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import IconField from 'primevue/iconfield';
const search = ref({
    processName: '',
    line: '',
    processCode: '',
    productionEndDate: null
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
    if (modalType.value === 'processCode') {
        search.value.processCode = value.processName.slice(0, 3);
        search.value.line = value.line;
    }

    showModal.value = false;
};
const processList = ref([
    { processCode: 'powder', processName: '분말형생산공정', line: 'A01' }, //
    { processCode: 'granule', processName: '과립형생산공정', line: 'B01' }, //
    { processCode: 'liquid', processName: '액상형생산공정', line: 'C01' } //
]);
const productType = ref(null);
const productForm = ref(null);

// const currentPage = ref(1);
// const pageSize = 5;
// eslint-disable-next-line no-undef
// const totalPages = computed(() => Math.ceil(productPlanCodeList.value.length / pageSize));

// // eslint-disable-next-line no-undef
// const pagedProductPlanCodes = computed(() => {
//     const start = (currentPage.value - 1) * pageSize;

//     return productPlanCodeList.value.slice(start, start + pageSize);
// });
const columns = ref([
    { field: 'processName', header: '공정' },
    { field: 'productType', header: '제품유형' },
    { field: 'equipmentCode', header: '설비코드' },
    { field: 'equipmentName', header: '설비명' },
    { field: 'productionEndDate', header: '작업종료일' },
    { field: 'productForm', header: '제품구분' },
    { field: 'qty', header: '생산량' },
    { field: 'line', header: '라인' },
    { field: 'lastname', header: '작업자' },
    { field: 'isInsertWork', header: '실적등록여부' }
]);
const selectProcessList = ref([
    {
        id: 1,
        processName: '배합',
        productType: '과립형',
        equipmentCode: 'EQ-COMB-04',
        equipmentName: '배합기#4',
        productionEndDate: '2025-08-12',
        productForm: '완제품',
        qty: 1000,
        line: 'B01',
        lastname: '강철중',
        isInsertWork: 'Y'
    },
    {
        id: 2,
        processName: '발효',
        productType: '과립형',
        equipmentCode: 'EQ-FERM-04',
        equipmentName: '발효기#4',
        productionEndDate: '2025-08-12',
        productForm: '완제품',
        qty: 1000,
        line: 'B01',
        lastname: '박창범',
        isInsertWork: 'Y'
    },
    {
        id: 3,
        processName: '건조',
        productType: '과립형',
        equipmentCode: 'EQ-DRY-04',
        equipmentName: '건조기#1',
        productionEndDate: '2025-08-12',
        productForm: '완제품',
        qty: 1000,
        line: 'B01',
        lastname: '김기린',
        isInsertWork: 'Y'
    },
    {
        id: 4,
        processName: '분쇄',
        productType: '과립형',
        equipmentCode: 'EQ-GRIN-04',
        equipmentName: '분쇄기#1',
        productionEndDate: '2025-08-12',
        productForm: '완제품',
        qty: 1000,
        line: 'B01',
        lastname: '이명준',
        isInsertWork: 'Y'
    },
    {
        id: 5,
        processName: '성형',
        productType: '과립형',
        equipmentCode: 'EQ-MOLD-04',
        equipmentName: '성형기#1',
        productionEndDate: '2025-08-12',
        productForm: '완제품',
        qty: 1000,
        line: 'B01',
        lastname: '최지원',
        isInsertWork: 'Y'
    }
]);

// const formatCurrency = (value) => {
//     return value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
// };
const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleString('ko-KR').slice(0, 11); // 또는 원하는 형식으로 포맷
};
const dropContent = () => {
    Object.assign(search.value, {
        productionEndDate: '',
        processCode: '',
        line: ''
    });
};
</script>
<template>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 조회 " rounded @click="selectList" />
        <Button label=" 초기화 " severity="info" rounded @click="dropContent" />
    </div>
    <div class="font-semibold text-xl mb-2">공정조회</div>
    <div class="p-4 min-h-screen">
        <div class="bg-white p-4 rounded-lg shadow-md mb-2">
            <!-- grid-cols-3으로 세 개의 균일한 열을 만듭니다. -->
            <div class="grid grid-cols-3 gap-2 items-center">
                <!-- 첫 번째 행 -->
                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">작업종료일</label>
                    <DatePicker class="w-64" v-model="productionEndDate" dateFormat="yy-mm-dd" showIcon fluid iconDisplay="input" />
                </div>
                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">제품유형</label>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="productType" inputId="powder" name="productType" value="powder" />
                        <label for="powder">분말형</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="productType" inputId="granule" name="productType" value="granule" />
                        <label for="granule">과립형</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="productType" inputId="liquid" name="productType" value="liquid" />
                        <label for="liquid">액상형</label>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">제품형태</label>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="productForm" inputId="fin" name="productForm" value="fin" />
                        <label for="fin">완제품</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="productForm" inputId="halfFin" name="productForm" value="halfFin" />
                        <label for="halfFin">반제품</label>
                    </div>
                </div>

                <!-- 두 번째 행 -->
                <!-- col-start-1을 사용하여 첫 번째 열부터 시작하도록 합니다. -->
                <div class="flex items-center gap-2 col-start-1">
                    <label class="w-24 text-right">공정</label>
                    <IconField iconPosition="left">
                        <InputText class="w-64" ref="inputValue" v-model="search.processCode" id="processCode" />
                        <InputIcon class="pi pi-search" @click="openModal('processCode')" />
                    </IconField>
                </div>
                <div class="flex items-center gap-2">
                    <label class="w-24 text-right">라인</label>
                    <InputText class="w-64" ref="inputValue" v-model="search.line" id="line" />
                </div>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md mb-2">
            <DataTable
                :value="selectProcessList"
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

    <div class="flex-auto card mt-2"></div>

    <Dialog v-model:visible="showModal" modal header="공정리스트" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold mb-4 text-lg">
            🔍
            {{
                {
                    processCode: '공정코드',
                    processName: '공정명',
                    line: '라인'
                }[modalType]
            }}
        </p>
        <div v-if="modalType === 'processCode'">
            <DataTable :value="processList" tableStyle="min-width: 20rem" class="mb-3">
                <Column field="processCode" header="공정코드">
                    <template #body="{ data }">
                        <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                            {{ data.processCode }}
                        </span>
                    </template>
                </Column>
                <Column field="processName" header="공정명"></Column>
                <Column field="line" header="라인"></Column>
            </DataTable>
        </div>
    </Dialog>
</template>
