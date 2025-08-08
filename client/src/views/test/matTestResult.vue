<script setup>
import { ref, onBeforeMount } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';

const productinspec = ref([]);
const selectedItem = ref(null); // 선택된 항목
const showDetail = ref(false); // 모달 표시 여부

onBeforeMount(() => {
    productinspec.value = [
        {
            자재검수번호: 'MI001',
            발주번호: 'PO001',
            자재코드: 'M001',
            자재명: '부엽토',
            수량: 100,
            등록날짜: '2025-08-07',
            상태: '대기'
        },
        {
            자재검수번호: 'MI002',
            발주번호: 'PO002',
            자재코드: 'M002',
            자재명: 'EM 발효액',
            수량: 200,
            등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            자재검수번호: 'MI003',
            발주번호: 'PO003',
            자재코드: 'M003',
            자재명: '막걸리',
            수량: 300,
            등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            자재검수번호: 'MI004',
            발주번호: 'PO004',
            자재코드: 'M004',
            자재명: '톱밥',
            수량: 240,
            등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            자재검수번호: 'MI005',
            발주번호: 'PO005',
            자재코드: 'M005',
            자재명: '깻묵',
            수량: 250,
            등록날짜: '2025-08-05',
            상태: '대기'
        },
        {
            자재검수번호: 'MI006',
            발주번호: 'PO006',
            자재코드: 'M006',
            자재명: '포대',
            수량: 600,
            등록날짜: '2025-08-05',
            상태: '대기'
        }
    ];
});

function handleRowSelect(e) {
    selectedItem.value = e.data; // 클릭한 항목 데이터 저장
    showDetail.value = true; // 모달 열기
}
</script>

<template>
    <div class="font-semibold text-2xl mb-4">입고 검사 결과</div>
    <div>
        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl mb-4">목록 조회</div>
            <div style="display: flex; align-items: center; gap: 20px">
                <div class="field-group">
                    <label>검수번호</label>
                    <IconField iconPosition="left">
                        <InputText type="text" placeholder="Search" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <div class="field-group">
                    <label>발주번호</label>
                    <IconField iconPosition="left">
                        <InputText type="text" placeholder="Search" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <div class="field-group">
                    <label>자재코드</label>
                    <IconField iconPosition="left">
                        <InputText type="text" placeholder="Search" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <div class="field-group">
                    <label>검사완료날짜 </label>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>
                </div>
            </div>
        </div>
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
    <div>
        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl mb-4">검사 완료 목록</div>
            <DataTable :value="productinspec" selectionMode="single" dataKey="name" @rowSelect="handleRowSelect" :selection="selectedItem" @update:selection="(val) => (selectedItem = val)">
                <Column field="자재검수번호" header="자재검수번호" style="min-width: 80px" frozen class="font-bold" />
                <Column field="발주번호" header="발주번호" />
                <Column field="자재코드" header="자재코드" />
                <Column field="자재명" header="자재명" />
                <Column field="수량" header="수량(EA)" />
                <Column field="등록날짜" header="등록날짜" />
                <Column field="검사결과" header="검사결과" />
                <Column field="검사완료날짜" header="검사완료날짜" />
            </DataTable>
            <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
        </div>
    </div>
    <!-- 상세 모달 -->
    <Dialog v-model:visible="showDetail" header="검사 성적서" modal style="width: 800px">
        <div class="border p-4">
            <table class="border-collapse border w-full text-sm">
                <tbody>
                    <tr>
                        <td class="border p-2 w-1/4">종합판정</td>
                        <td class="border p-2 w-1/4">-</td>
                        <td class="border p-2 w-1/4">검수번호</td>
                        <td class="border p-2 w-1/4">{{ selectedItem?.자재검수번호 }}</td>
                    </tr>
                    <tr>
                        <td class="border p-2">제품/자재명</td>
                        <td class="border p-2">{{ selectedItem?.자재명 }}</td>
                        <td class="border p-2">제품/자재 코드</td>
                        <td class="border p-2">{{ selectedItem?.자재코드 }}</td>
                    </tr>
                    <tr>
                        <td class="border p-2">검사자</td>
                        <td class="border p-2">-</td>
                        <td class="border p-2">생산일시</td>
                        <td class="border p-2">-</td>
                    </tr>
                    <tr>
                        <td class="border p-2">검사일시</td>
                        <td class="border p-2" colspan="3">{{ selectedItem?.검사일시 }}</td>
                    </tr>
                </tbody>
            </table>

            <table class="border-collapse border w-full text-sm mt-4">
                <thead>
                    <tr>
                        <th class="border p-2 w-12">NO.</th>
                        <th class="border p-2">검사항목</th>
                        <th class="border p-2">기준치/허용범위</th>
                        <th class="border p-2">측정치</th>
                        <th class="border p-2">합격/불합격</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in 8" :key="i">
                        <td class="border p-2">{{ i }}</td>
                        <td class="border p-2">-</td>
                        <td class="border p-2">-</td>
                        <td class="border p-2">-</td>
                        <td class="border p-2">-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Dialog>
</template>

<style scoped>
.card {
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
}
</style>
