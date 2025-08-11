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

const items = ref([]);

const selectedItem = ref({
    testItem_code: '',
    productType: '',
    inspItem: '',
    unit: '',
    range: '',
    writer: '',
    writeAt: '',
    inspPurpose: '',
    purposeid: ''
});

const search = ref({
    productType: '',
    inspPurpose: '',
    inspItem: ''
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
    if (modalType.value === 'productType') {
        search.value.productType = value.Type;
    } else if (modalType.value === 'inspPurpose') {
        search.value.inspPurpose = value.Type;
    } else if (modalType.value === 'inspItem') {
        search.value.inspItem = value.Type;
    }
    showModal.value = false;
};

const productCodeList = ref([
    { code: 'pd-gran', Type: '과립형 비료' },
    { code: 'pd-pow', Type: '분말형 비료' },
    { code: 'pd-liq', Type: '액상형 비료' }
]);

const inspTypeList = ref([
    { code: '201', Type: '샘플링검사' },
    { code: '202', Type: '자재성분검사' }
]);

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
    { field: 'testItem_code', header: '항목코드' },
    { field: 'productType', header: '제품유형' },
    { field: 'inspItem', header: '검사항목' },
    { field: 'unit', header: '단위' },
    { field: 'range', header: '허용범위' },
    { field: 'writer', header: '작성자' },
    { field: 'writeAt', header: '작성날짜', body: (data) => formatDate(data.writeAt) },
    { field: 'inspPurpose', header: '검사목적' },
    { field: 'purposeid', header: '검사목적코드' }
]);

const fetchTestitems = async () => {
    try {
        // 필터값을 쿼리 스트링으로 만들어서 전달
        const params = new URLSearchParams();
        if (search.value.productType) params.append('productType', search.value.productType);
        if (search.value.inspPurpose) params.append('inspPurpose', search.value.inspPurpose);
        if (search.value.inspItem) params.append('inspItem', search.value.inspItem);

        const url = `/api/test/testInform?${params.toString()}`;
        console.log('API 요청 URL:', url);

        const response = await axios.get(url);
        items.value = response.data.map((item) => ({
            testItem_code: item.testItem_code,
            productType: item.product_type,
            inspItem: item.item_name,
            unit: item.unit,
            range: item.fixedStandard,
            writer: item.createdBy,
            writeAt: item.createdAt,
            inspPurpose: item.purpose_name,
            purposeid: item.purpose_id
        }));
    } catch (error) {
        console.error('데이터 조회 실패:', error);
    }
};

onMounted(() => {
    fetchTestitems();
});

function onRowSelect(event) {
    selectedItem.value = { ...event.data };
}

function onReset() {
    selectedItem.value = {
        testItem_code: '',
        productType: '',
        inspItem: '',
        unit: '',
        range: '',
        writer: '',
        writeAt: '',
        inspPurpose: '',
        purposeid: ''
    };
}

const registItem = async () => {
    try {
        // 예시로 selectedItem 객체를 그대로 POST 요청
        const res = await axios.post('/api/test/testInform', selectedItem.value);
        alert(res.data.message || '등록 완료');
        fetchTestitems(); // 등록 후 리스트 갱신
        onReset();
    } catch (err) {
        alert('등록 실패');
        console.error(err);
    }
};
</script>

<template>
    <div class="flex justify-end space-x-2 mb-4">
        <Button label="조회" rounded @click="fetchTestitems" />
        <Button label="초기화" severity="info" rounded @click="onReset" />
    </div>

    <div class="font-semibold text-xl my-4">검사 항목 조회</div>
    <div class="card p-4 mb-6">
        <div class="flex gap-6">
            <div class="flex flex-col">
                <label for="productType" class="mb-2">제품유형</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText v-model="search.productType" readonly @click="openModal('productType')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('productType')" />
                </IconField>
            </div>
            <div class="flex flex-col">
                <label for="inspType" class="mb-2">검사유형</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText v-model="search.inspPurpose" readonly @click="openModal('inspPurpose')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('inspPurpose')" />
                </IconField>
            </div>
            <div class="flex flex-col">
                <label for="inspItem" class="mb-2">검사항목</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText v-model="search.inspItem" readonly @click="openModal('inspItem')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('inspItem')" />
                </IconField>
            </div>
        </div>
    </div>

    <div class="font-semibold text-xl my-4">검사 항목 리스트</div>
    <DataTable :value="items" scrollable scrollHeight="400px" tableStyle="min-width: 50rem" :paginator="true" :rows="4" selectionMode="single" :selection="selectedItem" @selection-change="onRowSelect" dataKey="testItem_code">
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :body="col.body" />
    </DataTable>

    <div class="font-semibold text-xl my-4">제품 품질 검사 등록</div>
    <div class="card p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex flex-col">
                <label for="testItem_code">항목코드</label>
                <div class="flex flex-col">
                    <InputText id="testItem_code" v-model="selectedItem.testItem_code" readonly style="background-color: #f0f0f0" />
                </div>
            </div>
            <div class="flex flex-col">
                <label for="writer">작성자</label>
                <InputText id="writer" v-model="selectedItem.writer" />
            </div>
            <div class="flex flex-col">
                <label for="productType">제품유형</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText id="productType" v-model="selectedItem.productType" readonly @click="openModal('productType')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('productType')" />
                </IconField>
            </div>
            <div class="flex flex-col">
                <label for="range">허용범위</label>
                <InputText id="range" v-model="selectedItem.range" />
            </div>
            <div class="flex flex-col">
                <label for="inspPurpose">검사목적</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText id="inspPurpose" v-model="selectedItem.inspPurpose" readonly @click="openModal('inspPurpose')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('inspPurpose')" />
                </IconField>
            </div>
            <div class="flex flex-col">
                <label for="writeAt">작성날짜</label>
                <InputText id="writeAt" v-model="selectedItem.writeAt" readonly style="background-color: #f0f0f0" />
            </div>
            <div class="flex flex-col">
                <label for="inspItem">검사항목</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText id="inspItem" v-model="selectedItem.inspItem" readonly @click="openModal('inspItem')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('inspItem')" />
                </IconField>
            </div>
        </div>
    </div>

    <div class="flex justify-end mb-4 space-x-2">
        <Button label="등록" rounded @click="registItem" />
        <Button label="초기화" severity="info" rounded @click="onReset" />
    </div>

    <Dialog v-model:visible="showModal" modal header="선택 리스트" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold text-lg mb-4">
            {{ { productType: '제품유형', inspPurpose: '검사유형', inspItem: '검사항목' }[modalType] }}
        </p>
        <DataTable :value="modalType === 'productType' ? productCodeList : modalType === 'inspPurpose' ? inspTypeList : inspItemList" paginator :rows="10" tableStyle="min-width: 20rem">
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
