<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import RadioButton from 'primevue/radiobutton';

const items = ref([]);

// 조회 필터용 객체 (검사항목(inspItem) 제거)
const search = ref({
    productType: '',
    inspPurpose: ''
});

// 데이터 테이블 및 등록용 객체
const selectItem = ref({
    testitem_code: null,
    productType: '',
    inspItem: '',
    unit: '',
    range: '',
    writer: '',
    writeAt: '',
    inspPurpose: '',
    purposeid: ''
});

const showModal = ref(false);
const modalType = ref('');
const targetObject = ref(null);

const openModal = (type, target) => {
    modalType.value = type;
    targetObject.value = target;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const selectModalValue = (value) => {
    if (targetObject.value) {
        if (modalType.value === 'inspItem') {
            targetObject.value.inspItem = value.Type;
        }
    }
    showModal.value = false;
};

const productCodeList = ref([
    { code: 'pd-gran', Type: '과립형 비료' },
    { code: 'pd-liq', Type: '액상형 비료' },
    { code: 'pd-pow', Type: '분말형 비료' }
]);

const inspTypeList = ref([{ code: '201', Type: '샘플링검사' }]);

const inspItemList = ref([
    { code: 'item-001', Type: '수분함량' },
    { code: 'item-002', Type: 'pH' },
    { code: 'item-003', Type: '총질소' }
]);

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const columns = ref([
    { field: 'testitem_code', header: '항목코드' },
    { field: 'productType', header: '제품유형' },
    { field: 'inspItem', header: '검사항목' },
    { field: 'unit', header: '단위' },
    { field: 'range', header: '허용범위' },
    { field: 'writer', header: '작성자' },
    { field: 'writeAt', header: '작성날짜' },
    { field: 'inspPurpose', header: '검사목적' },
    { field: 'purposeid', header: '검사목적코드' }
]);

const fetchtestitems = async () => {
    try {
        console.log('현재 검색 상태:', search.value);
        const params = new URLSearchParams();
        if (search.value.productType) params.append('productType', search.value.productType);
        if (search.value.inspPurpose) params.append('inspPurpose', search.value.inspPurpose);

        const url = `/api/test/testInform?${params.toString()}`;
        console.log('API 요청 URL:', url);

        const response = await axios.get(url);

        if (Array.isArray(response.data)) {
            items.value = response.data.map((item) => ({
                testitem_code: item.testitem_code,
                productType: item.product_type,
                inspItem: item.item_name,
                unit: item.unit,
                range: item.fixedStandard,
                writer: item.createdBy,
                writeAt: item.createdAt,
                inspPurpose: item.purpose_name,
                purposeid: item.purpose_id
            }));
        } else {
            // 데이터가 배열이 아니면 items를 빈 배열로 초기화하여 오류 방지
            items.value = [];
            console.error('서버 응답 데이터가 배열이 아닙니다:', response.data);
        }
    } catch (error) {
        console.error('데이터 조회 실패:', error);
    }
};

onMounted(() => {
    fetchtestitems();
});

function onRowSelect(event) {
    selectItem.value = { ...event.data };
}

function onReset() {
    selectItem.value = {
        testitem_code: null,
        productType: '',
        inspItem: '',
        unit: '',
        range: '',
        writer: '',
        writeAt: '',
        inspPurpose: '',
        purposeid: ''
    };
    // search 객체 초기화
    search.value = {
        productType: '',
        inspPurpose: ''
    };
}

const registItem = async () => {
    try {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');

        const itemToRegister = { ...selectItem.value };
        itemToRegister.writeAt = `${y}-${m}-${d} ${h}:${min}:${s}`;

        delete itemToRegister.testitem_code;

        const res = await axios.post('/api/test/testInform', itemToRegister);
        alert(res.data.message || '등록 완료');
        fetchtestitems();
        onReset();
    } catch (err) {
        alert('등록 실패');
        console.error(err);
    }
};
</script>

<template>
    <div class="p-6">
        <div class="flex justify-end space-x-2 mb-4">
            <Button label="조회" rounded @click="fetchtestitems()" />
            <Button label="초기화" severity="info" rounded @click="onReset" />
        </div>

        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <div class="font-semibold text-xl mb-4">검사 항목 조회</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col">
                    <label class="mb-2 font-medium">제품유형</label>
                    <div class="flex flex-col space-y-2 p-2 rounded-md border border-gray-300">
                        <div v-for="item in productCodeList" :key="item.code" class="flex items-center gap-2">
                            <RadioButton v-model="search.productType" :inputId="'search_productType_' + item.code" name="searchProductType" :value="item.Type" />
                            <label :for="'search_productType_' + item.code">{{ item.Type }}</label>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col">
                    <label class="mb-2 font-medium">검사목적</label>
                    <div class="flex flex-col space-y-2 p-2 rounded-md border border-gray-300">
                        <div v-for="item in inspTypeList" :key="item.code" class="flex items-center gap-2">
                            <RadioButton v-model="search.inspPurpose" :inputId="'search_inspPurpose_' + item.code" name="searchInspPurpose" :value="item.Type" />
                            <label :for="'search_inspPurpose_' + item.code">{{ item.Type }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <div class="font-semibold text-xl my-4">검사 항목 리스트</div>
            <DataTable :value="items" scrollable scrollHeight="400px" tableStyle="min-width: 50rem" :paginator="true" :rows="4" selectionMode="single" :selection="selectItem" @selection-change="onRowSelect" dataKey="testitem_code">
                <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header">
                    <template v-if="col.field === 'writeAt'" #body="{ data }">
                        {{ formatDate(data.writeAt) }}
                    </template>
                </Column>
            </DataTable>
        </div>

        <div class="bg-white rounded-lg shadow-md p-4">
            <div class="font-semibold text-xl my-4">품질검사 항목 등록</div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="flex flex-col">
                    <label for="testitem_code">항목코드</label>
                    <InputText id="testitem_code" v-model="selectItem.testitem_code" readonly style="background-color: #f0f0f0" />
                </div>
                <div class="flex flex-col">
                    <label for="writer">작성자</label>
                    <InputText id="writer" v-model="selectItem.writer" />
                </div>
                <div class="flex flex-col">
                    <label class="mb-2">제품유형</label>
                    <div class="flex flex-col space-y-2">
                        <div v-for="item in productCodeList" :key="item.code" class="flex items-center gap-2">
                            <RadioButton v-model="selectItem.productType" :inputId="'reg_productType_' + item.code" name="regProductType" :value="item.Type" />
                            <label :for="'reg_productType_' + item.code">{{ item.Type }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="range">허용범위</label>
                    <InputText id="range" v-model="selectItem.range" />
                </div>
                <div class="flex flex-col">
                    <label class="mb-2">검사목적</label>
                    <div class="flex flex-col space-y-2">
                        <div v-for="item in inspTypeList" :key="item.code" class="flex items-center gap-2">
                            <RadioButton v-model="selectItem.inspPurpose" :inputId="'reg_inspPurpose_' + item.code" name="regInspPurpose" :value="item.Type" />
                            <label :for="'reg_inspPurpose_' + item.code">{{ item.Type }}</label>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="regInspItem">검사항목</label>
                    <IconField iconPosition="right" class="w-full">
                        <InputText id="regInspItem" v-model="selectItem.inspItem" readonly @click="openModal('inspItem', selectItem)" class="w-full" />
                        <InputIcon class="pi pi-search cursor-pointer" @click="openModal('inspItem', selectItem)" />
                    </IconField>
                </div>
            </div>
        </div>

        <div class="flex justify-end mt-4 space-x-2">
            <Button label="등록" rounded @click="registItem()" />
            <Button label="초기화" severity="info" rounded @click="onReset" />
        </div>
    </div>

    <Dialog v-model:visible="showModal" modal header="선택 리스트" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold text-lg mb-4">
            {{ { inspItem: '검사항목' }[modalType] }}
        </p>
        <DataTable :value="modalType === 'inspItem' ? inspItemList : []" paginator :rows="10" tableStyle="min-width: 20rem">
            <Column field="code" header="코드">
                <template #body="{ data }">
                    <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                        {{ data.code }}
                    </span>
                </template>
            </Column>
            <Column field="Type" header="항목">
                <template #body="{ data }">
                    <span class="cursor-pointer hover:text-blue-600" @click="selectModalValue(data)">
                        {{ data.Type }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </Dialog>
</template>
