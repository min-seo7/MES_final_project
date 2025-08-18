<script setup>
import { ref, onBeforeMount } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';
import RadioButton from 'primevue/radiobutton';

const waitList = ref([]);
const selectedItem = ref(null);

// 오른쪽 폼 바인딩용
const form = ref({
    검사번호: '',
    검사유형: '',
    구매번호: '',
    자재코드: '',
    자재명: '',
    수량: '',
    검사자: 1,
    비고: '',
    측정값리스트: []
});

// 대기 목록 조회
const fetchInspWaitList = async () => {
    try {
        const response = await axios.get('/api/test/matTestRegist');
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

onBeforeMount(fetchInspWaitList);

// 항목 선택 시 폼 바인딩
const handleRowSelect = (e) => {
    const item = e.data;
    selectedItem.value = item;

    form.value = {
        검사번호: item.자재검수번호,
        검사유형: '입고검사',
        구매번호: item.구매번호,
        자재코드: item.자재코드,
        자재명: item.자재명,
        수량: item.수량_EA,
        검사자: 1,
        비고: '',
        측정값리스트: [
            { 검사항목: '포장상태 양호 여부', 측정값: '', 판정: '' },
            { 검사항목: '수량 일치 여부', 측정값: '', 판정: '' },
            { 검사항목: '규격 일치 여부', 측정값: '', 판정: '' }
        ]
    };
};

// 초기화
const handleClear = () => {
    selectedItem.value = null;
    form.value = {
        검사번호: '',
        검사유형: '',
        구매번호: '',
        자재코드: '',
        자재명: '',
        수량: '',
        검사자: 1,
        비고: '',
        측정값리스트: []
    };
};

// 등록
const defRegister = async () => {
    if (!form.value.검사번호) {
        alert('목록에서 항목을 먼저 선택.');
        return;
    }

    const isFailed = form.value.측정값리스트.some((item) => item.판정 === '부적합');
    const finalJudgment = isFailed ? '불합격' : '합격';

    const requestData = {
        material_code: form.value.자재코드,
        inspector_id: form.value.검사자,
        result: finalJudgment,
        remark: form.value.비고,
        purch_id: form.value.구매번호,
        insertquantity: form.value.수량,
        qty: form.value.수량,
        inspStatus: '완료'
    };

    try {
        const response = await axios.post('/api/test/matTestRegist', requestData);
        if (response.data.success) {
            alert('검사 결과가 성공적으로 등록되었습니다.');
            fetchInspWaitList(); // 목록 갱신
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
        <div class="font-semibold text-2xl mb-4">입고 검사 등록</div>

        <div class="flex justify-end mb-4 space-x-2">
            <Button label=" 조회 " rounded @click="fetchInspWaitList" />
            <Button label=" 초기화 " severity="info" rounded @click="handleClear" />
        </div>

        <div class="flex flex-col md:flex-row gap-8">
            <!-- 대기 목록 -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl mb-4">검사 대기 목록</div>
                    <DataTable :value="waitList" selectionMode="single" dataKey="자재검수번호" v-model:selection="selectedItem" @rowSelect="handleRowSelect" :paginator="true" :rows="10">
                        <Column field="자재검수번호" header="검사번호" />
                        <Column field="구매번호" header="구매번호" />
                        <Column field="자재코드" header="자재코드" />
                        <Column field="자재명" header="자재명" />
                        <Column field="수량_EA" header="수량(EA)" />
                        <Column field="등록날짜" header="등록날짜" />
                        <Column field="담당자" header="담당자" />
                        <Column field="상태" header="상태" />
                        <Column field="메모" header="메모" />
                    </DataTable>
                </div>
            </div>

            <!-- 등록 폼 -->
            <div class="md:w-1/3">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl mb-4">자재 입고 검사 등록</div>

                    <div class="purchase-info">
                        <div class="flex flex-wrap gap-4 my-4">
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label>검사번호</label>
                                <InputText v-model="form.검사번호" readonly />
                            </div>
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label>검사유형</label>
                                <InputText v-model="form.검사유형" readonly />
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-4 my-4">
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label>구매번호</label>
                                <InputText v-model="form.구매번호" readonly />
                            </div>
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label>자재코드</label>
                                <InputText v-model="form.자재코드" readonly />
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-4 my-4">
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label>자재명</label>
                                <InputText v-model="form.자재명" readonly />
                            </div>
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label>수량</label>
                                <InputText v-model="form.수량" readonly />
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-4 my-4">
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label>검사자</label>
                                <InputText v-model="form.검사자" readonly />
                            </div>
                            <div class="flex flex-col grow basis-0 gap-2">
                                <label>비고</label>
                                <InputText v-model="form.비고" />
                            </div>
                        </div>

                        <div class="font-semibold text-xl mb-4">판정 입력</div>
                        <div v-for="(item, index) in form.측정값리스트" :key="index" class="flex flex-row gap-2 w-full mb-2">
                            <div class="flex flex-col flex-1 min-w-0">
                                <label>검사항목</label>
                                <InputText v-model="item.검사항목" readonly />
                            </div>
                            <div class="flex flex-col flex-1 min-w-0">
                                <label>측정값</label>
                                <div class="flex flex-wrap gap-4">
                                    <div class="flex items-center gap-2">
                                        <RadioButton v-model="item.판정" :inputId="`check_clear_${index}`" :name="`checkval_${index}`" value="적합" />
                                        <label :for="`check_clear_${index}`">적합</label>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <RadioButton v-model="item.판정" :inputId="`check_fail_${index}`" :name="`checkval_${index}`" value="부적합" />
                                        <label :for="`check_fail_${index}`">부적합</label>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col flex-1 min-w-0">
                                <label style="color: red">판정</label>
                                <InputText v-model="item.판정" readonly />
                            </div>
                        </div>

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
