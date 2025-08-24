<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['submit', 'clear'])

const search = ref({ eq_id: '' })

// 모달
const showPicker = ref(false)
const picker = {
  page: ref(1), size: 5, total: ref(0), list: ref([]), selected: ref('')
}

/* 조회 */
function onSubmit() {
  if (!search.value.eq_id?.trim()) return alert('설비코드를 선택하세요.')
  emit('submit', { ...search.value })
}

/* 초기화 */
function onClear() {
  search.value = { eq_id: '' }
  emit('clear')
}

/* 돋보기 열기 */
async function openPicker() {
  picker.selected.value = search.value.eq_id || ''
  await fetchPage(1)
  showPicker.value = true
}

/* 모달 데이터 로드 */
async function fetchPage(p) {
  picker.page.value = p
  try {
    const { data } = await axios.get('/api/equipment/info2/distinct', {
      params: { field: 'equipment_id', page: p, size: picker.size }
    })
    picker.list.value = data?.items ?? []
    picker.total.value = data?.total ?? 0
  } catch (e) {
    console.error('[fetchPage] 실패', e)
    picker.list.value = []
  }
}

/* 선택완료 */
function selectComplete() {
  if (!picker.selected.value) return alert('설비코드를 선택하세요.')
  search.value.eq_id = picker.selected.value
  showPicker.value = false
}
</script>

<template>
  <div class="flex items-center justify-between mb-2">
    <div class="font-bold text-[18.5px]">조회</div>
    <div class="flex gap-2">
      <Button label="조회" rounded @click="onSubmit" />
      <Button label="초기화" severity="info" rounded @click="onClear" />
    </div>
  </div>

  <!-- 🔹 왼쪽 정렬 -->
  <div class="flex justify-start border p-4 rounded-md bg-white">
    <div class="flex items-center gap-2">
      <label class="w-20 text-left">설비코드</label>
      <div class="relative w-80">
        <InputText v-model="search.eq_id" readonly class="w-full pr-10" />
        <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
           @click="openPicker"></i>
      </div>
    </div>
  </div>

  <!-- 모달 -->
  <Dialog v-model:visible="showPicker" header="설비코드 선택" modal :style="{ width: '30rem' }">
    <ul class="divide-y">
      <li v-for="(code, idx) in picker.list.value" :key="idx"
          class="p-2 flex items-center gap-3 cursor-pointer"
          @click="picker.selected.value = code">
        <RadioButton :inputId="`eq_${idx}`" :value="code" v-model="picker.selected.value" />
        <label :for="`eq_${idx}`">{{ code }}</label>
      </li>
      <li v-if="!picker.list.value.length" class="p-4 text-center text-gray-500">항목 없음</li>
    </ul>

    <div class="flex justify-between items-center mt-3 text-sm">
      <Button label="이전" text @click="fetchPage(picker.page.value - 1)" :disabled="picker.page.value <= 1" />
      <Button label="선택완료" @click="selectComplete" />
      <Button label="다음" text @click="fetchPage(picker.page.value + 1)"
              :disabled="picker.page.value * picker.size >= picker.total.value" />
    </div>
  </Dialog>
</template>

