<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const form = ref({
    inspCode: 'P-T03',
    writer: '품질관리자',
    productType: '분말형비료',
    range: '±50%',
    inspPurpose: '샘플링검사',
    writeAt: '2025-08-01',
    inspItem: '유기물',
    remark: ''
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
    { code: 'PL20250808P002-20', Type: '과립형' },
    { code: 'PL20250808P002-20', Type: '분말형' },
    { code: 'PL20250808P002-20', Type: '액상형' }
]);

const products = ref([
    { id: 1, inspCode: 'P-T01', productType: '분말형비료', inspPurpose: '샘플링검사', inspItem: '수분', range: '±30%', writer: '품질관리자', writeAt: '2025-08-01', remark: '-' },
    { id: 2, inspCode: 'P-T02', productType: '분말형비료', inspPurpose: '샘플링검사', inspItem: '질소', range: '±3%', writer: '품질관리자', writeAt: '2025-08-01', remark: '-' },
    { id: 3, inspCode: 'P-T03', productType: '분말형비료', inspPurpose: '샘플링검사', inspItem: '유기물', range: '±50%', writer: '품질관리자', writeAt: '2025-08-01', remark: '-' }
]);

const columns = ref([
    { field: 'inspCode', header: '항목코드' },
    { field: 'productType', header: '제품유형' },
    { field: 'inspPurpose', header: '검사목적' },
    { field: 'inspItem', header: '검사항목' },
    { field: 'range', header: '허용범위' },
    { field: 'writer', header: '작성자' },
    { field: 'writeAt', header: '작성날짜' },
    { field: 'remark', header: '비고' }
]);
</script>

<template>
    <div class="flex justify-end space-x-2">
        <Button label=" 조회 " rounded />
        <Button label=" 초기화 " severity="info" rounded />
    </div>
    <div class="font-semibold text-xl my-4">검사 항목 조회</div>
    <div class="card p-4">
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
                    <InputText v-model="search.inspType" readonly @click="openModal('inspType')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('inspType')" />
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
    <div class="flex-auto card">
        <DataTable :value="products" scrollable scrollHeight="400px" tableStyle="min-width: 50rem">
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        </DataTable>
    </div>

    <div class="font-semibold text-xl my-4">제품 품질 검사 등록</div>
    <div class="card p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex flex-col">
                <label for="inspCode">검사항목코드</label>
                <InputText id="inspCode" v-model="form.inspCode" readonly style="background-color: #f0f0f0" />
            </div>
            <div class="flex flex-col">
                <label for="writer">작성자</label>
                <InputText id="writer" v-model="form.writer" readonly style="background-color: #f0f0f0" />
            </div>
            <div class="flex flex-col">
                <label for="productType">제품유형</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText id="productType" v-model="form.productType" readonly @click="openModal('productType')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('productType')" />
                </IconField>
            </div>
            <div class="flex flex-col">
                <label for="range">허용범위</label>
                <InputText id="range" v-model="form.range" />
            </div>
            <div class="flex flex-col">
                <label for="inspPurpose">검사목적</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText id="inspPurpose" v-model="form.inspPurpose" readonly @click="openModal('inspPurpose')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('inspPurpose')" />
                </IconField>
            </div>
            <div class="flex flex-col">
                <label for="writeAt">작성날짜</label>
                <InputText id="writeAt" v-model="form.writeAt" readonly style="background-color: #f0f0f0" />
            </div>
            <div class="flex flex-col">
                <label for="inspItem">검사항목</label>
                <IconField iconPosition="right" class="w-full">
                    <InputText id="inspItem" v-model="form.inspItem" readonly @click="openModal('inspItem')" class="w-full" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openModal('inspItem')" />
                </IconField>
            </div>
            <div class="flex flex-col">
                <label for="remark">비고</label>
                <InputText id="remark" v-model="form.remark" />
            </div>
        </div>
    </div>
    <div class="flex justify-end mb-4 space-x-2">
        <Button label=" 등록 " rounded />
        <Button label=" 초기화 " severity="info" rounded />
    </div>

    <Dialog v-model:visible="showModal" modal header="선택 리스트" :style="{ width: '40vw' }" @hide="closeModal">
        <p class="font-bold text-lg mb-4">
            {{ { productType: '제품유형', inspPurpose: '검사유형', inspItem: '검사항목' }[modalType] }}
        </p>
        <DataTable :value="productCodeList" paginator :rows="10" tableStyle="min-width: 20rem">
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
