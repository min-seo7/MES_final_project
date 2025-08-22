<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';

// 리스트
const items = ref([]);

// 검색
const search = ref({ productType: '', inspPurpose: '' });

// 선택 항목 (초기값 유지)
const selectItem = ref({
    testitem_code: null,
    writer: '',
    productType: '',
    inspItem: '',
    inspPurpose: '',
    purposeid: '', // <- purpose code 필드를 추가
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
    targetObject.value = target; // target is reactive (selectItem)
    showModal.value = true;
};
const closeModal = () => {
    showModal.value = false;
};

const selectModalValue = (value) => {
    if (!targetObject.value) return;

    if (modalType.value === 'inspItem') {
        targetObject.value.inspItem = value.Type;
        // (optional) targetObject.value.inspItemCode = value.code;
    } else if (modalType.value === 'unit') {
        targetObject.value.unit = value.Type;
        // (optional) targetObject.value.unitCode = value.code;
    } else if (modalType.value === 'inspPurpose') {
        // **중요**: 검사목적은 name(Type)과 code(=purposeid) 둘다 저장
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
        if (search.productType) params.append('productType', search.productType);
        if (search.inspPurpose) params.append('inspPurpose', search.inspPurpose);

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
            items.value = [];
        }
    } catch (err) {
        console.error('fetchtestitems error', err);
        items.value = [];
    }
};

// 행 선택
function onRowSelect(e) {
    if (e && e.value) {
        // 선택된 항목을 selectItem에 넣음 (편집/수정 가능하도록)
        selectItem.value = { ...e.value };
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

        // testitem_code 제거 (insert용)
        delete payload.testitem_code;
        delete payload.rangeOperator;
        delete payload.rangeValue;

        // **중요** : payload에 purposeid 가 반드시 있어야 함 (DB purpose_id NOT NULL)
        // 만약 사용자가 검사목적을 라디오/모달로 선택하지 않았다면 확인
        if (!payload.purposeid) {
            // 시나리오: 사용자 UI 선택이 name(Type)만 했을 경우 code를 찾아 채움
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

        // 검사목적 디폴트(code '201' 우선)
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
    <div class="p-4 space-y-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 조회 카드 -->
            <div class="card w-full md:w-1/3">
                <h2 class="text-lg font-semibold mb-3">검사 항목 조회</h2>

                <div class="mb-4">
                    <label class="block font-medium mb-2">제품유형</label>
                    <div class="flex flex-col space-y-2">
                        <div v-for="item in productCodeList" :key="item.code" class="flex items-center gap-2">
                            <RadioButton :inputId="'search_pt_' + item.code" name="searchProductType" v-model="search.productType" :value="item.Type" />
                            <label :for="'search_pt_' + item.code">{{ item.Type }}</label>
                        </div>
                        <div v-if="productCodeList.length === 0" class="text-sm text-gray-500">제품유형 데이터 없음</div>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block font-medium mb-2">검사목적</label>
                    <div class="flex flex-col space-y-2">
                        <div v-for="item in inspTypeList" :key="item.code" class="flex items-center gap-2">
                            <RadioButton :inputId="'search_ip_' + item.code" name="searchInspPurpose" v-model="search.inspPurpose" :value="item.Type" />
                            <label :for="'search_ip_' + item.code">{{ item.Type }}</label>
                        </div>
                        <div v-if="inspTypeList.length === 0" class="text-sm text-gray-500">검사목적 데이터 없음</div>
                    </div>
                </div>

                <div class="flex justify-end gap-2">
                    <Button label="조회" @click="fetchtestitems" />
                    <Button label="초기화" severity="info" @click="onReset" />
                </div>
            </div>

            <!-- 등록 카드 -->
            <div class="card w-full md:w-2/3">
                <h2 class="text-lg font-semibold mb-3">품질검사 항목 등록</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- 항목코드(읽기전용) -->
                    <div>
                        <label class="block font-medium mb-1">항목코드</label>
                        <InputText v-model="selectItem.testitem_code" readonly class="bg-gray-100 w-full" />
                    </div>

                    <!-- 작성자(읽기전용) -->
                    <div>
                        <label class="block font-medium mb-1">작성자</label>
                        <InputText v-model="selectItem.writer" readonly class="bg-gray-100 w-full" />
                    </div>

                    <!-- 제품유형 (radio) -->
                    <div class="md:col-span-1 lg:col-span-1">
                        <label class="block font-medium mb-1">제품유형</label>
                        <div class="flex flex-col space-y-2 p-2 border rounded">
                            <div v-for="item in productCodeList" :key="item.code" class="flex items-center gap-2">
                                <RadioButton :inputId="'reg_pt_' + item.code" name="regProductType" v-model="selectItem.productType" :value="item.Type" />
                                <label :for="'reg_pt_' + item.code">{{ item.Type }}</label>
                            </div>
                            <div v-if="productCodeList.length === 0" class="text-sm text-gray-500">제품유형 데이터 없음</div>
                        </div>
                    </div>

                    <!-- 검사목적 (모달로 선택) -->
                    <div>
                        <label class="block font-medium mb-1">검사목적</label>
                        <div class="flex items-center gap-2">
                            <InputText readonly v-model="selectItem.inspPurpose" class="w-full cursor-pointer bg-white" @click="openModal('inspPurpose', selectItem)" />
                            <Button icon="pi pi-search" class="p-button-text" @click="openModal('inspPurpose', selectItem)" />
                        </div>
                    </div>

                    <!-- 검사항목 (모달) -->
                    <div>
                        <label class="block font-medium mb-1">검사항목</label>
                        <div class="flex items-center gap-2">
                            <InputText readonly v-model="selectItem.inspItem" class="w-full cursor-pointer bg-white" @click="openModal('inspItem', selectItem)" />
                            <Button icon="pi pi-search" class="p-button-text" @click="openModal('inspItem', selectItem)" />
                        </div>
                    </div>

                    <!-- 단위 (모달) -->
                    <div>
                        <label class="block font-medium mb-1">단위</label>
                        <div class="flex items-center gap-2">
                            <InputText readonly v-model="selectItem.unit" class="w-full cursor-pointer bg-white" @click="openModal('unit', selectItem)" />
                            <Button icon="pi pi-search" class="p-button-text" @click="openModal('unit', selectItem)" />
                        </div>
                    </div>

                    <!-- 허용범위 -->
                    <div class="col-span-1 lg:col-span-2">
                        <label class="block font-medium mb-1">허용범위</label>
                        <div class="flex gap-2 items-center">
                            <InputText readonly v-model="selectItem.rangeOperator" class="cursor-pointer w-1/3 bg-white" @click="openModal('rangeOperator', selectItem)" />
                            <InputText v-model="selectItem.rangeValue" placeholder="예: 0.5" class="w-2/3" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end mt-4 gap-2">
                    <Button label="등록" @click="registItem" />
                    <Button label="초기화" severity="info" @click="onReset" />
                </div>
            </div>
        </div>

        <!-- 리스트 -->
        <div class="card">
            <h2 class="text-lg font-semibold mb-3">검사 항목 리스트</h2>
            <DataTable :value="items" :selection="selectItem" selectionMode="single" dataKey="testitem_code" @selection-change="onRowSelect" scrollable scrollHeight="360px" :paginator="true" :rows="8" class="min-w-full">
                <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header">
                    <template v-if="col.field === 'writeAt'" #body="{ data }">{{ formatDate(data.writeAt) }}</template>
                </Column>

                <Column header="삭제" style="width: 120px">
                    <template #body="{ data }">
                        <Button label="삭제" severity="danger" @click="deleteItem(data.testitem_code)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- 모달 -->
        <Dialog v-model:visible="showModal" modal :style="{ width: '42vw' }" header="선택 리스트" @hide="closeModal">
            <div>
                <h3 class="font-semibold mb-3">
                    {{ modalTitle }}
                </h3>

                <div v-if="modalList && modalList.length > 0">
                    <DataTable :value="modalList" :paginator="true" :rows="8" class="min-w-full">
                        <Column field="code" header="코드" style="width: 120px" />
                        <Column field="Type" :header="modalType === 'rangeOperator' ? '연산자' : '항목'">
                            <template #body="{ data }">
                                <button class="text-left w-full py-2 hover:bg-gray-100" @click="selectModalValue(data)">
                                    {{ data.Type }}
                                </button>
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <div v-else class="text-sm text-gray-500">선택 가능한 데이터가 없습니다.</div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.card {
    padding: 1rem;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    background: #fff;
}
</style>
