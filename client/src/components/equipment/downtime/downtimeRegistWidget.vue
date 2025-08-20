<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const isEditing = ref(false);

/* ===== props ===== */
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            id: '', // PK (수정시에만 사용)
            equipment_id: '', // 설비코드
            repair_id: null,
            inspection_id: null,
            fault_type: '', // 비가동유형
            fault_dtime: null, // 비가동일시 (DATETIME)
            restart_dtime: null, // 재가동일시 (DATETIME)
            note: '',
            status: ''
        })
    },
    isEdit: { type: Boolean, default: false }
});

/* ===== emit ===== */
const emit = defineEmits(['update:modelValue', 'saved', 'updated', 'reset']);

/* ===== 폼 상태 ===== */
const form = ref({ ...props.modelValue });

/* 서버 DATETIME ↔︎ input[type=datetime-local] 변환 */
const toMySQLDateTime = (v) => (v ? v.replace('T', ' ') + (v.length === 16 ? ':00' : '') : null); // 한 줄 요약 변환
const toLocalDatetime = (v) => {
    // MySQL -> input용 포맷
    if (!v) return null;
    // 'YYYY-MM-DD HH:mm:ss' 혹은 Date 객체 → 'YYYY-MM-DDTHH:mm'
    const d = typeof v === 'string' ? new Date(v.replace(' ', 'T')) : new Date(v);
    if (isNaN(d)) return null;
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/* 부모가 모델 바꿨을 때 폼 동기화(+필드명 보정) */
watch(
    () => props.modelValue,
    (v) => {
        const next = { ...v };
        // 리스트에서 eq_id로 올 수 있으면 equipment_id로 보정
        if (!next.equipment_id && next.eq_id) next.equipment_id = next.eq_id;
        // 날짜 필드 로컬 포맷 보정
        next.fault_dtime = toLocalDatetime(next.fault_dtime) ?? null;
        next.restart_dtime = toLocalDatetime(next.restart_dtime) ?? null;
        form.value = next;
    },
    { deep: true }
);

/* ===== 등록 ===== */
const registDowntime = async () => {
    // 간단 검증
    if (!form.value.equipment_id?.trim()) return alert('설비코드를 선택하세요');
    if (!form.value.fault_type?.trim()) return alert('비가동유형을 선택하세요');
    if (!form.value.fault_dtime) return alert('비가동일시를 입력하세요');
    if (!form.value.status?.trim()) return alert('처리상태를 선택하세요');

    // 페이로드 변환
    const payload = {
        equipment_id: form.value.equipment_id,
        repair_id: form.value.repair_id ?? null,
        inspection_id: form.value.inspection_id ?? null,
        fault_type: form.value.fault_type,
        fault_dtime: toMySQLDateTime(form.value.fault_dtime),
        restart_dtime: toMySQLDateTime(form.value.restart_dtime),
        note: form.value.note ?? '',
        status: form.value.status
    };

    try {
        const { data } = await axios.post('/api/equipment/downtime/regist', payload);
        alert(data.message || '등록 완료');
        emit('saved', data);
    } catch (e) {
        console.error('비가동 등록 실패', e);
        alert('등록 실패');
    }
};

/* ===== 수정 ===== */
const updateDowntime = async () => {
    if (!form.value.id) return alert('수정할 항목의 id가 없습니다');

    const payload = {
        id: form.value.id,
        equipment_id: form.value.equipment_id,
        repair_id: form.value.repair_id ?? null,
        inspection_id: form.value.inspection_id ?? null,
        fault_type: form.value.fault_type,
        fault_dtime: toMySQLDateTime(form.value.fault_dtime),
        restart_dtime: toMySQLDateTime(form.value.restart_dtime),
        note: form.value.note ?? '',
        status: form.value.status
    };

    try {
        const { data } = await axios.put('/api/equipment/downtime/update', payload);
        alert(data.message || '수정 완료');
        emit('updated', data);
    } catch (e) {
        console.error('비가동 수정 실패', e);
        alert('수정 실패');
    }
};

/* ===== 초기화 ===== */
const onReset = () => {
    form.value = {
        id: '',
        equipment_id: '',
        repair_id: null,
        inspection_id: null,
        fault_type: '',
        fault_dtime: null,
        restart_dtime: null,
        note: '',
        status: ''
    };
    isEditing.value = false; // 초기화 시 등록 모드로 전환
    emit('reset');
};

/* ===== 설비코드 모달 ===== */
const showEqModal = ref(false);
const eqList = ref([]);
const selectedEq = ref('');
const page = ref(1);
const total = ref(0);
const size = ref(5);

const fetchEquipmentList = async (p = 1) => {
    // 설비코드 페이지 로드
    try {
        const { data } = await axios.get('/api/equipment/code-list', { params: { page: p, size: size.value } });
        eqList.value = Array.isArray(data.items) ? data.items : [];
        total.value = Number(data.total || 0);
        page.value = p;
    } catch (e) {
        console.error('설비목록 조회 실패', e);
        eqList.value = [];
        total.value = 0;
    }
};

const openEqModal = () => {
    // 모달 오픈
    selectedEq.value = form.value.equipment_id || '';
    fetchEquipmentList(1);
    showEqModal.value = true;
};

const applyEq = () => {
    // 선택값 적용
    if (!selectedEq.value) return alert('설비를 선택하세요');
    form.value.equipment_id = selectedEq.value;
    showEqModal.value = false;
};

/* ===== 옵션들 ===== */
const typeOptions = ['긴급정지', '점검']; // '수리', 잠깐삭제
const statusOptions = ['점검대기', '점검중', '완료']; // '수리대기', '수리중', 잠깐삭제

/* ===== 외부에서 row 바인딩 ===== */
const load = (row) => {
    form.value = { ...row, equipment_id: row.equipment_id || row.eq_id || '' };
    isEditing.value = true; // 목록에서 바인딩되면 수정모드 진입
}; // 한 줄 매핑
defineExpose({ load });
</script>

<template>
    <div class="mt-8 space-y-5">
        <!-- 제목 + 버튼 -->
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">비가동 등록/수정</div>
            <div class="flex items-center gap-2">
                <Button label="등록" rounded @click="registDowntime" :disabled="isEditing" />
                <Button label="초기화" severity="info" rounded @click="onReset" />
                <Button label="수정" severity="warning" rounded @click="updateDowntime" />
            </div>
        </div>

        <!-- 폼 -->
        <div class="border rounded-md overflow-hidden bg-white">
            <div class="grid grid-cols-[10rem_1fr_10rem_1fr]">
                <!-- 설비코드 -->
                <div class="bg-gray-50 border-r border-b px-3 py-4 text-[15px] font-medium flex items-center justify-center"><span class="text-red-500 mr-1">*</span>설비코드</div>
                <div class="border-r border-b px-4 py-4">
                    <div class="relative w-full">
                        <input v-model="form.equipment_id" class="w-full h-[38px] border rounded pl-2 pr-10" readonly />
                        <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500" @click="openEqModal"></i>
                    </div>
                </div>

                <!-- 비가동유형 -->
                <div class="bg-gray-50 border-r border-b px-3 py-4 text-[15px] font-medium flex items-center justify-center"><span class="text-red-500 mr-1">*</span>비가동유형</div>
                <div class="border-b px-4 py-4 flex items-center gap-6">
                    <label v-for="t in typeOptions" :key="t" class="flex items-center gap-2">
                        <input type="radio" :value="t" v-model="form.fault_type" />
                        <span>{{ t }}</span>
                    </label>
                </div>

                <!-- 비가동일시 -->
                <div class="bg-gray-50 border-r border-b px-3 py-4 text-[15px] font-medium flex items-center justify-center"><span class="text-red-500 mr-1">*</span>비가동일시</div>
                <div class="border-r border-b px-4 py-4 flex items-center">
                    <input type="datetime-local" v-model="form.fault_dtime" class="w-full h-[38px] border rounded px-2" />
                </div>

                <!-- 재가동일시 -->
                <div class="bg-gray-50 border-r border-b px-3 py-4 text-[15px] font-medium flex items-center justify-center">재가동일시</div>
                <div class="border-b px-4 py-4 flex items-center">
                    <input type="datetime-local" v-model="form.restart_dtime" class="w-full h-[38px] border rounded px-2" />
                </div>

                <!-- 비고 -->
                <div class="bg-gray-50 border-r border-b px-3 py-4 text-[15px] font-medium flex items-center justify-center">비고</div>
                <div class="border-b px-4 py-4 col-span-3">
                    <textarea v-model="form.note" class="w-full h-40 border rounded px-2 py-2 resize-none"></textarea>
                </div>

                <!-- 처리상태 -->
                <div class="bg-gray-50 border-r px-3 py-4 text-[15px] font-medium flex items-center justify-center"><span class="text-red-500 mr-1">*</span>처리상태</div>
                <div class="px-4 py-4 col-span-3">
                    <div class="flex gap-6 flex-wrap">
                        <label v-for="st in statusOptions" :key="st" class="flex items-center gap-2">
                            <input type="radio" :value="st" v-model="form.status" />
                            <span>{{ st }}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ===== 설비코드 모달 ===== -->
    <div v-if="showEqModal" class="fixed inset-0 z-[9999] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="showEqModal = false"></div>
        <div class="relative bg-white rounded-lg shadow-lg w-[420px] max-h-[70vh] flex flex-col">
            <div class="px-4 py-3 border-b font-semibold">설비코드 선택</div>
            <div class="p-4 overflow-auto">
                <div v-for="eq in eqList" :key="eq.eq_id" class="flex items-center gap-3 py-2 border-b">
                    <input type="radio" :id="`eq_${eq.eq_id}`" :value="eq.eq_id" v-model="selectedEq" />
                    <label :for="`eq_${eq.eq_id}`" class="cursor-pointer">
                        <span class="font-mono">{{ eq.eq_id }}</span> - {{ eq.eq_name }}
                    </label>
                </div>
                <div v-if="eqList.length === 0" class="text-center text-gray-500 py-6">데이터 없음</div>
            </div>
            <div class="px-4 py-3 border-t flex items-center justify-between text-sm">
                <button class="px-3 py-2 rounded bg-black text-white" @click="applyEq">선택완료</button>
                <div class="flex items-center gap-3">
                    <button class="px-2 py-1 border rounded" :disabled="page <= 1" @click="fetchEquipmentList(page - 1)">이전</button>
                    <span>{{ page }} / {{ Math.ceil(total / size) || 1 }}</span>
                    <button class="px-2 py-1 border rounded" :disabled="page >= Math.ceil(total / size)" @click="fetchEquipmentList(page + 1)">다음</button>
                </div>
            </div>
        </div>
    </div>
</template>
