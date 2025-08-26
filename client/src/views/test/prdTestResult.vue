<script setup>
import { ref, onBeforeMount } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Toolbar from "primevue/toolbar";
import axios from "axios";
// import { getJudgment } from '@/math.js';

const prdInspecList = ref([]);
const selectedItem = ref(null);
const showDetail = ref(false);

const filterPerfCode = ref("");
const filterProductCode = ref("");

const detailInspectionItems = ref([]);

const addUniqueKey = (data) => {
  return data.map((item, index) => ({
    ...item,
    _key: `${item.실적코드}-${index}`,
  }));
};

const fetchPrdInspFinList = async () => {
  try {
    const params = {
      perfCode: filterPerfCode.value,
      productCode: filterProductCode.value,
    };
    const response = await axios.get("/api/test/prdTestResult", { params });
    if (Array.isArray(response.data)) {
      prdInspecList.value = addUniqueKey(response.data);
    } else {
      console.error("API response format is incorrect.");
      prdInspecList.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch product inspection completion list.", err);
    prdInspecList.value = [];
  }
};

onBeforeMount(fetchPrdInspFinList);

const resetFilters = () => {
  filterPerfCode.value = "";
  filterProductCode.value = "";
  fetchPrdInspFinList();
};

const handleRowSelect = async (e) => {
  selectedItem.value = e.data;
  showDetail.value = true;

  try {
    const response = await axios.get("/api/test/prdTestResult/detail", {
      params: { inspNum: e.data.실적코드 },
    });
    detailInspectionItems.value = response.data;
  } catch (err) {
    console.error("Failed to load detailed inspection items:", err);
    detailInspectionItems.value = [];
  }
};
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between text-xl mb-4">
      <h4>제품품질검사 결과</h4>
      <div class="space-x-1">
        <Button
          label="조회"
          class="text-xs px-2 py-1 h-[28px]"
          rounded
          @click="fetchPrdInspFinList"
        />
        <Button
          label="초기화"
          class="text-xs px-2 py-1 h-[28px]"
          rounded
          severity="info"
          @click="resetFilters"
        />
      </div>
    </div>

    <Toolbar class="p-2 mb-4">
      <template #center>
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <label for="perfCode" class="whitespace-nowrap">실적코드</label>
            <InputText
              id="perfCode"
              type="text"
              v-model="filterPerfCode"
              placeholder="검색"
              class="h-8 text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label for="productCode" class="whitespace-nowrap">제품코드</label>
            <InputText
              id="productCode"
              type="text"
              v-model="filterProductCode"
              placeholder="검색"
              class="h-8 text-sm"
            />
          </div>
        </div>
      </template>
    </Toolbar>

    <div class="card p-4">
      <div class="font-semibold text-base mb-2">검사 완료 목록</div>
      <DataTable
        :value="prdInspecList"
        selectionMode="single"
        dataKey="_key"
        @rowSelect="handleRowSelect"
        v-model:selection="selectedItem"
        :paginator="true"
        :rows="6"
        class="compact-table"
      >
        <Column field="실적코드" header="실적코드" />
        <Column field="제품코드" header="제품코드" />
        <Column field="제품명" header="제품명" />
        <Column field="생산수량" header="생산수량" />
        <Column field="실적등록날짜" header="실적등록날짜" />
        <Column field="검사결과" header="검사결과" />
        <Column field="검사완료날짜" header="검사완료날짜" />
        <Column field="검사자" header="검사자" />
      </DataTable>
    </div>

    <Dialog
      v-model:visible="showDetail"
      header="검사 성적서"
      modal
      style="width: 700px"
    >
      <div class="border rounded-md">
        <table class="border-collapse w-full text-sm">
          <tbody>
            <tr>
              <td class="border p-2 bg-gray-100 font-medium w-1/4">종합판정</td>
              <td class="border p-2" colspan="3">
                {{ selectedItem?.검사결과 }}
              </td>
            </tr>
            <tr>
              <td class="border p-2 bg-gray-100 font-medium">실적코드</td>
              <td class="border p-2">{{ selectedItem?.실적코드 }}</td>
              <td class="border p-2 bg-gray-100 font-medium">제품코드</td>
              <td class="border p-2">{{ selectedItem?.제품코드 }}</td>
            </tr>
            <tr>
              <td class="border p-2 bg-gray-100 font-medium">제품명</td>
              <td class="border p-2">{{ selectedItem?.제품명 }}</td>
              <td class="border p-2 bg-gray-100 font-medium">생산수량</td>
              <td class="border p-2">{{ selectedItem?.생산수량 }}</td>
            </tr>
            <tr>
              <td class="border p-2 bg-gray-100 font-medium">검사자</td>
              <td class="border p-2">{{ selectedItem?.검사자 || "-" }}</td>
              <td class="border p-2 bg-gray-100 font-medium">검사일시</td>
              <td class="border p-2">{{ selectedItem?.검사완료날짜 }}</td>
            </tr>
          </tbody>
        </table>

        <table class="border-collapse w-full text-sm mt-4">
          <thead>
            <tr>
              <th class="border p-2 bg-gray-100 font-medium w-12">NO.</th>
              <th class="border p-2 bg-gray-100 font-medium">검사항목</th>
              <th class="border p-2 bg-gray-100 font-medium">
                기준치/허용범위
              </th>
              <th class="border p-2 bg-gray-100 font-medium">측정치</th>
              <th class="border p-2 bg-gray-100 font-medium">판정</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in detailInspectionItems" :key="index">
              <td class="border p-2 text-center">{{ index + 1 }}</td>
              <td class="border p-2">{{ item.검사항목 }}</td>
              <td class="border p-2">{{ item.허용범위 }}</td>
              <td class="border p-2">{{ item.측정값 }}</td>
              <td class="border p-2">{{ item.판정 }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-end mt-4">
        <Button
          label="닫기"
          class="text-xs px-2 py-1 h-[28px]"
          rounded
          @click="showDetail = false"
        />
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

:deep(.p-inputtext) {
    height: 28px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
} */

/* DataTable 셀 및 헤더 크기 조정 */
/* :deep(.p-datatable.compact-table .p-datatable-thead > tr > th) {
    font-size: 0.8rem;
    padding: 0.5rem;
}

:deep(.p-datatable.compact-table .p-datatable-tbody > tr > td) {
    font-size: 0.8rem;
    padding: 0.5rem;
} */

/* 다이얼로그 테이블 스타일링 */
.border-collapse {
  border-collapse: collapse;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}
</style>
