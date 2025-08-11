<script setup>
import { ref, onBeforeMount } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';

const customers2 = ref([]);
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
    측정값리스트: Array.from({ length: 5 }, () => ({
        허용범위: '기본범위',
        측정값: '',
        판정: ''
    }))
});

onBeforeMount(() => {
    customers2.value = [
        {
            실적코드: 'RES001',
            제품코드: 'pd-pow-a',
            제품명: '분말형A',
            생산수량: 120,
            실적등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            실적코드: 'RES002',
            제품코드: 'pd-pow-b',
            제품명: '분말형B',
            생산수량: 120,
            실적등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            실적코드: 'RES003',
            제품코드: 'pd-gran-a',
            제품명: '과립형A',
            생산수량: 130,
            실적등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            실적코드: 'RES004',
            제품코드: 'pd-gran-b',
            제품명: '과립형B',
            생산수량: 130,
            실적등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            실적코드: 'RES005',
            제품코드: 'pd-liq-a',
            제품명: '액상형A',
            생산수량: 100,
            실적등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            실적코드: 'RES006',
            제품코드: 'pd-liq-b',
            제품명: '액상형B',
            생산수량: 100,
            실적등록날짜: '2025-08-05',
            상태: '대기'
        }
    ];
});

// 항목 선택 시 폼에 바인딩
const handleRowSelect = (e) => {
    const item = e.data;
    selectedItem.value = item;
    form.value = {
        실적코드: item.실적코드,
        제품코드: '품질검사',
        제품명: item.제품명,
        생산수량: item.생산수량,
        실적등록날짜: item.실적등록날짜,
        불량수량: item.불량수량,
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
        <div class="font-semibold text-2xl mb-4">품질 검사 등록</div>
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
                    <Column field="실적코드" header="실적코드" style="min-width: 80px" frozen class="font-bold" />
                    <Column field="제품코드" header="제품코드" />
                    <Column field="제품명" header="제품명" />
                    <Column field="생산수량" header="생산수량" />
                    <Column field="실적등록날짜" header="실적등록날짜" />
                    <Column field="상태" header="상태" />
                </DataTable>
                <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
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
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label>불량수량</label>
                            <InputText v-model="form.불량수량" />
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
