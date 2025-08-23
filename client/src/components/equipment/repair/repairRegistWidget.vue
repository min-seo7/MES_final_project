<script setup>
import { computed } from 'vue'

// PrimeVue 컴포넌트
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      equipmentCode: '',
      repairCode: '',
      faultDate: null,       // 비가동일시
      restartDate: null,     // 재가동일시
      repairStartDate: null, // 수리시작일
      repairEndDate: null,   // 수리완료일
      manager: '',
      repairReason: '',
      status: '대기',
      details: []            // 수리 상세 (항목/결과/조치사항)
    })
  },
  isEdit: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue','save','reset','update','open:eqPicker'])

const form = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

function validate() {
  if (!form.value.equipmentCode?.trim()) return alert('설비코드는 필수입니다.'), false
  if (!form.value.repairCode?.trim()) return alert('수리코드는 필수입니다.'), false
  return true
}

function onSave() { if (validate()) emit('save', { ...form.value }) }
function onUpdate() { if (validate()) emit('update', { ...form.value }) }
function onReset() { emit('reset') }
</script>

<template>
  <div class="mt-8 space-y-4">
    <!-- 제목 + 버튼 -->
    <div class="flex items-center justify-between">
      <div class="font-bold text-[18px]">설비수리 등록/수정</div>
      <div class="flex items-center gap-2">
        <Button label="등록" rounded @click="onSave" :disabled="isEdit" />
        <Button label="초기화" severity="info" rounded @click="onReset" />
        <Button label="수정" rounded @click="onUpdate" />
      </div>
    </div>

    <!-- 메인 폼 -->
    <div class="border rounded-md overflow-hidden bg-white">
      <div class="grid grid-cols-[10rem_1fr_10rem_1fr]">
        
        <!-- 설비코드 / 수리코드 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 text-sm font-medium flex items-center justify-center">
          <span class="text-red-500">*</span>설비코드
        </div>
        <div class="border-r border-b px-3 py-4 flex items-center gap-2">
          <IconField iconPosition="left" class="w-full">
            <InputText v-model="form.equipmentCode" class="w-full h-[38px]" />
            <InputIcon class="pi pi-search cursor-pointer" @click="$emit('open:eqPicker')" />
          </IconField>
        </div>

        <div class="bg-gray-50 border-r border-b px-3 py-4 flex items-center justify-center text-sm font-medium">
          <span class="text-red-500">*</span>수리코드
        </div>
        <div class="border-b px-3 py-4 flex items-center">
          <InputText v-model="form.repairCode" class="w-full h-[38px]" />
        </div>

        <!-- 비가동일시 / 재가동일시 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 text-sm font-medium flex items-center justify-center">비가동일시</div>
        <div class="border-r border-b px-3 py-4 flex items-center">
          <Calendar v-model="form.faultDate" showIcon iconDisplay="input" showTime hourFormat="24" dateFormat="yy-mm-dd" class="w-60 h-[38px]" />
        </div>

        <div class="bg-gray-50 border-r border-b px-3 py-4 text-sm font-medium flex items-center justify-center">재가동일시</div>
        <div class="border-b px-3 py-4 flex items-center">
          <Calendar v-model="form.restartDate" showIcon iconDisplay="input" showTime hourFormat="24" dateFormat="yy-mm-dd" class="w-60 h-[38px]" />
        </div>

        <!-- 수리시작일 / 완료일 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 text-sm font-medium flex items-center justify-center">수리시작일</div>
        <div class="border-r border-b px-3 py-4 flex items-center">
          <Calendar v-model="form.repairStartDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-52 h-[38px]" />
        </div>

        <div class="bg-gray-50 border-r border-b px-3 py-4 text-sm font-medium flex items-center justify-center">수리완료일</div>
        <div class="border-b px-3 py-4 flex items-center">
          <Calendar v-model="form.repairEndDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-52 h-[38px]" />
        </div>

        <!-- 수리자 / 사유 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 text-sm font-medium flex items-center justify-center">수리자</div>
        <div class="border-r border-b px-3 py-4 flex items-center">
          <InputText v-model="form.manager" class="w-full h-[38px]" />
        </div>

        <div class="bg-gray-50 border-r border-b px-3 py-4 text-sm font-medium flex items-center justify-center">수리사유</div>
        <div class="border-b px-3 py-4 flex items-center">
          <InputText v-model="form.repairReason" class="w-full h-[38px]" />
        </div>

        <!-- 상태 -->
        <div class="bg-gray-50 border-r px-3 py-4 text-sm font-medium flex items-center justify-center">상태</div>
        <div class="col-span-3 border-t px-3 py-4 flex gap-6">
          <div v-for="s in ['대기','진행중','완료']" :key="s" class="flex items-center gap-2">
            <RadioButton :inputId="s" :value="s" v-model="form.status" />
            <label :for="s">{{ s }}</label>
          </div>
        </div>
      </div>
    </div>

    <!-- 상세내역 테이블 -->
    <div class="border rounded-md bg-white">
      <div class="grid bg-gray-50 text-sm font-medium border-b" style="grid-template-columns: 1fr 1fr 1fr">
        <div class="border-r px-3 py-2 text-center">수리항목</div>
        <div class="border-r px-3 py-2 text-center">수리결과</div>
        <div class="px-3 py-2 text-center">조치사항</div>
      </div>

      <div v-for="(row,idx) in form.details" :key="idx" 
           class="grid border-t items-center" 
           style="grid-template-columns: 1fr 1fr 1fr">
        
        <!-- 수리항목 -->
        <div class="border-r px-2 py-2">
          <InputText v-model="row.item" class="w-full h-[34px]" />
        </div>

        <!-- 수리결과 라디오 -->
        <div class="border-r px-2 py-2 flex justify-center gap-6">
          <div v-for="r in ['완료','진행중','부분완료']" :key="r" class="flex items-center gap-2">
            <RadioButton :inputId="`res_${idx}_${r}`" :value="r" v-model="row.result" />
            <label :for="`res_${idx}_${r}`">{{ r }}</label>
          </div>
        </div>

        <!-- 조치사항 -->
        <div class="px-2 py-2">
          <InputText v-model="row.action" class="w-full h-[34px]" />
        </div>
      </div>
    </div>
  </div>
</template>
