<script setup>
import { ref, onBeforeMount } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';

const waitList = ref([]);
const selectedItem = ref(null); // 선택된 항목

// 오른쪽 폼 바인딩용
const form = ref({
    실적코드: '',
    제품코드: '',
    제품명: '',
    생산수량: '',
    실적등록날짜: '',
    불량수량: '',
    담당자: '',
    비고: '',
    측정값리스트: []
});

// 대기 목록 조회
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

// 항목 선택 시 폼에 바인딩
const handleRowSelect = async (e) => {
    const item = e.data;
    selectedItem.value = item;

    try {
        // 쿼리 파라미터 방식으로 호출
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
            검사자: 1,
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

// 초기화
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
// 등록
const defRegister = async () => {
    if (!form.value.실적코드) {
        alert('목록에서 항목을 먼저 선택.');
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
        w_ed_date: form.value.실적등록날짜,
        inspStatus: '완료'
    };

    try {
        const response = await axios.post('/api/test/prdTestRegist', requestData);
        if (response.data.success) {
            alert('검사 결과가 성공적으로 등록되었습니다.');
            fetchpdInspWaitList(); // 목록 갱신
            handleClear(); // 초기화
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
    <div>
        <div class="font-semibold text-2xl mb-4">품질 검사 등록</div>
    </div>
    <div>
        <div class="flex justify-end mb-4 space-x-2">
            <Button label=" 조회 " rounded @click="fetchpdInspWaitList" />
            <Button
                label=" 초기화 "
                severity="info"
                rounded
                @click="
                    selectedItem = null;
                    form = {};
                "
            />
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-8">
        <!-- 왼쪽 검사 대기 목록 -->
        <div class="md:w-2/3">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">검사 대기 목록</div>
                <DataTable :value="waitList" selectionMode="single" dataKey="실적코드" @rowSelect="handleRowSelect" :selection="selectedItem" @update:selection="(val) => (selectedItem = val)" :paginator="true" :rows="10">
                    <Column field="실적코드" header="실적코드" style="min-width: 80px" frozen class="font-bold" />
                    <Column field="제품코드" header="제품코드" />
                    <Column field="제품명" header="제품명" />
                    <Column field="생산수량" header="생산수량" />
                    <Column field="실적등록날짜" header="실적등록날짜" />
                    <Column field="상태" header="상태" />
                </DataTable>
            </div>
        </div>

        <!-- 오른쪽 검사 등록 폼 -->
        <div class="md:w-1/3">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">제품 품질 검사 등록</div>

                <div class="purchase-info">
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>실적코드</label>
                            <InputText v-model="form.실적코드" readonly style="background-color: #f0f0f0" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>제품코드</label>
                            <InputText v-model="form.제품코드" readonly style="background-color: #f0f0f0" />
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>제품명</label>
                            <InputText v-model="form.제품명" readonly style="background-color: #f0f0f0" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>생산수량</label>
                            <InputText v-model="form.생산수량" readonly style="background-color: #f0f0f0" />
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>실적등록날짜</label>
                            <InputText v-model="form.실적등록날짜" readonly style="background-color: #f0f0f0" />
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>담당자</label>
                            <InputText v-model="form.담당자" readonly style="background-color: #f0f0f0" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>비고</label>
                            <InputText v-model="form.비고" />
                        </div>
                    </div>
                    <div class="font-semibold text-xl mb-4">측정값 입력</div>
                    <div v-for="(item, index) in form.측정값리스트" :key="index" class="flex flex-row gap-2 w-full mb-2">
                        <div class="flex flex-col flex-1 min-w-0">
                            <label>검사항목</label>
                            <InputText v-model="item.검사항목" readonly style="background-color: #f0f0f0" />
                        </div>
                        <div class="flex flex-col flex-1 min-w-0">
                            <label>허용범위</label>
                            <InputText v-model="item.허용범위" readonly style="background-color: #f0f0f0" />
                        </div>
                        <div class="flex flex-col flex-1 min-w-0">
                            <label>측정값</label>
                            <InputText v-model="item.측정값" />
                        </div>
                        <div class="flex flex-col flex-1 min-w-0">
                            <label style="color: red">판정</label>
                            <InputText v-model="item.판정" readonly style="background-color: #f0f0f0" />
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-end mb-4 space-x-2">
                            <Button label=" 등록 " rounded @click="defRegister" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
}
</style>
