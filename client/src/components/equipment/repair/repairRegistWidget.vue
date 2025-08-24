<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'

// PrimeVue
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dialog from 'primevue/dialog'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      equipmentCode: '',
      repairCode: '',
      faultDate: null,
      restartDate: null,
      repairStartDate: null,
      repairEndDate: null,
      manager: '',
      repairReason: '',
      status: '대기',
      details: [{ item: '', result: '', action: '' }]
    })
  },
  isEdit: { type: Boolean, default: false } // 조회/바인딩 후 true
})

const emit = defineEmits(['update:modelValue','saved','updated','reset'])

const form = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

/* ===== 등록 ===== */
const registRepair = async () => {
  try {
    const body = { 
      ...form.value, 
      details: form.value.details.filter(r => r.item || r.result || r.action) 
    }
    const res = await axios.post('/api/equipment/repair/regist', body)
    alert(res.data.message || '등록 성공')
    emit('saved', res.data)   // 부모로 emit
  } catch (err) {
    console.error('등록 실패', err)
    alert('등록 실패')
  }
}

/* ===== 수정 ===== */
const updateRepair = async () => {
  try {
    const body = { 
      ...form.value, 
      details: form.value.details.filter(r => r.item || r.result || r.action) 
    }
    const res = await axios.put('/api/equipment/repair/update', body)
    alert(res.data.message || '수정 성공')
    emit('updated', res.data)
  } catch (err) {
    console.error('수정 실패', err)
    alert('수정 실패')
  }
}

/* ===== 초기화 ===== */
const onReset = () => {
  emit('reset')
}

/* ===== 설비코드 모달 ===== */
const showEqPicker = ref(false)
const eqList = ref([])
const eqSelected = ref(null)
const page = ref(1)
const total = ref(0)
const size = 5

async function openEqPicker() {
  await fetchEqList(1)
  showEqPicker.value = true
}
async function fetchEqList(p) {
  page.value = p
  const { data } = await axios.get('/api/equipment/code-list', {
    params: { page: p, size }
  })
  eqList.value = data.items || []
  total.value = data.total || 0
}
function confirmEq() {
  if (!eqSelected.value) return
  form.value.equipmentCode = eqSelected.value.eq_id
  showEqPicker.value = false
}
</script>

<template>
  <div class="mt-8 space-y-4 text-[14px]">
    <!-- 제목 + 버튼 -->
    <div class="flex items-center justify-between">
      <div class="font-bold text-[18px]">설비수리 등록/수정</div>
      <div class="flex items-center gap-2">
        <!-- ✅ 조회로 바인딩되면 등록 버튼만 disable -->
        <Button label="등록" rounded @click="registRepair" :disabled="isEdit" />
        <Button label="초기화" severity="info" rounded @click="onReset" />
        <Button label="수정" rounded @click="updateRepair" />
      </div>
    </div>

    <!-- 메인 폼 -->
    <div class="border rounded-md overflow-hidden bg-white">
      <div class="grid grid-cols-[10rem_1fr_10rem_1fr] text-[14px]">
        
        <!-- 설비코드 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 font-medium flex items-center justify-center">
          <span class="text-red-500">*</span>설비코드
        </div>
        <div class="border-r border-b px-3 py-4 flex items-center gap-2">
          <IconField iconPosition="left" class="w-full">
            <InputText v-model="form.equipmentCode" class="w-full h-[38px]" readonly />
            <InputIcon class="pi pi-search cursor-pointer" @click="openEqPicker" />
          </IconField>
        </div>

        <!-- 수리코드 (자동생성) -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 flex items-center justify-center font-medium text-[14px]">
          <span class="text-red-500">*</span>수리코드
        </div>
        <div class="border-b px-3 py-4 flex items-center">
          <InputText 
            value="자동생성" 
            readonly 
            class="w-full text-[14px]" 
            style="background-color: #d3d3d3; color: #374151; text-align: left;" 
          />
        </div>

        <!-- 비가동일시 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 font-medium flex items-center justify-center">비가동일시</div>
        <div class="border-r border-b px-3 py-4 flex items-center">
          <input type="datetime-local" v-model="form.faultDate" class="w-full h-[38px] border rounded px-2" />
        </div>

        <!-- 재가동일시 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 font-medium flex items-center justify-center">재가동일시</div>
        <div class="border-b px-3 py-4 flex items-center">
          <input type="datetime-local" v-model="form.restartDate" class="w-full h-[38px] border rounded px-2" />
        </div>

        <!-- 수리시작일 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 font-medium flex items-center justify-center">수리시작일</div>
        <div class="border-r border-b px-3 py-4 flex items-center">
          <Calendar v-model="form.repairStartDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-52 h-[38px]" />
        </div>

        <!-- 수리완료일 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 font-medium flex items-center justify-center">수리완료일</div>
        <div class="border-b px-3 py-4 flex items-center">
          <Calendar v-model="form.repairEndDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-52 h-[38px]" />
        </div>

        <!-- 수리자 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 font-medium flex items-center justify-center">수리자</div>
        <div class="border-r border-b px-3 py-4 flex items-center">
          <InputText v-model="form.manager" class="w-full h-[38px]" />
        </div>

        <!-- 수리사유 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 font-medium flex items-center justify-center">수리사유</div>
        <div class="border-b px-3 py-4 flex items-center">
          <InputText v-model="form.repairReason" class="w-full h-[38px]" />
        </div>

        <!-- 상태 -->
        <div class="bg-gray-50 border-r border-b px-3 py-4 font-medium flex items-center justify-center">상태</div>
        <div class="col-span-3 border-b px-3 py-4 flex gap-6">
          <div v-for="s in ['대기','진행중','완료']" :key="s" class="flex items-center gap-2">
            <RadioButton :inputId="s" :value="s" v-model="form.status" />
            <label :for="s">{{ s }}</label>
          </div>
        </div>

        <!-- 수리내용 -->
        <div class="bg-gray-50 border-r border-t px-3 py-4 font-medium flex items-center justify-center">수리내용</div>
        <div class="col-span-3 border-t px-0 py-0">
          <div class="border-l border-r border-gray-300">
            <div class="grid bg-gray-50 font-medium border-b" style="grid-template-columns: 1fr 1fr 1fr">
              <div class="border-r px-3 py-2 text-center">수리항목</div>
              <div class="border-r px-3 py-2 text-center">수리결과</div>
              <div class="px-3 py-2 text-center">조치사항</div>
            </div>
            <div class="grid items-center border-t" style="grid-template-columns: 1fr 1fr 1fr">
              <div class="border-r px-2 py-2">
                <InputText v-model="form.details[0].item" class="w-full h-[34px]" />
              </div>
              <div class="border-r px-2 py-2 flex justify-center gap-6">
                <div v-for="r in ['완료','진행중','부분완료']" :key="r" class="flex items-center gap-2">
                  <RadioButton :inputId="`res_${r}`" :value="r" v-model="form.details[0].result" />
                  <label :for="`res_${r}`">{{ r }}</label>
                </div>
              </div>
              <div class="px-2 py-2">
                <InputText v-model="form.details[0].action" class="w-full h-[34px]" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 설비코드 모달 -->
    <Dialog v-model:visible="showEqPicker" header="설비코드 선택" modal :style="{width:'28rem'}">
      <ul class="divide-y">
        <li v-for="(row,idx) in eqList" :key="idx"
            class="p-2 flex items-center gap-2 cursor-pointer"
            @click="eqSelected=row">
          <RadioButton :inputId="'eq_'+idx" name="eq_pick" :value="row" v-model="eqSelected"/>
          <label :for="'eq_'+idx">{{ row.eq_id }} - {{ row.eq_name }}</label>
        </li>
        <li v-if="!eqList.length" class="p-4 text-center text-gray-500">항목 없음</li>
      </ul>

      <div class="flex justify-between items-center mt-3">
        <Button label="이전" text @click="fetchEqList(page-1)" :disabled="page<=1"/>
        <span>{{ page }} / {{ Math.max(1, Math.ceil(total/size)) }}</span>
        <Button label="다음" text @click="fetchEqList(page+1)" :disabled="page*size>=total"/>
      </div>

      <div class="text-center mt-4">
        <Button label="선택완료" @click="confirmEq"/>
      </div>
    </Dialog>
  </div>
</template>
