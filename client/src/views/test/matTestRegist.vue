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
    검사코드: '',
    검사유형: '',
    발주번호: '',
    자재코드: '',
    자재명: '',
    수량: '',
    검사자: '',
    비고: '',
    측정값리스트: []
});

// 조회 버튼 클릭 시 데이터 로드
const fetchInspWaitList = async () => {
    try {
        const response = await axios.get('/api/test/matTestRegist');
        waitList.value = response.data;
        console.log('대기목록로드:', waitList.value);
    } catch (err) {
        console.error('대기목록조회실패.', err);
    }
};

onBeforeMount(() => {
    fetchInspWaitList();
});

// 항목 선택 시 폼에 바인딩
const handleRowSelect = (e) => {
    const item = e.data;
    selectedItem.value = item;

    // 선택된 행의 데이터로 폼을 업데이트, 고정된 검사항목 리스트를 할당
    form.value = {
        검사코드: item.자재검수번호,
        검사유형: '입고검사',
        발주번호: item.발주번호,
        자재코드: item.자재코드,
        자재명: item.자재명,
        수량: item.수량_EA,
        검사자: '품질관리자',
        비고: '',
        측정값리스트: [
            { 검사항목: '포장상태 양호 여부', 측정값: '', 판정: '' },
            { 검사항목: '수량 일치 여부', 측정값: '', 판정: '' },
            { 검사항목: '규격 일치 여부', 측정값: '', 판정: '' }
        ]
    };
};

// 초기화 버튼 클릭 시 폼과 선택 상태 초기화
const handleClear = () => {
    selectedItem.value = null;
    form.value = {
        // 폼 데이터 초기화
        검사코드: '',
        검사유형: '',
        발주번호: '',
        자재코드: '',
        자재명: '',
        수량: '',
        검사자: '',
        비고: ''
    };
};

// '등록' 버튼 클릭 시 실행될 함수
const defRegister = async () => {
    if (!form.value.검사코드) {
        alert('목록에서 항목을 먼저 선택.');
        return;
    }

    // 측정값리스트에서 '부적합' 판정이 있는지 확인
    const isFailed = form.value.측정값리스트.some((item) => item.판정 === '부적합');
    const finalJudgment = isFailed ? '불합격' : '합격';

    const requestData = {
        자재검수번호: form.value.검사코드,
        최종판정: finalJudgment
    };

    try {
        const response = await axios.post('/api/test/matTestRegist', requestData);
        if (response.data.success) {
            alert('검사 결과가 성공적으로 등록되었습니다.');
            fetchInspWaitList(); // 목록 갱신
            handleClear(); // 폼 초기화
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
    </div>
    <div>
        <div class="flex justify-end mb-4 space-x-2">
            <Button label=" 조회 " rounded @click="fetchInspWaitList" />
            <Button label=" 초기화 " severity="info" rounded @click="handleClear" />
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-2/3">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">검사 대기 목록</div>
                <DataTable :value="waitList" selectionMode="single" dataKey="자재검수번호" v-model:selection="selectedItem" @rowSelect="handleRowSelect" :paginator="true" :rows="10">
                    <Column field="자재검수번호" header="자재검수번호" style="min-width: 80px" frozen class="font-bold" />
                    <Column field="발주번호" header="발주번호" />
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

        <div class="md:w-1/3">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl mb-4">자재 입고 검사 등록</div>

                <div class="purchase-info">
                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>검사코드</label>
                            <InputText v-model="form.검사코드" readonly style="background-color: #f0f0f0" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>검사유형</label>
                            <InputText v-model="form.검사유형" readonly style="background-color: #f0f0f0" />
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>발주번호</label>
                            <InputText v-model="form.발주번호" readonly style="background-color: #f0f0f0" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>자재코드</label>
                            <InputText v-model="form.자재코드" readonly style="background-color: #f0f0f0" />
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>자재명</label>
                            <InputText v-model="form.자재명" readonly style="background-color: #f0f0f0" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>수량</label>
                            <InputText v-model="form.수량" readonly style="background-color: #f0f0f0" />
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4 my-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>검사자</label>
                            <InputText v-model="form.검사자" readonly style="background-color: #f0f0f0" />
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
                            <InputText v-model="item.검사항목" readonly style="background-color: #f0f0f0" />
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
