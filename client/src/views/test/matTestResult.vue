<script setup>
import { ref, onBeforeMount } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Toolbar from 'primevue/toolbar';
import axios from 'axios';

const productinspec = ref([]);
const selectedItem = ref(null);
const showDetail = ref(false);

const filterPurchNum = ref('');
const filterMaterialCode = ref('');

// 필터에 맞게 데이터를 조회하고, 고유 키를 추가하는 함수
const fetchInspFinList = async () => {
    try {
        const params = new URLSearchParams();
        if (filterPurchNum.value) {
            params.append('purch_id', filterPurchNum.value);
        }
        if (filterMaterialCode.value) {
            params.append('material_code', filterMaterialCode.value);
        }

        const response = await axios.get(`/api/test/matTestResult?${params.toString()}`);

        if (Array.isArray(response.data)) {
            productinspec.value = response.data.map((item, index) => ({
                ...item,
                _key: `${item.구매번호}-${index}` // 고유 키 생성
            }));
        } else {
            console.error('API 응답 형식이 올바르지 않습니다.');
            productinspec.value = [];
        }
    } catch (err) {
        console.error('목록 조회 실패', err);
        productinspec.value = [];
    }
};

// 컴포넌트 마운트 전 초기 데이터 조회
onBeforeMount(fetchInspFinList);

// 행 선택 시 모달 열기
function handleRowSelect(e) {
    selectedItem.value = e.data;
    showDetail.value = true;
}

// 검색 필터 초기화
const resetFilters = () => {
    filterPurchNum.value = '';
    filterMaterialCode.value = '';
    fetchInspFinList();
};
</script>

<template>
    <div class="p-4">
        <div class="flex items-center justify-between text-xl mb-4">
            <h4>입고 검사 결과</h4>
            <div class="space-x-1">
                <Button label="조회" class="text-xs px-2 py-1 h-[28px]" rounded @click="fetchInspFinList" />
                <Button label="초기화" class="text-xs px-2 py-1 h-[28px]" rounded severity="info" @click="resetFilters" />
            </div>
        </div>

        <Toolbar class="p-2 mb-4">
            <template #center>
                <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-2">
                        <label for="purchNum" class="whitespace-nowrap">구매번호</label>
                        <InputText id="purchNum" v-model="filterPurchNum" placeholder="검색" class="h-8 text-sm" />
                    </div>
                    <div class="flex items-center gap-2">
                        <label for="materialCode" class="whitespace-nowrap">자재코드</label>
                        <InputText id="materialCode" v-model="filterMaterialCode" placeholder="검색" class="h-8 text-sm" />
                    </div>
                </div>
            </template>
        </Toolbar>

        <div class="card p-4">
            <div class="font-semibold text-base mb-2">검사 완료 목록</div>
            <DataTable :value="productinspec" selectionMode="single" dataKey="_key" @rowSelect="handleRowSelect" :paginator="true" :rows="6" class="compact-table">
                <Column field="구매번호" header="구매번호" />
                <Column field="자재코드" header="자재코드" />
                <Column field="자재명" header="자재명" />
                <Column field="수량_EA" header="수량(EA)" />
                <Column field="검사결과" header="검사결과" />
                <Column field="검사완료날짜" header="검사완료날짜" />
            </DataTable>
        </div>

        <Dialog v-model:visible="showDetail" header="검사 성적서" modal style="width: 700px">
            <div class="border rounded-md">
                <table class="border-collapse w-full text-sm">
                    <tbody>
                        <tr>
                            <td class="border p-2 bg-gray-100 font-medium w-1/4">구매번호</td>
                            <td class="border p-2" colspan="3">{{ selectedItem?.구매번호 }}</td>
                        </tr>
                        <tr>
                            <td class="border p-2 bg-gray-100 font-medium">제품/자재명</td>
                            <td class="border p-2">{{ selectedItem?.자재명 }}</td>
                            <td class="border p-2 bg-gray-100 font-medium">자재코드</td>
                            <td class="border p-2">{{ selectedItem?.자재코드 }}</td>
                        </tr>
                        <tr>
                            <td class="border p-2 bg-gray-100 font-medium">수량(EA)</td>
                            <td class="border p-2">{{ selectedItem?.수량_EA }}</td>
                            <td class="border p-2 bg-gray-100 font-medium">검사결과</td>
                            <td class="border p-2">{{ selectedItem?.검사결과 }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex justify-end mt-4">
                <Button label="닫기" class="text-xs px-2 py-1 h-[28px]" rounded @click="showDetail = false" size="small" />
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

/* :deep(.p-toolbar) {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
}

:deep(.p-toolbar .p-toolbar-group-center) {
    width: 100%;
    justify-content: center;
}

/* DataTable 행/열 크기 조정 */
/* :deep(.p-datatable.compact-table .p-datatable-thead > tr > th) {
    font-size: 0.8rem;
    padding: 0.5rem;
}

:deep(.p-datatable.compact-table .p-datatable-tbody > tr > td) {
    font-size: 0.8rem;
    padding: 0.5rem;
} */

/* Dialog의 내부 테이블 스타일 조정 */
/* .border-collapse {
    border-collapse: collapse;
}
.w-full {
    width: 100%;
}
.p-2 {
    padding: 0.5rem;
}
.bg-gray-100 {
    background-color: #f3f4f6;
}
.font-medium {
    font-weight: 500;
}
.text-sm {
    font-size: 0.875rem;
} */
</style>
