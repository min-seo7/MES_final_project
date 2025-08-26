<script setup>
import { ref, defineEmits, onMounted } from "vue";
import axios from "axios";
import CommonModal from "@/components/common/modal.vue";

const emits = defineEmits(["employeeFilterSearch"]);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref("");
const selectedItem = ref(null);

const search = ref({
  employeeId: "",
  department: "",
  auth: "",
  status: "",
});

// 선택필터초기화
const resetSearch = () => {
  search.value.employeeId = "";
  search.value.department = "";
  search.value.auth = "";
  search.value.status = "";
  selectedItem.value = null;

  selectSearch();
  onReset();
};
const onReset = () => {
  emits("resetForm");
};

// 모달 열기
const openModal = async (type) => {
  modalType.value = type;
  showModal.value = true;
  selectedItem.value = null;

  if (type === "employeeId") {
    resetSearch();
    const res = await axios.get("/api/information/employee/getEmployeeId");
    items.value = res.data.map((item, index) => ({
      num: index + 1,
      employeeId: item.employee_id,
      name: item.name,
      department: item.department,
      status: item.status,
      auth: item.auth,
    }));
    columns.value = [
      { field: "employeeId", header: "사원번호" },
      { field: "name", header: "사원명" },
      { field: "department", header: "부서명" },
      { field: "auth", header: "권한" },
      { field: "status", header: "상태" },
    ];
  } else if (type === "department") {
    resetSearch();
    const departments = [
      "기준정보관리부",
      "영업부",
      "재고부",
      "생산부",
      "품질관리부",
      "설비부",
    ];
    items.value = departments.map((dept) => ({ deptName: dept }));
    columns.value = [{ field: "deptName", header: "부서명" }];
  }
};

// 모달 선택 완료
const selectModalValue = () => {
  if (!selectedItem.value) {
    alert("선택된 항목이 없습니다.");
    return;
  }

  search.value.employeeId = selectedItem.value.employeeId;
  search.value.department =
    selectedItem.value.department || selectedItem.value.deptName;
  search.value.auth = selectedItem.value.auth;
  search.value.status = selectedItem.value.status;

  showModal.value = false;
};

// 검색
const selectSearch = async () => {
  try {
    const payload = {
      employeeId: search.value.employeeId || null,
      department: search.value.department || null,
      auth: search.value.auth || null,
      status: search.value.status || null,
    };

    const res = await axios.post("/api/information/employee/search", payload);
    console.log(res.data.result);
    emits("employeeFilterSearch", res.data.result);
  } catch (err) {
    console.log("사원검색실패");
  }
};

onMounted(() => {
  selectSearch();
});
</script>

<template>
  <div class="flex items-center justify-between font-semibold text-xl mb-4">
    <div>사원정보</div>
    <div class="space-x-2">
      <Button label="조회" size="small" rounded @click="selectSearch"></Button>
      <Button
        label="초기화"
        size="small"
        severity="info"
        rounded
        @click="resetSearch"
      ></Button>
    </div>
  </div>

  <Toolbar>
    <template #center>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <label for="employeeId" class="whitespace-nowrap">사원번호</label>
          <IconField iconPosition="left" class="w-full">
            <InputText
              id="employeeId"
              type="text"
              class="w-60"
              v-model="search.employeeId"
            />
          </IconField>
        </div>

        <div class="flex items-center gap-2">
          <label for="department" class="whitespace-nowrap">부서명</label>
          <IconField iconPosition="left" class="w-full">
            <InputText
              id="department"
              type="text"
              class="w-60"
              v-model="search.department"
            />
            <InputIcon class="pi pi-search" @click="openModal('department')" />
          </IconField>
        </div>

        <div class="flex items-center gap-2">
          <label for="auth" class="whitespace-nowrap">권한</label>
          <div class="flex items-center">
            <div
              class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]"
            >
              <RadioButton
                id="auth1"
                name="auth"
                value="일반사원"
                v-model="search.auth"
              />
              <label for="auth1" class="ml-2 mr-4">일반사원</label>
              <RadioButton
                id="auth2"
                name="auth"
                value="관리자"
                v-model="search.auth"
              />
              <label for="auth2" class="ml-2 mr-4">관리자</label>
              <RadioButton
                id="auth3"
                name="auth"
                value="최고관리자"
                v-model="search.auth"
              />
              <label for="auth3" class="ml-2 mr-4">최고관리자</label>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label for="materialCode" class="whitespace-nowrap">상태</label>
          <div class="flex items-center">
            <div
              class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]"
            >
              <RadioButton
                id="status1"
                name="status"
                value="재직"
                v-model="search.status"
              />
              <label for="status1" class="ml-2 mr-4">재직</label>
              <RadioButton
                id="status2"
                name="status"
                value="휴직"
                v-model="search.status"
              />
              <label for="status2" class="ml-2 mr-4">휴직</label>
              <RadioButton
                id="status3"
                name="status"
                value="퇴직"
                v-model="search.status"
              />
              <label for="status3" class="ml-2">퇴직</label>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Toolbar>

  <CommonModal
    v-model:visible="showModal"
    :modalType="modalType"
    :items="items"
    :columns="columns"
    v-model:selectedItem="selectedItem"
    :showFilter="modalType === 'employeeId'"
    @confirm="selectModalValue"
  />
</template>

<style scoped>
/* --- 모달 전역 스타일 (유지) --- */
:deep(.p-dialog .p-dialog-header) {
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
}

:deep(.p-dialog .p-dialog-title) {
  font-weight: 600;
  font-size: 1.1rem;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 1.5rem;
  background: #ffffff;
}

/* --- 상단 버튼 영역 (여백 유지) --- */
.mt-5.flex.justify-center {
  padding: 0 0 1.5rem 0;
  margin: 0;
}

/* --- 데이터 테이블 스타일 --- */
:deep(.p-datatable .p-datatable-tbody) {
  min-height: 300px;
}

:deep(.p-datatable .p-datatable-tbody > tr:has(div[style="height: 30px"])) {
  display: table-row;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  text-align: center;
  font-weight: 500;
  color: #495057;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-bottom: 1px solid #e9ecef;
  text-align: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.p-datatable-wrapper) {
  border: 1px solid #dee2e6;
}

:deep(.p-datatable .p-datatable-tbody > tr:not([aria-selected="true"]):hover) {
  background-color: #f1f3f5 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr[aria-selected="true"]) {
  background-color: #e3f2fd !important;
  color: #0d47a1;
}

/* --- 페이지네이션 (유지) --- */
:deep(.p-paginator) {
  justify-content: center;
  border-top: 1px solid #dee2e6;
  margin-top: 1rem;
}

.p-datatable .p-datatable-tbody > tr {
  height: 30px !important;
  display: table;
  width: 100%;
  table-layout: fixed;
}

.p-datatable .p-datatable-tbody > tr > td {
  vertical-align: middle;
}
</style>
