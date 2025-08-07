<script setup>
import { ref, onBeforeMount } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import Paginator from 'primevue/paginator';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

const customers2 = ref([]);
const selectedItem = ref(null); // 선택된 항목

// 오른쪽 폼 바인딩용
const form = ref({
    검사코드: '',
    검사유형: '',
    발주번호: '',
    자재코드: '',
    자재명: '',
    수량: '',
    담당자: '',
    비고: '',
    측정값리스트: Array.from({ length: 5 }, () => ({
        허용범위: '기본범위',
        측정값: '',
        판정: ''
    }))
});

onBeforeMount(() => {
    customers2.value = [
        {
            name: 'MI001',
            id: '부엽토',
            발주번호: 'PO001',
            자재코드: 'M001',
            자재명: '부엽토',
            수량: 100,
            등록날짜: '2025-08-07',
            상태: '대기',
            검사결과: '-',
            검사완료날짜: '-'
        },
        {
            name: 'MI002',
            id: 'EM 발효액',
            발주번호: 'PO002',
            자재코드: 'M002',
            자재명: 'EM 발효액',
            수량: 200,
            등록날짜: '2025-08-05',
            상태: '대기',
            검사결과: '-',
            검사완료날짜: '-'
        },
        {
            name: 'MI003',
            id: '막걸리',
            발주번호: 'PO003',
            자재코드: 'M003',
            자재명: '막걸리',
            수량: 300,
            등록날짜: '2025-08-05',
            상태: '대기',
            검사결과: '-',
            검사완료날짜: '-'
        },
        {
            name: 'MI004',
            id: '톱밥',
            발주번호: 'PO004',
            자재코드: 'M004',
            자재명: '톱밥',
            수량: 240,
            등록날짜: '2025-08-05',
            상태: '대기',
            검사결과: '-',
            검사완료날짜: '-'
        },
        {
            name: 'MI005',
            id: '깻묵',
            발주번호: 'PO005',
            자재코드: 'M005',
            자재명: '깻묵',
            수량: 250,
            등록날짜: '2025-08-05',
            상태: '대기',
            검사결과: '-',
            검사완료날짜: '-'
        },
        {
            name: 'MI006',
            id: '포대',
            발주번호: 'PO006',
            자재코드: 'M006',
            자재명: '포대',
            수량: 600,
            등록날짜: '2025-08-05',
            상태: '대기',
            검사결과: '-',
            검사완료날짜: '-'
        }
    ];
});

// 항목 선택 시 폼에 바인딩
const handleRowSelect = (e) => {
    const item = e.data;
    selectedItem.value = item;
    form.value = {
        검사코드: item.name,
        검사유형: '입고검사',
        발주번호: item.발주번호,
        자재코드: item.자재코드,
        자재명: item.자재명,
        수량: item.수량,
        담당자: '홍길동',
        비고: '',
        측정값리스트: Array.from({ length: 5 }, () => ({
            검사항목: '',
            허용범위: '?',
            측정값: '',
            판정: ''
        }))
    };
};
</script>

<template>
    <div>
        <div class="font-semibold text-2xl mb-4">검사등록</div>
    </div>
    <div>
        <div class="flex justify-end mb-4 space-x-2">
            <Button label=" 조회 " rounded />
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
                <DataTable :value="customers2" selectionMode="single" dataKey="name" @rowSelect="handleRowSelect" :selection="selectedItem" @update:selection="(val) => (selectedItem = val)">
                    <Column field="name" header="자재검수번호" style="min-width: 80px" frozen class="font-bold" />
                    <Column field="발주번호" header="발주번호" />
                    <Column field="자재코드" header="자재코드" />
                    <Column field="자재명" header="자재명" />
                    <Column field="수량" header="수량(EA)" />
                    <Column field="등록날짜" header="등록날짜" />
                    <Column field="상태" header="상태" />
                    <Column field="검사결과" header="검사결과" />
                    <Column field="검사완료날짜" header="검사완료날짜" />
                </DataTable>
                <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
            </div>
        </div>

        <!-- 오른쪽 검사 등록 폼 -->
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
                            <Button label=" 등록 " rounded />
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
