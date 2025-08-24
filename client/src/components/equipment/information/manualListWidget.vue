<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  params: { type:Object, default:()=>({ page:1, size:10 }) }
})
const rows = ref([])
const page = ref(1)
const size = ref(10)
const total = ref(0)

const totalPages = computed(()=>Math.max(1,Math.ceil(total.value/size.value||1)))

async function fetchSimple(p,s){
  const { data } = await axios.get('/api/equipment/manual-list',{ params:{ page:p,size:s }})
  rows.value = data?.items||[]
  total.value = data?.total||0
  page.value = p
  size.value = s
}
async function fetchSearch(p,s){
  const { data } = await axios.get('/api/equipment/manual-search',{ params:{...props.params,page:p,size:s}})
  rows.value = data?.items||[]
  total.value = data?.total||0
  page.value = p
  size.value = s
}

watch(()=>props.params,(p)=>{
  const has = ['equipment_id','equipment_type','equipment_name','location','status']
    .some(k=>p[k] && String(p[k]).trim()!=='')
  if(has) fetchSearch(p.page||1,p.size||10)
  else fetchSimple(p.page||1,p.size||10)
},{immediate:true,deep:true})

function prev(){ if(page.value>1) goto(page.value-1) }
function next(){ if(page.value<totalPages.value) goto(page.value+1) }
function goto(p){
  const has = ['equipment_id','equipment_type','equipment_name','location','status']
    .some(k=>props.params[k])
  if(has) fetchSearch(p,size.value)
  else fetchSimple(p,size.value)
}
</script>

<template>
  <!-- 🔹 목록 텍스트 (박스 밖) -->
  <div class="px-1 py-2 font-bold text-[18px]">목록</div>

  <!-- 🔹 테이블만 박스 -->
  <div class="border rounded-md bg-white overflow-hidden">
    <table class="w-full table-fixed border-t border-gray-200">
      <thead class="bg-gray-50 text-[14px]">
        <tr>
          <th class="h-11 text-left pl-4 border-b">설비코드</th>
          <th class="text-left border-b">설비유형</th>
          <th class="text-left border-b">설비명</th>
          <th class="text-left border-b">법적안전검사기준</th>
          <th class="text-left border-b">작동매뉴얼</th>
          <th class="text-left border-b">설비상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r,i) in rows" :key="i">
          <td class="h-11 pl-4 border-b">{{ r.equipment_id }}</td>
          <td class="border-b">{{ r.equipment_type }}</td>
          <td class="border-b">{{ r.equipment_name }}</td>

         <td class="border-b">
  <a v-if="r.operation_manual"
     :href="r.operation_manual"
     download
     class="text-blue-500 hover:underline">
     📂 파일 선택
  </a>
  <span v-else class="text-gray-400">없음</span>
</td>
          <td class="border-b">
            <a v-if="r.operation_manual" :href="r.operation_manual" target="_blank"
               class="text-blue-500 hover:underline">📂 파일 선택</a>
            <span v-else class="text-gray-400">없음</span>
          </td>
          <td class="border-b">{{ r.status }}</td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="6" class="h-16 text-center text-gray-500">데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="flex items-center justify-center gap-6 px-4 py-3 border-t bg-white">
      <Button label="이전" :disabled="page===1" @click="prev"/>
      <span>{{ page }} / {{ totalPages }}</span>
      <Button label="다음" :disabled="page>=totalPages" @click="next"/>
    </div>
  </div>
</template>