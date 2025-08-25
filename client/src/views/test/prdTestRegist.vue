<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';
import { getJudgment } from '@/math.js';

const waitList = ref([]);
const selectedItem = ref(null);

const form = ref({
    실적코드: '',
    제품코드: '',
    제품명: '',
    생산수량: '',
    실적등록날짜: '',
    담당자: '',
    비고: '',
    측정값리스트: []
});

const fetchpdInspWaitList = async () => {
    try {
        const response = await axios.get('/api/test/prdTestRegist');
        waitList.value = response.data.map((item) => ({
            ...item,
            inspStatus: item.result ? '완료' : '대기'
        }));
        console.log(
            '대기목록 inspStatus:',
            waitList.value.map((r) => r.inspStatus)
        );
    } catch (err) {
        console.error('대기목록조회실패.', err);
    }
};

onBeforeMount(fetchpdInspWaitList);

watch(
    () => form.value.측정값리스트,
    (newVal) => {
        newVal.forEach((item) => {
            if (item.측정값) {
                item.판정 = getJudgment(item.허용범위, item.측정값);
            }
        });
    },
    { deep: true }
);

const handleRowSelect = async (e) => {
    const item = e.data;

    try {
        const response = await axios.get('/api/test/prdTestRegist/getitem', {
            params: { productId: item.제품코드 }
        });
        const inspItem = Array.isArray(response.data) ? response.data : [];
        form.value = {
            실적코드: item.실적코드,
            제품코드: item.제품코드,
            제품명: item.제품명,
            생산수량: item.생산수량,
            실적등록날짜: item.실적등록날짜,
            담당자: 1, // 담당자 임의 지정
            비고: '',
            측정값리스트: inspItem.map((row) => ({
                검사항목: row.item_name,
                허용범위: row.fixedStandard,
                측정값: '',
                판정: ''
            }))
        };
    } catch (err) {
        console.error('검사항목 불러오기 실패:', err);
        alert('검사항목 불러오기 실패');
    }
};

const handleClear = () => {
    selectedItem.value = null;
    form.value = {
        실적코드: '',
        제품코드: '',
        제품명: '',
        생산수량: '',
        실적등록날짜: '',
        담당자: '',
        비고: '',
        측정값리스트: []
    };
};

const defRegister = async () => {
    if (!form.value.실적코드) {
        alert('목록에서 항목을 먼저 선택.');
        return;
    }

    const isAllMeasured = form.value.측정값리스트.every((item) => item.측정값 !== '' && item.측정값 !== null);
    if (!isAllMeasured) {
        alert('모든 검사항목의 측정값을 입력해주세요.');
        return;
    }

    const isFailed = form.value.측정값리스트.some((item) => item.판정 === '부적합');
    const finalJudgment = isFailed ? '불합격' : '합격';

    const requestData = {
        pf_code: form.value.실적코드,
        product_id: form.value.제품코드,
        prd_name: form.value.제품명,
        result: finalJudgment,
        qty: form.value.생산수량,
        remark: form.value.비고,
        inspector_id: form.value.담당자,
        측정값리스트: form.value.측정값리스트.map(({ 검사항목, 허용범위, 측정값, 판정 }) => ({
            itemName: 검사항목,
            fixedStandard: 허용범위,
            measuredValue: 측정값,
            judgment: 판정
        }))
    };

    try {
        const response = await axios.post('/api/test/prdTestRegist', requestData);
        if (response.data.success) {
            alert('검사 결과가 성공적으로 등록되었습니다.');
            fetchpdInspWaitList();
            handleClear();
        } else {
            alert('검사 결과 등록에 실패했습니다.');
        }
    } catch (err) {
        console.error('검사 결과 등록 실패:', err);
        alert('검사 결과 등록에 실패했습니다.');
    }
};
</script>

<template>
    <div class="p-4">
        <div class="flex items-center justify-between font-semibold text-xl mb-4">
            <h4>품질 검사 등록</h4>
            <div class="space-x-1">
                <Button label="조회" class="text-xs px-2 py-1 h-[28px]" rounded @click="fetchpdInspWaitList" />
                <Button label="초기화" class="text-xs px-2 py-1 h-[28px]" rounded severity="info" @click="handleClear" />
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-2/3">
                <div class="card p-4">
                    <div class="font-semibold text-lg mb-2">검사 대기 목록</div>
                    <DataTable :value="waitList" selectionMode="single" dataKey="실적코드" @rowSelect="handleRowSelect" v-model:selection="selectedItem" :paginator="true" :rows="10" class="compact-table">
                        <Column field="실적코드" header="실적코드" />
                        <Column field="제품코드" header="제품코드" />
                        <Column field="제품명" header="제품명" />
                        <Column field="생산수량" header="생산수량" />
                        <Column field="실적등록날짜" header="실적등록날짜" />
                        <Column field="상태" header="상태" />
                    </DataTable>
                </div>
            </div>

            <div class="md:w-1/3">
                <div class="card p-4">
                    <div class="font-semibold text-lg mb-2">제품 품질 검사 등록</div>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm">실적코드</label>
                            <InputText v-model="form.실적코드" readonly class="text-sm bg-gray-100" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm">제품코드</label>
                            <InputText v-model="form.제품코드" readonly class="text-sm bg-gray-100" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm">제품명</label>
                            <InputText v-model="form.제품명" readonly class="text-sm bg-gray-100" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm">생산수량</label>
                            <InputText v-model="form.생산수량" readonly class="text-sm bg-gray-100" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm">실적등록날짜</label>
                            <InputText v-model="form.실적등록날짜" readonly class="text-sm bg-gray-100" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm">담당자</label>
                            <InputText v-model="form.담당자" readonly class="text-sm bg-gray-100" />
                        </div>
                        <div class="flex flex-col gap-1 col-span-2">
                            <label class="text-sm">비고</label>
                            <InputText v-model="form.비고" class="text-sm" />
                        </div>
                    </div>

                    <div class="font-semibold text-base mt-4 mb-2">측정값 입력</div>
                    <div v-for="(item, index) in form.측정값리스트" :key="index" class="mb-2">
                        <label class="block text-sm mb-1">{{ item.검사항목 }}</label>
                        <div class="flex gap-2 items-end">
                            <div class="flex-1">
                                <label class="block text-xs text-gray-500">허용범위</label>
                                <InputText v-model="item.허용범위" readonly class="w-full text-xs bg-gray-100" />
                            </div>
                            <div class="flex-1">
                                <label class="block text-xs text-gray-500">측정값</label>
                                <InputText v-model="item.측정값" class="w-full text-xs" />
                            </div>
                            <div class="flex-1">
                                <label class="block text-xs text-red-500 font-semibold">판정</label>
                                <InputText v-model="item.판정" readonly class="w-full text-xs bg-gray-100 text-red-600 font-bold" />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-4">
                        <Button label="등록" class="text-xs px-2 py-1 h-[28px]" rounded @click="defRegister" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

/* :deep(.p-datatable.compact-table .p-datatable-thead > tr > th) {
    font-size: 0.8rem;
    padding: 0.5rem;
}

:deep(.p-datatable.compact-table .p-datatable-tbody > tr > td) {
    font-size: 0.8rem;
    padding: 0.5rem;
}

:deep(.p-inputtext) {
    height: 28px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
} */

.bg-gray-100 {
    background-color: #f3f4f6;
}
</style>
