<script setup>
import { ref } from 'vue';
import EquipmentMenuWidge from '@/components/equipment/information/equipmentMenuWidge.vue';

/* 예시 데이터 */
const all = ref([
    { eq_id: 'EQ-001', eq_type: '보일러', eq_name: '1호기 보일러', loc: '본관 1층', status: '사용', legal_file: '', manual_file: '' },
    { eq_id: 'EQ-002', eq_type: '펌프', eq_name: '급수펌프', loc: '지하 2층', status: '미사용', legal_file: '', manual_file: '' }
]);

const rows = ref([...all.value]);
const pickerData = all.value;

function handleSearch(q) {
    rows.value = all.value.filter(
        (r) => (!q.eq_id || r.eq_id.includes(q.eq_id)) && (!q.eq_type || r.eq_type.includes(q.eq_type)) && (!q.eq_name || r.eq_name.includes(q.eq_name)) && (!q.loc || r.loc.includes(q.loc)) && (!q.status || r.status === q.status)
    );
}
function handleClear() {
    rows.value = [...all.value];
}

/* 파일 업로드 핸들러 */
function onFileSelected(event, row, type) {
    const file = event.target.files[0];
    if (file) {
        if (type === 'legal') {
            row.legal_file = file.name;
        } else if (type === 'manual') {
            row.manual_file = file.name;
        }
    }
}
</script>

<template>
    <section class="p-6 space-y-6">
        <!-- 조회 타이틀 추가 -->
        <div class="font-bold text-[18.5px]">조회</div>

        <!-- 조회 폼 -->
        <EquipmentMenuWidge :pickerData="pickerData" @submit="handleSearch" @clear="handleClear" />

        <!-- 목록 제목 -->
        <div class="font-bold text-[17px]">목록</div>

        <!-- 목록 표 -->
        <div class="border rounded-md overflow-hidden bg-white">
            <table class="w-full text-[15px] border-collapse">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="border-r px-3 py-2 text-center">설비코드</th>
                        <th class="border-r px-3 py-2 text-center">설비유형</th>
                        <th class="border-r px-3 py-2 text-center">설비명</th>
                        <th class="border-r px-3 py-2 text-center">법적안전검사기준</th>
                        <th class="border-r px-3 py-2 text-center">작동매뉴얼</th>
                        <th class="px-3 py-2 text-center">설비상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, i) in rows" :key="i" class="border-b">
                        <td class="border-r px-3 py-2 text-center">{{ row.eq_id }}</td>
                        <td class="border-r px-3 py-2 text-center">{{ row.eq_type }}</td>
                        <td class="border-r px-3 py-2">{{ row.eq_name }}</td>

                        <!-- 법적안전검사기준: 폴더 아이콘 -->
                        <td class="border-r px-3 py-2 text-center">
                            <label class="cursor-pointer flex flex-col items-center gap-1">
                                <i class="pi pi-folder-open text-yellow-600 text-xl"></i>
                                <span class="text-xs text-gray-600 truncate w-28">{{ row.legal_file || '파일 선택' }}</span>
                                <input type="file" class="hidden" @change="(e) => onFileSelected(e, row, 'legal')" />
                            </label>
                        </td>

                        <!-- 작동매뉴얼: 폴더 아이콘 -->
                        <td class="border-r px-3 py-2 text-center">
                            <label class="cursor-pointer flex flex-col items-center gap-1">
                                <i class="pi pi-folder-open text-blue-600 text-xl"></i>
                                <span class="text-xs text-gray-600 truncate w-28">{{ row.manual_file || '파일 선택' }}</span>
                                <input type="file" class="hidden" @change="(e) => onFileSelected(e, row, 'manual')" />
                            </label>
                        </td>

                        <!-- 설비상태 -->
                        <td class="px-3 py-2 text-center">
                            <span :class="row.status === '사용' ? 'text-emerald-600' : 'text-gray-500'">
                                {{ row.status }}
                            </span>
                        </td>
                    </tr>

                    <tr v-if="rows.length === 0">
                        <td colspan="6" class="px-3 py-8 text-center text-gray-500">데이터가 없습니다.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
