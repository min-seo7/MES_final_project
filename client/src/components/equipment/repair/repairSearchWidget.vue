<script setup>
import { ref } from "vue";
import axios from "axios";

const emit = defineEmits(["submit", "clear"]);
const search = ref({ repairCode: "" });

// 조회 버튼
function onSubmit() {
  emit("submit", { repair_id: search.value.repairCode?.trim() || null });
}

// 초기화 버튼
function onClear() {
  search.value = { repairCode: "" };
  emit("clear");
}

// --------- 모달 + 페이지네이션 ----------
const showPicker = ref(false);
const pickerList = ref([]);
const selected = ref("");
const page = ref(1);
const total = ref(0);
const size = 10;

async function openPicker() {
  await fetchPicker(1);
  showPicker.value = true;
}

async function fetchPicker(p) {
  try {
    page.value = p;
    const { data } = await axios.get("/api/equipment/repair/distinct", {
      params: { field: "repair_id", page: p, size },
    });
    pickerList.value = data?.items ?? [];
    total.value = data?.total ?? pickerList.value.length;
  } catch {
    pickerList.value = [];
    total.value = 0;
  }
}

function confirmSelect() {
  if (selected.value) search.value.repairCode = selected.value;
  showPicker.value = false;
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <div class="font-bold text-[18.5px]">설비수리 등록/수정</div>
      <div class="flex items-center gap-2">
        <Button label="조회" rounded @click="onSubmit" />
        <Button label="초기화" severity="info" rounded @click="onClear" />
      </div>
    </div>

    <div class="flex items-center gap-2 border rounded-md p-4 bg-white mt-2">
      <label class="whitespace-nowrap">수리코드</label>
      <IconField iconPosition="left">
        <InputText v-model="search.repairCode" class="w-56" />
        <InputIcon class="pi pi-search cursor-pointer" @click="openPicker" />
      </IconField>
    </div>

    <Dialog
      v-model:visible="showPicker"
      header="수리코드 선택"
      :modal="true"
      :style="{ width: '30rem' }"
    >
      <ul class="divide-y">
        <li
          v-for="(code, idx) in pickerList"
          :key="idx"
          class="p-2 flex items-center gap-3 cursor-pointer"
          @click="selected = code"
        >
          <RadioButton
            :inputId="`repair_${idx}`"
            name="repair_pick"
            :value="code"
            v-model="selected"
          />
          <label :for="`repair_${idx}`" class="truncate">{{ code }}</label>
        </li>
        <li
          v-if="pickerList.length === 0"
          class="p-4 text-center text-gray-500"
        >
          항목 없음
        </li>
      </ul>

      <div class="relative mt-3 min-h-[42px]">
        <div class="absolute left-1/2 -translate-x-1/2">
          <Button label="선택완료" class="text-[14px]" @click="confirmSelect" />
        </div>
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
