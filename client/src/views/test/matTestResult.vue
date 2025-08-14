<script setup>
import { ref, onBeforeMount } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import axios from 'axios';

const productinspec = ref([]);
const selectedItem = ref(null); // 선택된 항목
const showDetail = ref(false); // 모달 표시 여부

const fetchInspFinList = async () => {
    try {
        const response = await axios.get('/api/test/matTestResult');
        productinspec.value = response.data;
        console.log('대기목록로드:', productinspec.value);
    } catch (err) {
        console.error('대기목록조회실패.', err);
    }
};
onBeforeMount(() => {
    fetchInspFinList();
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
            <DataTable :value="productinspec" selectionMode="single" dataKey="자재검수번호" @rowSelect="handleRowSelect" :selection="selectedItem" @update:selection="(val) => (selectedItem = val)" :paginator="true" :rows="6">
                <Column field="자재검수번호" header="자재검수번호" style="min-width: 80px" frozen class="font-bold" />
                <Column field="발주번호" header="발주번호" />
                <Column field="자재코드" header="자재코드" />
                <Column field="자재명" header="자재명" />
                <Column field="수량_EA" header="수량(EA)" />
                <Column field="등록날짜" header="등록날짜" />
                <Column field="검사결과" header="검사결과" />
                <Column field="검사완료날짜" header="검사완료날짜" />
            </DataTable>
        </div>
    </div>
    <!-- 상세모달 -->
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
