<script setup>
import { ref } from 'vue';

const props = defineProps({
  // [{ eq_id, eq_type, eq_name, loc }, ...]
  pickerData: { type: Array, default: () => [] }
});

const emit = defineEmits(['submit', 'clear']);

const search = ref({
  eq_id: '',
  eq_type: '',
  eq_name: '',
  loc: '',
  status: '사용'
});

function onSubmit() { emit('submit', { ...search.value }); }
function onClear()  {
  search.value = { eq_id:'', eq_type:'', eq_name:'', loc:'', status:'사용' };
  emit('clear');
}

/* -------- 돋보기 모달 제어(위젯 내부 처리) -------- */
const showPicker = ref(false);
const pickerList = ref([]); // string[]
let currentField = '';      // 'eq_id' | 'eq_type' | 'eq_name' | 'loc'

const unique = (arr) => [...new Set(arr)];

function openPicker(field) {
  currentField = field;
  if (!props.pickerData.length) return;
  // 해당 필드 값만 뽑아서 중복 제거
  pickerList.value = unique(props.pickerData.map(i => i[field]));
  showPicker.value = true;
}
function selectPicker(val) {
  if (!currentField) return;
  // 선택된 값 → 해당 입력칸만 채움
  search.value[currentField] = val;
  showPicker.value = false;
}
</script>

<template>
  <div class="space-y-2">
    <!-- 제목/버튼 -->
    <div class="flex items-center justify-between">
      <div class="font-bold text-[17px]">조회</div>
      <div class="flex items-center gap-2">
        <Button label="조회" rounded @click="onSubmit" />
        <Button label="초기화" severity="info" rounded @click="onClear" />
      </div>
    </div>

    <!-- 검색 라인 -->
    <div class="flex items-center gap-6 border rounded-md p-4 bg-white mt-2 flex-wrap">
      <!-- 설비코드 -->
      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">설비코드</label>
        <IconField iconPosition="left">
          <InputText v-model="search.eq_id" class="w-56" />
          <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('eq_id')" />
        </IconField>
      </div>

      <!-- 설비유형 -->
      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">설비유형</label>
        <IconField iconPosition="left">
          <InputText v-model="search.eq_type" class="w-56" />
          <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('eq_type')" />
        </IconField>
      </div>

      <!-- 설비명 -->
      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">설비명</label>
        <IconField iconPosition="left">
          <InputText v-model="search.eq_name" class="w-56" />
          <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('eq_name')" />
        </IconField>
      </div>

      <!-- 설비위치 -->
      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">설비위치</label>
        <IconField iconPosition="left">
          <InputText v-model="search.loc" class="w-56" />
          <InputIcon class="pi pi-search cursor-pointer" @click="openPicker('loc')" />
        </IconField>
      </div>

      <!-- 설비상태 -->
      <div class="flex items-center gap-2">
        <label class="whitespace-nowrap">설비상태</label>
        <div class="flex items-center gap-4">
          <RadioButton inputId="st1" name="eq_status" value="사용" v-model="search.status" />
          <label for="st1">사용</label>
          <RadioButton inputId="st2" name="eq_status" value="미사용" v-model="search.status" />
          <label for="st2">미사용</label>
        </div>
      </div>
    </div>

    <!-- 돋보기 목록 모달 -->
    <Dialog v-model:visible="showPicker" header="검색 목록" :modal="true" :style="{ width: '28rem' }">
      <ul>
        <li v-for="(v, i) in pickerList" :key="i"
            class="p-2 border-b hover:bg-gray-100 cursor-pointer"
            @click="selectPicker(v)">
          {{ v }}
        </li>
      </ul>
    </Dialog>
  </div>
</template>
