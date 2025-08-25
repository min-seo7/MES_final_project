<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import Toolbar from 'primevue/toolbar';
import Card from 'primevue/card';

// 리스트
const items = ref([]);

// 검색
const search = ref({ productType: '', inspPurpose: '' });

// 선택 항목 (초기값 유지)
const selectItem = ref({
    testitem_code: null,
    writer: '',
    productType: '',
    inspector: '',
    inspItem: '',
    inspPurpose: '',
    purposeid: '',
    unit: '',
    rangeOperator: '',
    rangeValue: ''
});

// 모달 상태
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
    if (!targetObject.value) return;

    if (modalType.value === 'inspItem') {
        targetObject.value.inspItem = value.Type;
    } else if (modalType.value === 'unit') {
        targetObject.value.unit = value.Type;
    } else if (modalType.value === 'inspPurpose') {
        targetObject.value.inspPurpose = value.Type;
        targetObject.value.purposeid = value.code;
    } else if (modalType.value === 'rangeOperator') {
        targetObject.value.rangeOperator = value.Type;
    }

    showModal.value = false;
};

// 기준정보 배열 (DB에서 불러옴)
const productCodeList = ref([]);
const inspTypeList = ref([]);
const inspItemList = ref([]);
const operatorList = ref([]);
const unitList = ref([]);

// modal에서 보여줄 리스트(계산)
const modalList = computed(() => {
    if (modalType.value === 'inspItem') return inspItemList.value;
    if (modalType.value === 'unit') return unitList.value;
    if (modalType.value === 'rangeOperator') return operatorList.value;
    if (modalType.value === 'inspPurpose') return inspTypeList.value;
    return [];
});

const modalTitle = computed(() => {
    return (
        {
            inspItem: '검사항목',
            unit: '단위',
            rangeOperator: '연산자',
            inspPurpose: '검사목적'
        }[modalType.value] || ''
    );
});

// 컬럼 정의
const columns = ref([
    { field: 'testitem_code', header: '항목코드' },
    { field: 'productType', header: '제품유형' },
    { field: 'inspItem', header: '검사항목' },
    { field: 'unit', header: '단위' },
    { field: 'operator', header: '허용범위' },
    { field: 'inspPurpose', header: '검사목적' },
    { field: 'writer', header: '작성자' },
    { field: 'writeAt', header: '작성날짜' }
]);

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
};

// 데이터 조회 (리스트)
const fetchtestitems = async () => {
    try {
        const params = new URLSearchParams();
        if (search.value.productType && search.value.productType.length > 0) {
            params.append('productType', search.value.productType);
        }
        if (search.value.inspPurpose && search.value.inspPurpose.length > 0) {
            params.append('inspPurpose', search.value.inspPurpose);
        }

        const res = await axios.get(`/api/test/testInform?${params.toString()}`);
        if (Array.isArray(res.data)) {
            items.value = res.data.map((it) => ({
                testitem_code: it.testitem_code,
                productType: it.product_type,
                inspItem: it.item_name,
                unit: it.unit,
                operator: it.fixedStandard,
                writer: it.createdBy,
                writeAt: it.createdAt,
                inspPurpose: it.purpose_name,
                purposeid: it.purpose_id
            }));
        } else {
            console.error('API 응답 형식이 올바르지 않습니다.');
            items.value = [];
        }
    } catch (err) {
        console.error('fetchtestitems error', err);
        items.value = [];
    }
};

// 행 선택
function onRowSelect(e) {
    if (e && e.data) {
        selectItem.value = { ...e.data };
    } else {
        selectItem.value = { ...(e || {}) };
    }
}

// 초기화
function onReset() {
    selectItem.value = {
        testitem_code: null,
        writer: '',
        productType: '',
        inspItem: '',
        inspPurpose: inspTypeList.value.find((x) => x.code === '201')?.Type || '',
        purposeid: inspTypeList.value.find((x) => x.code === '201')?.code || '',
        unit: '',
        rangeOperator: '',
        rangeValue: ''
    };
    search.productType = '';
    search.inspPurpose = '';
}

// 삭제
const deleteItem = async (testitem_code) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
        await axios.delete(`/api/test/testInform/${testitem_code}`);
        await fetchtestitems();
    } catch (err) {
        console.error('deleteItem error', err);
        alert('삭제 실패');
    }
};

// 등록
const registItem = async () => {
    try {
        if (!selectItem.value.productType || !selectItem.value.inspPurpose || !selectItem.value.inspItem || !selectItem.value.unit) {
            alert('제품유형, 검사목적, 검사항목, 단위는 필수입니다.');
            return;
        }

        const payload = { ...selectItem.value };

        if (payload.rangeOperator && payload.rangeValue) payload.fixedStandard = `${payload.rangeOperator} ${payload.rangeValue}`;
        else payload.fixedStandard = '';

        delete payload.testitem_code;
        delete payload.rangeOperator;
        delete payload.rangeValue;

        if (!payload.purposeid) {
            const found = inspTypeList.value.find((x) => x.Type === payload.inspPurpose);
            if (found) payload.purposeid = found.code;
        }

        await axios.post('/api/test/testInform', payload);
        await fetchtestitems();
        onReset();
        alert('등록 완료');
    } catch (err) {
        console.error('registItem error', err);
        alert('등록 실패: ' + (err?.response?.data?.message || err.message));
    }
};

// 초기 데이터 로드: 기준정보 + 리스트
onMounted(async () => {
    try {
        const [pRes, ipRes, itRes, oRes, uRes] = await Promise.all([axios.get('/api/test/productTypes'), axios.get('/api/test/inspPurposes'), axios.get('/api/test/inspItems'), axios.get('/api/test/operators'), axios.get('/api/test/units')]);

        productCodeList.value = Array.isArray(pRes.data) ? pRes.data : [];
        inspTypeList.value = Array.isArray(ipRes.data) ? ipRes.data : [];
        inspItemList.value = Array.isArray(itRes.data) ? itRes.data : [];
        operatorList.value = Array.isArray(oRes.data) ? oRes.data : [];
        unitList.value = Array.isArray(uRes.data) ? uRes.data : [];

        const defaultPurpose = inspTypeList.value.find((x) => x.code === '201');
        if (defaultPurpose) {
            selectItem.value.inspPurpose = defaultPurpose.Type;
            selectItem.value.purposeid = defaultPurpose.code;
        }

        await fetchtestitems();
    } catch (err) {
        console.error('initial load error', err);
    }
});
</script>

<template>
    <div class="p-2 space-y-4">
        <div class="flex items-center justify-between font-semibold text-lg mb-2">
            <h4>검사 항목 조회</h4>
            <div class="space-x-1">
                <Button label="조회" class="text-xs px-2 py-1 h-[28px]" rounded @click="fetchtestitems"></Button>
                <Button label="초기화" class="text-xs px-2 py-1 h-[28px]" severity="info" rounded @click="onReset"></Button>
            </div>
        </div>

        <Toolbar class="p-2 mb-2">
            <template #center>
                <div class="flex items-center gap-4 text-xs">
                    <div class="flex items-center gap-1">
                        <label class="whitespace-nowrap">제품유형</label>
                        <div class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-2 h-[28px]">
                            <div v-for="item in productCodeList" :key="item.code" class="flex items-center gap-1 mr-2">
                                <RadioButton :inputId="'search_pt_' + item.code" name="searchProductType" v-model="search.productType" :value="item.Type" />
                                <label :for="'search_pt_' + item.code">{{ item.Type }}</label>
                            </div>
                            <div v-if="productCodeList.length === 0" class="text-xs text-gray-500">데이터 없음</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-1">
                        <label class="whitespace-nowrap">검사목적</label>
                        <div class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-2 h-[28px]">
                            <div v-for="item in inspTypeList" :key="item.code" class="flex items-center gap-1 mr-2">
                                <RadioButton :inputId="'search_ip_' + item.code" name="searchInspPurpose" v-model="search.inspPurpose" :value="item.Type" />
                                <label :for="'search_ip_' + item.code">{{ item.Type }}</label>
                            </div>
                            <div v-if="inspTypeList.length === 0" class="text-xs text-gray-500">데이터 없음</div>
                        </div>
                    </div>
                </div>
            </template>
        </Toolbar>

        <Card class="w-full">
            <template #title>
                <h2 class="text-base font-semibold">검사 항목 리스트</h2>
            </template>
            <template #content>
                <DataTable :value="items" :selection="selectItem" selectionMode="single" dataKey="testitem_code" scrollable scrollHeight="300px" :paginator="true" :rows="4" class="min-w-full" @rowSelect="onRowSelect" @rowUnselect="onReset">
                    <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" class="text-center">
                        <template v-if="col.field === 'writeAt'" #body="{ data }">{{ formatDate(data.writeAt) }}</template>
                    </Column>
                    <Column header="삭제" style="width: 80px" class="text-center">
                        <template #body="{ data }">
                            <Button label="삭제" severity="danger" class="text-xs px-2 py-1" @click="deleteItem(data.testitem_code)" />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>

        <Card class="w-full">
            <template #title>
                <h2 class="text-base font-semibold">품질검사 항목 등록</h2>
            </template>
            <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                    <div>
                        <label class="block font-medium mb-1">항목코드</label>
                        <InputText v-model="selectItem.testitem_code" readonly class="bg-gray-100 w-full text-sm" />
                    </div>

                    <div>
                        <label class="block font-medium mb-1">작성자</label>
                        <InputText v-model="selectItem.writer" readonly class="bg-gray-100 w-full text-sm" />
                    </div>

                    <div class="md:col-span-1 lg:col-span-1">
                        <label class="block font-medium mb-1">제품유형</label>
                        <div class="flex flex-col space-y-1 p-1 border rounded">
                            <div v-for="item in productCodeList" :key="item.code" class="flex items-center gap-1">
                                <RadioButton :inputId="'reg_pt_' + item.code" name="regProductType" v-model="selectItem.productType" :value="item.Type" />
                                <label :for="'reg_pt_' + item.code" class="text-sm">{{ item.Type }}</label>
                            </div>
                            <div v-if="productCodeList.length === 0" class="text-xs text-gray-500">제품유형 데이터 없음</div>
                        </div>
                    </div>

                    <div>
                        <label class="block font-medium mb-1">검사목적</label>
                        <div class="relative flex items-center">
                            <InputText readonly v-model="selectItem.inspPurpose" class="w-full cursor-pointer bg-white pr-8 text-sm" @click="openModal('inspPurpose', selectItem)" />
                            <i class="pi pi-search absolute right-2 text-gray-500 cursor-pointer" @click="openModal('inspPurpose', selectItem)"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block font-medium mb-1">검사항목</label>
                        <div class="relative flex items-center">
                            <InputText readonly v-model="selectItem.inspItem" class="w-full cursor-pointer bg-white pr-8 text-sm" @click="openModal('inspItem', selectItem)" />
                            <i class="pi pi-search absolute right-2 text-gray-500 cursor-pointer" @click="openModal('inspItem', selectItem)"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block font-medium mb-1">단위</label>
                        <div class="relative flex items-center">
                            <InputText readonly v-model="selectItem.unit" class="w-full cursor-pointer bg-white pr-8 text-sm" @click="openModal('unit', selectItem)" />
                            <i class="pi pi-search absolute right-2 text-gray-500 cursor-pointer" @click="openModal('unit', selectItem)"></i>
                        </div>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <label class="block font-medium mb-1">허용범위</label>
                        <div class="flex gap-2 items-center">
                            <div class="relative w-1/3 flex items-center">
                                <InputText readonly v-model="selectItem.rangeOperator" class="cursor-pointer w-full bg-white pr-8 text-sm" @click="openModal('rangeOperator', selectItem)" />
                                <i class="pi pi-search absolute right-2 text-gray-500 cursor-pointer" @click="openModal('rangeOperator', selectItem)"></i>
                            </div>
                            <InputText v-model="selectItem.rangeValue" placeholder="예: 0.5" class="w-2/3 text-sm" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end mt-2 gap-1">
                    <Button label="등록" class="text-xs px-2 py-1 h-[28px]" rounded @click="registItem" />
                    <Button label="초기화" class="text-xs px-2 py-1 h-[28px]" rounded severity="info" @click="onReset" />
                </div>
            </template>
        </Card>

        <Dialog v-model:visible="showModal" modal :style="{ width: '38vw' }" header="선택 리스트" @hide="closeModal">
            <div>
                <h3 class="font-semibold mb-2">
                    {{ modalTitle }}
                </h3>
                <div v-if="modalList && modalList.length > 0">
                    <DataTable :value="modalList" :paginator="true" :rows="8" class="min-w-full">
                        <Column field="code" header="코드" style="width: 80px" class="text-center" />
                        <Column field="Type" :header="modalType === 'rangeOperator' ? '연산자' : '항목'" class="text-center">
                            <template #body="{ data }">
                                <button class="text-center w-full py-1 hover:bg-gray-100" @click="selectModalValue(data)">
                                    {{ data.Type }}
                                </button>
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <div v-else class="text-xs text-gray-500">선택 가능한 데이터가 없습니다.</div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.card {
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

/* :deep(.p-toolbar) {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
}

:deep(.p-toolbar .p-toolbar-group-center) {
    width: 100%;
    justify-content: center;
}

:deep(.p-datatable-thead th) {
    font-size: 0.8rem;
    padding: 0.5rem;
}

:deep(.p-datatable-tbody td) {
    font-size: 0.8rem;
    padding: 0.5rem;
} */
</style>
