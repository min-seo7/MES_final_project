<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import axios from 'axios';

const productinspec = ref([]);
const selectedItem = ref(null);
const showDetail = ref(false);

// 필터 입력
const filterInspectNum = ref('');
const filterPurchNum = ref('');
const filterMaterialCode = ref('');

// 검사 완료 목록 가져오기
const fetchInspFinList = async () => {
    try {
        const params = {
            inspItem: filterInspectNum.value,
            purch_id: filterPurchNum.value,
            material_code: filterMaterialCode.value
        };
        const response = await axios.get('/api/test/matTestResult', { params });
        productinspec.value = response.data;
    } catch (err) {
        console.error('목록 조회 실패', err);
    }
};
onBeforeMount(fetchInspFinList);

// 필터 값 변경 시 목록 갱신
watch([filterInspectNum, filterPurchNum, filterMaterialCode], fetchInspFinList);

// 테이블에서 행 선택 시 상세 모달 열기
function handleRowSelect(e) {
    selectedItem.value = e.data;
    showDetail.value = true;
}
</script>

<template>
    <div class="font-semibold text-2xl mb-4">입고 검사 결과</div>

    <!-- 필터 -->
    <div class="card flex flex-col gap-4 mb-4">
        <div class="font-semibold text-xl mb-2">목록 조회</div>
        <div class="flex gap-4">
            <div class="field-group">
                <label>검수번호</label>
                <InputText v-model="filterInspectNum" placeholder="검색" />
            </div>
            <div class="field-group">
                <label>구매번호</label>
                <InputText v-model="filterPurchNum" placeholder="검색" />
            </div>
            <div class="field-group">
                <label>자재코드</label>
                <InputText v-model="filterMaterialCode" placeholder="검색" />
            </div>
        </div>
    </div>

    <!-- 검사 완료 목록 -->
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl mb-2">검사 완료 목록</div>
        <DataTable :value="productinspec" selectionMode="single" dataKey="검수번호" @rowSelect="handleRowSelect" :selection="selectedItem" @update:selection="(val) => (selectedItem = val)" :paginator="true" :rows="6">
            <Column field="검수번호" header="검수번호" />
            <Column field="구매번호" header="구매번호" />
            <Column field="자재코드" header="자재코드" />
            <Column field="자재명" header="자재명" />
            <Column field="수량_EA" header="수량(EA)" />
            <Column field="등록날짜" header="등록날짜" />
            <Column field="검사결과" header="검사결과" />
            <Column field="검사완료날짜" header="검사완료날짜" />
        </DataTable>
    </div>

    <!-- 상세 모달 (조회 전용) -->
    <Dialog v-model:visible="showDetail" header="검사 성적서" modal style="width: 800px">
        <div class="border p-4">
            <table class="border-collapse border w-full text-sm">
                <tbody>
                    <tr>
                        <td class="border p-2 w-1/4">검수번호</td>
                        <td class="border p-2" colspan="3">{{ selectedItem?.검수번호 }}</td>
                    </tr>
                    <tr>
                        <td class="border p-2">제품/자재명</td>
                        <td class="border p-2">{{ selectedItem?.자재명 }}</td>
                        <td class="border p-2">자재코드</td>
                        <td class="border p-2">{{ selectedItem?.자재코드 }}</td>
                    </tr>
                    <tr>
                        <td class="border p-2">구매번호</td>
                        <td class="border p-2">{{ selectedItem?.구매번호 }}</td>
                        <td class="border p-2">수량(EA)</td>
                        <td class="border p-2">{{ selectedItem?.수량_EA }}</td>
                    </tr>
                    <tr>
                        <td class="border p-2">등록날짜</td>
                        <td class="border p-2">{{ selectedItem?.등록날짜 }}</td>
                        <td class="border p-2">검사결과</td>
                        <td class="border p-2">{{ selectedItem?.검사결과 }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="flex justify-end mt-4">
                <Button label="닫기" @click="showDetail = false" />
            </div>
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
