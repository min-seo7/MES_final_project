<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps({
  pickerData: { type: Array, default: () => [] }, // 기존 유지(백업용)
});
const emit = defineEmits(["submit", "clear"]);

const search = ref({
  insp_code: "",
  eq_id: "",
  insp_type: "",
  insp_date: null,
  next_date: null,
});

// 조회 버튼
function onSubmit() {
  emit("submit", { ...search.value });
}
function onClear() {
  search.value = {
    insp_code: "",
    eq_id: "",
    insp_type: "",
    insp_date: null,
    next_date: null,
  };
  emit("clear");
}

/* ---------------------------
   돋보기 모달 + 페이지네이션(5개 고정)
--------------------------- */
const showPicker = ref(false);
const pickerList = ref([]);
const page = ref(1);
const total = ref(0);
const size = 5;
let currentField = "";
const selected = ref("");

async function openPicker(field) {
  currentField = field;
  selected.value = search.value[field] || "";
  await fetchPicker(1);
  showPicker.value = true;
}

async function fetchPicker(p) {
  try {
    page.value = p;
    const { data } = await axios.get("/api/equipment/inspection/distinct", {
      params: { field: currentField, page: p, size },
    });
    pickerList.value = data?.items ?? [];
    total.value = data?.total ?? pickerList.value.length;

    // fallback: props.pickerData
    if (!data) {
      const backup = [
        ...new Set(
          (props.pickerData || []).map((i) => i?.[currentField]).filter(Boolean)
        ),
      ];
      pickerList.value = backup.slice((p - 1) * size, p * size);
      total.value = backup.length;
    }
  } catch (e) {
    const backup = [
      ...new Set(
        (props.pickerData || []).map((i) => i?.[currentField]).filter(Boolean)
      ),
    ];
    pickerList.value = backup.slice((p - 1) * size, p * size);
    total.value = backup.length;
  }
}

function confirmSelect() {
  if (!currentField || !selected.value) return;
  search.value[currentField] = selected.value;
  showPicker.value = false;
}
</script>

<template>
  <div class="space-y-2">
    <!-- 상단 버튼 -->
    <div class="flex items-center justify-between">
      <div class="font-bold text-[18.5px]">설비점검 등록/수정</div>
      <div class="flex items-center gap-2">
        <Button label="조회" rounded @click="onSubmit" />
        <Button label="초기화" severity="info" rounded @click="onClear" />
      </div>
    </div>

    <!-- 검색폼 -->
    <div
      class="flex items-center gap-6 border rounded-md p-4 bg-white mt-2 flex-wrap"
    >
      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">점검코드</label>
        <IconField iconPosition="left">
          <InputText v-model="search.insp_code" class="w-56" />
          <InputIcon
            class="pi pi-search cursor-pointer"
            @click="openPicker('insp_code')"
          />
        </IconField>
      </div>

      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">설비코드</label>
        <IconField iconPosition="left">
          <InputText v-model="search.eq_id" class="w-56" />
          <InputIcon
            class="pi pi-search cursor-pointer"
            @click="openPicker('eq_id')"
          />
        </IconField>
      </div>

      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">점검유형</label>
        <IconField iconPosition="left">
          <InputText v-model="search.insp_type" class="w-56" />
          <InputIcon
            class="pi pi-search cursor-pointer"
            @click="openPicker('insp_type')"
          />
        </IconField>
      </div>

      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">점검일</label>
        <Calendar
          v-model="search.insp_date"
          dateFormat="yy-mm-dd"
          showIcon
          iconDisplay="input"
          class="w-44"
        />
      </div>

      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">점검예정일</label>
        <Calendar
          v-model="search.next_date"
          dateFormat="yy-mm-dd"
          showIcon
          iconDisplay="input"
          class="w-44"
        />
      </div>
    </div>

    <!-- 모달 -->
    <Dialog
      v-model:visible="showPicker"
      :header="
        {
          insp_code: '점검코드',
          eq_id: '설비코드',
          insp_type: '점검유형',
        }[currentField]
      "
      :modal="true"
      :style="{ width: '28rem' }"
    >
      <!-- 리스트 -->
      <ul class="divide-y">
        <li
          v-for="(v, i) in pickerList"
          :key="i"
          class="p-2 flex items-center gap-3 cursor-pointer"
          @click="selected = v"
        >
          <RadioButton
            :inputId="`pick_${i}`"
            name="picker_group"
            :value="v"
            v-model="selected"
          />
          <label :for="`pick_${i}`" class="truncate">{{ v }}</label>
        </li>
        <li
          v-if="pickerList.length === 0"
          class="p-4 text-center text-gray-500"
        >
          항목 없음
        </li>
      </ul>

      <!-- 하단: 선택완료(중앙) + 페이지네이션(오른쪽) -->
      <div class="relative mt-3 min-h-[42px]">
        <!-- 중앙 선택완료 -->
        <div class="absolute left-1/2 -translate-x-1/2">
          <Button label="선택완료" class="text-[14px]" @click="confirmSelect" />
        </div>

        <!-- 오른쪽 페이지네이션 -->
        <div class="flex items-center gap-2 justify-end text-[14px]">
          <Button
            label="이전"
            text
            @click="fetchPicker(page - 1)"
            :disabled="page <= 1"
          />
          <span>{{ page }} / {{ Math.max(1, Math.ceil(total / size)) }}</span>
          <Button
            label="다음"
            text
            @click="fetchPicker(page + 1)"
            :disabled="page * size >= total"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>
