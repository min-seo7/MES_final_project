<script setup>
import { computed } from "vue";

// PrimeVue
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      equipmentCode: "",
      inspectionCode: "",
      inspectionType: "정기점검",
      inspectionCycle: "",
      inspectionDate: null,
      nextDate: null,
      manager: "",
      note: "",
      // 위젯 내부에선 기본 rows 안 넣음(부모가 책임짐)
      details: [],
    }),
  },
  isEdit: { type: Boolean, default: false },
});

const emit = defineEmits([
  "update:modelValue",
  "save",
  "reset",
  "open:eqPicker",
  "update",
]);

const form = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

function validate() {
  if (!form.value.equipmentCode?.trim())
    return alert("설비코드는 필수입니다."), false;
  if (!form.value.inspectionType?.trim())
    return alert("점검유형은 필수입니다."), false;
  if (!form.value.inspectionDate) return alert("점검일은 필수입니다."), false;
  if (!form.value.manager?.trim())
    return alert("점검책임자는 필수입니다."), false;
  return true;
}
function onSave() {
  if (validate()) emit("save", { ...form.value });
}
function onUpdate() {
  if (validate()) emit("update", { ...form.value });
}
// 초기화는 부모가 처리(여기서 새 배열 만들지 않음)
function onReset() {
  emit("reset");
}
</script>

<template>
  <div class="mt-8 space-y-4">
    <!-- 제목 + 버튼 -->
    <div class="flex items-center justify-between">
      <div class="font-bold text-[18px]"></div>
      <div class="flex items-center gap-2">
        <!-- 등록: 조회바인딩 시 비활성 -->
        <Button label="등록" rounded @click="onSave" :disabled="isEdit" />
        <Button label="초기화" severity="info" rounded @click="onReset" />
        <!-- 수정: 항상 활성화 -->
        <Button label="수정" rounded @click="onUpdate" />
      </div>
    </div>

    <!-- 테이블형 폼 -->
    <div class="border rounded-md overflow-hidden bg-white">
      <div class="grid grid-cols-[10rem_1fr_10rem_1fr]">
        <!-- 1행: 설비코드 / 점검코드 -->
        <div
          class="bg-gray-50 border-r border-b px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          <span class="text-red-500 mr-1">*</span>설비코드
        </div>
        <div class="border-r border-b px-3 py-4 flex items-center gap-2">
          <IconField iconPosition="left" class="w-full">
            <InputText v-model="form.equipmentCode" class="w-full h-[38px]" />
            <InputIcon
              class="pi pi-search cursor-pointer"
              @click="$emit('open:eqPicker')"
            />
          </IconField>
        </div>

        <div
          class="bg-gray-50 border-r border-b px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          점검코드
        </div>
        <div class="border-b px-3 py-4 flex items-center">
          <!-- 실제 코드 표시, 없으면 '자동생성' -->
          <InputText
            :value="form.inspectionCode || '자동생성'"
            readonly
            class="w-full"
            :style="{ backgroundColor: 'lightgrey' }"
          />
        </div>

        <!-- 2행: 점검유형 / 점검주기 -->
        <div
          class="bg-gray-50 border-r border-b px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          <span class="text-red-500 mr-1">*</span>점검유형
        </div>
        <div class="border-r border-b px-3 py-4">
          <div class="flex items-center gap-6 flex-wrap text-[14px]">
            <div
              v-for="t in ['정기점검', '상시점검', '자체점검', '요청점검']"
              :key="t"
              class="flex items-center gap-2"
            >
              <RadioButton
                :inputId="t"
                :value="t"
                v-model="form.inspectionType"
              />
              <label :for="t">{{ t }}</label>
            </div>
          </div>
        </div>

        <div
          class="bg-gray-50 border-r border-b px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          점검주기
        </div>
        <div class="border-b px-3 py-4 flex items-center">
          <InputText v-model="form.inspectionCycle" class="w-full h-[38px]" />
        </div>

        <!-- 3행: 점검일 / 다음예정일 -->
        <div
          class="bg-gray-50 border-r border-b px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          <span class="text-red-500 mr-1">*</span>점검일
        </div>
        <div class="border-r border-b px-3 py-4 flex items-center">
          <Calendar
            v-model="form.inspectionDate"
            dateFormat="yy-mm-dd"
            showIcon
            iconDisplay="input"
            class="w-48 h-[38px]"
          />
        </div>

        <div
          class="bg-gray-50 border-r border-b px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          다음예정일
        </div>
        <div class="border-b px-3 py-4 flex items-center">
          <Calendar
            v-model="form.nextDate"
            dateFormat="yy-mm-dd"
            showIcon
            iconDisplay="input"
            class="w-48 h-[38px]"
          />
        </div>

        <!-- 4행: 점검책임자 / 비고 -->
        <div
          class="bg-gray-50 border-r border-b px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          <span class="text-red-500 mr-1">*</span>점검책임자
        </div>
        <div class="border-r border-b px-3 py-4 flex items-center">
          <InputText v-model="form.manager" class="w-full h-[38px]" />
        </div>

        <div
          class="bg-gray-50 border-r border-b px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          비고
        </div>
        <div class="border-b px-3 py-4 flex items-center">
          <InputText v-model="form.note" class="w-full h-[38px]" />
        </div>

        <!-- 점검내용 영역 -->
        <div
          class="bg-gray-50 border-r px-3 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"
        >
          점검내용
        </div>

        <div class="col-span-3 px-0 py-0">
          <div class="border border-gray-300 overflow-hidden">
            <!-- 헤더 -->
            <div
              class="grid bg-gray-50 text-[14px] font-medium border-b border-l border-r"
              style="grid-template-columns: 1fr 1fr 1fr"
            >
              <div class="border-r px-4 py-3 text-center">점검항목</div>
              <div class="border-r px-4 py-3 text-center">점검결과</div>
              <div class="px-4 py-3 text-center">조치사항</div>
            </div>

            <!-- 단일 입력행 -->
            <div
              class="grid items-center border-t border-l border-r"
              style="grid-template-columns: 1fr 1fr 1fr"
            >
              <div class="border-r px-3 py-3">
                <InputText
                  v-model="form.details[0].item"
                  class="w-full h-[38px] text-[15px]"
                />
              </div>
              <div class="px-3 py-3 flex justify-center gap-6">
                <div
                  v-for="r in ['양호', '주의', '불량']"
                  :key="r"
                  class="flex items-center gap-2"
                >
                  <RadioButton
                    :inputId="r"
                    :value="r"
                    v-model="form.details[0].result"
                  />
                  <label :for="r" class="text-[15px]">{{ r }}</label>
                </div>
              </div>
              <div class="border-l px-3 py-3">
                <InputText
                  v-model="form.details[0].action"
                  class="w-full h-[38px] text-[15px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
