<script setup>
import { ref, defineProps, watch, defineEmits } from "vue"; // defineEmits 추가
import axios from "axios";
import CommonModal from "@/components/common/modal.vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import RadioButton from "primevue/radiobutton";

const props = defineProps({
  detailData: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["resetBomDetail"]); // emits 정의

const item = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref("");
const selectedItem = ref(null);

const form = ref({
  bomId: "",
  prodId: "",
  prodName: "",
  prodForm: "",
  prodType: "",
  status: "",
});

// 모달 열기
const openModal = async (type) => {
  modalType.value = type;
  showModal.value = true;
  selectedItem.value = null;

  if (type === "productId") {
    const res = await axios.get("/api/information/flowchart/getProductId");
    item.value = res.data.map((item, index) => ({
      num: index + 1,
      prodId: item.product_id,
      prodName: item.product_name,
      prodType: item.product_type,
      prodForm: item.product_form,
    }));
    columns.value = [
      { field: "prodId", header: "제품코드" },
      { field: "prodName", header: "제품명" },
      { field: "prodType", header: "제품유형" },
      { field: "prodForm", header: "제품형태" },
    ];
  }
};

// 모달 선택 완료
const selectModalValue = () => {
  if (!selectedItem.value) {
    alert("선택된 항목이 없습니다.");
    return;
  }

  form.value.prodId = selectedItem.value.prodId;
  form.value.prodName = selectedItem.value.prodName;

  showModal.value = false;
};

watch(
  () => props.items,
  (newVal) => {
    if (newVal && newVal.length) {
      form.value = { ...newVal[0], bomId: newVal[0].bomId?.trim() || "" };
    } else {
      form.value = {
        bomId: "",
        prodId: "",
        prodType: "",
        status: "",
      };
    }
  },
  { immediate: true }
);

const registBom = async () => {
  if (!form.value.prodId) {
    alert("제품코드를 선택해주세요.");
    return;
  }
  if (!form.value.status) {
    alert("상태를 선택해주세요.");
    return;
  }
  if (props.detailData.length === 0) {
    alert("BOM 상세 항목을 추가해주세요.");
    return;
  }

  try {
    const payload = {
      bomInfo: {
        // 서버에서 받을 기본 정보
        bomId: form.value.bomId,
        prodId: form.value.prodId,
        prodName: form.value.prodName,
        prodType: form.value.prodType,
        status: form.value.status,
      },
      bomDetails: props.detailData, // 서버에서 받을 상세 리스트
    };

    const res = await axios.post("/api/information/bom", payload, {
      headers: { "Content-Type": "application/json" },
    });

    // 폼 초기화
    form.value = {
      bomId: "",
      prodId: "",
      prodName: "",
      prodForm: "",
      prodType: "",
      status: "",
    };

    // 부모 컴포넌트에 bomDetailData 초기화를 요청하는 이벤트 발생
    emits("resetBomDetail");

    alert("등록이 완료되었습니다.");
  } catch (err) {
    alert("등록할 수 없습니다.");
  }
};

const modifyBom = async () => {
  try {
    const res = await axios.post("/api/information/bom/modify", form.value);
    alert("수정이 완료되었습니다.");
  } catch (err) {
    alert("수정할 수 없습니다.");
  }
};

const resetRegist = () => {
  if (form.value.bomId?.trim()) {
    // 수정 상태: 현재 선택된 데이터를 다시 form에 반영
    if (props.items && props.items.length) {
      form.value = {
        ...props.items[0],
        bomId: props.items[0].bomId?.trim() || "",
      };
    }
  } else {
    // 등록 상태: 전체 필드 초기화
    form.value = {
      bomId: "",
      prodId: "",
      prodName: "",
      prodForm: "",
      prodType: "",
      status: "",
    };
  }
};
</script>

<template>
  <div class="flex items-center justify-between font-semibold text-xl mb-1">
    <div>등록</div>
    <div class="space-x-2">
      <Button
        label=" 등록 "
        size="small"
        rounded
        @click="registBom()"
        :disabled="form.bomId?.trim() !== ''"
      />
      <Button
        label=" 수정 "
        size="small"
        rounded
        :disabled="form.bomId?.trim() === ''"
        @click="modifyBom()"
      />
      <Button
        label=" 초기화 "
        size="small"
        severity="info"
        rounded
        @click="resetRegist()"
      />
    </div>
  </div>
  <div class="card border rounded mb-2">
    <div class="flex flex-col md:flex-row gap-2">
      <div class="w-1/4">
        <label class="block text-sm mb-1">BOM코드</label>
        <InputText
          v-model="form.bomId"
          class="w-full h-8"
          readonly="true"
          placeholder="자동생성"
          style="background-color: lightgrey"
        />
      </div>

      <div class="w-1/4">
        <label class="block text-sm mb-1">제품코드</label>
        <IconField iconPosition="left" class="w-full">
          <InputText v-model="form.prodId" class="w-full h-8" />
          <InputIcon class="pi pi-search" @click="openModal('productId')" />
        </IconField>
      </div>
      <div class="w-1/4">
        <label class="block text-sm mb-1">제품명</label>
        <InputText v-model="form.prodName" class="w-full h-8" />
      </div>

      <div class="w-1/4">
        <label class="block text-sm mb-1">상태</label>
        <div class="flex items-center border rounded px-1 h-8">
          <div class="flex items-center mr-2">
            <RadioButton
              id="status1"
              name="status"
              value="사용"
              v-model="form.status"
            />
            <label for="status1" class="ml-1 text-sm">사용</label>
          </div>
          <div class="flex items-center">
            <RadioButton
              id="status2"
              name="status"
              value="미사용"
              v-model="form.status"
            />
            <label for="status2" class="ml-1 text-sm">미사용</label>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CommonModal
    v-model:visible="showModal"
    :modalType="modalType"
    :items="item"
    :columns="columns"
    v-model:selectedItem="selectedItem"
    @confirm="selectModalValue"
  />
</template>

<style scoped>
/* 기존 스타일 */
.card {
  margin-bottom: 0 !important; /* 이 스타일을 유지하여 다른 곳에서 영향을 받지 않도록 합니다. */
}
</style>
