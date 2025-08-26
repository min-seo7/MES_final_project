<script setup>
import { ref } from "vue";
import axios from "axios";

const emit = defineEmits(["submit", "clear"]);

const search = ref({ insp_code: "" });

function onSubmit() {
  emit("submit", { ...search.value });
}
function onClear() {
  search.value = { insp_code: "" };
  emit("clear");
}

// --------------------
// 모달 + 페이지네이션
// --------------------
const showPicker = ref(false);
const pickerList = ref([]);
const selected = ref("");
const page = ref(1);
const total = ref(0);
const size = 5;

async function openPicker() {
  await fetchPicker(1);
  showPicker.value = true;
}

async function fetchPicker(p) {
  try {
    page.value = p;
    const { data } = await axios.get("/api/equipment/inspection/distinct", {
      params: { field: "insp_code", page: p, size },
    });
    pickerList.value = data?.items ?? [];
    total.value = data?.total ?? pickerList.value.length;
  } catch (e) {
    pickerList.value = [];
    total.value = 0;
  }
}

function confirmSelect() {
  if (selected.value) {
    search.value.insp_code = selected.value;
  }
  showPicker.value = false;
}
</script>

<template>
  <div class="space-y-2">
    <!-- 조회 / 초기화 -->
    <div class="flex items-center justify-between">
      <div class="font-bold text-[18.5px]">설비점검 조회</div>
      <div class="flex items-center gap-2">
        <Button label="조회" rounded @click="onSubmit" />
        <Button label="초기화" severity="info" rounded @click="onClear" />
      </div>
    </div>

    <!-- 검색창 -->
    <div class="flex items-center gap-2 border rounded-md p-4 bg-white mt-2">
      <label class="whitespace-nowrap">점검코드</label>
      <IconField iconPosition="left">
        <InputText v-model="search.insp_code" class="w-56" />
        <InputIcon class="pi pi-search cursor-pointer" @click="openPicker" />
      </IconField>
    </div>

    <!-- 모달 -->
    <!-- 모달: 라디오 + 페이지네이션(모달 내부만) + 중앙 선택완료 -->
    <Dialog
      v-model:visible="showPicker"
      header="점검코드"
      :modal="true"
      :style="{ width: '30rem' }"
    >
      <!-- 리스트 -->
      <ul class="divide-y">
        <li
          v-for="(code, idx) in pickerList"
          :key="idx"
          class="p-2 flex items-center gap-3 cursor-pointer"
          @click="selected = code"
        >
          <RadioButton
            :inputId="`insp_${idx}`"
            name="insp_pick"
            :value="code"
            v-model="selected"
          />
          <label :for="`insp_${idx}`" class="truncate">{{ code }}</label>
        </li>

        <li
          v-if="pickerList.length === 0"
          class="p-4 text-center text-gray-500"
        >
          항목 없음
        </li>
      </ul>

      <!-- 하단 컨트롤: 선택완료(정중앙, 14px) + 페이지네이션(오른쪽, 14px) -->
      <div class="relative mt-3 min-h-[42px]">
        <!-- 중앙 버튼 -->
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
