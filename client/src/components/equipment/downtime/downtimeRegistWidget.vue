<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

/* ===== props ===== */
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            id: '', // 비가동 PK
            equipment_id: '', // 설비코드 (FK)
            repair_id: null, // 수리코드 (nullable)
            inspection_id: null, // 점검코드 (nullable)
            fault_type: '', // 비가동유형
            fault_dtime: null, // 비가동일시
            restart_dtime: null, // 재가동일시
            note: '',
            status: ''
        })
    },
    isEdit: { type: Boolean, default: false }
});

/* ===== emit ===== */
const emit = defineEmits(['update:modelValue', 'saved', 'updated', 'reset']);

/* ===== 로컬 form ===== */
const form = ref({ ...props.modelValue });
watch(
    () => props.modelValue,
    (v) => {
        form.value = { ...v };
    },
    { deep: true }
);

/* ===== 목록에서 선택한 row 바인딩 ===== */
function load(row) {
    form.value = { ...row };
}
defineExpose({ load });

/* ===== 등록 ===== */
async function registDowntime() {
    try {
        const res = await axios.post('/api/equipment/downtime/regist', form.value);
        alert(res.data.message || '등록 완료');
        emit('saved', res.data);
    } catch (err) {
        console.error('비가동 등록 실패', err);
        alert('등록 실패');
    }
}

/* ===== 수정 ===== */
async function updateDowntime() {
    try {
        const res = await axios.put('/api/equipment/downtime/update', form.value);
        alert(res.data.message || '수정 완료');
        emit('updated', res.data);
    } catch (err) {
        console.error('비가동 수정 실패', err);
        alert('수정 실패');
    }
}

/* ===== 초기화 ===== */
function onReset() {
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
    emit('reset');
}

/* ===== 설비코드 모달 ===== */
const showEqModal = ref(false);
const eqList = ref([]);
const selectedEq = ref('');
const page = ref(1);
const total = ref(0);
const size = 5;

async function fetchEquipmentList(p = 1) {
    try {
        const { data } = await axios.get('/api/equipment/code-list', {
            params: { page: p, size }
        });
        eqList.value = data.items || [];
        total.value = data.total || 0;
        page.value = p;
    } catch (err) {
        console.error('설비목록 조회 실패', err);
        eqList.value = [];
    }
}

function openEqModal() {
    fetchEquipmentList();
    showEqModal.value = true;
}

function applyEq() {
    if (!selectedEq.value) return alert('설비를 선택하세요');
    form.value.eq_id = selectedEq.value;
    showEqModal.value = false;
}
</script>

<template>
    <div class="mt-8 space-y-5">
        <!-- 제목 + 버튼 -->
        <div class="flex items-center justify-between">
            <div class="font-bold text-[19px]">비가동 등록/수정</div>
            <div class="flex items-center gap-2">
                <Button label="등록" rounded @click="registDowntime" />
                <Button label="초기화" severity="info" rounded @click="onReset" />
                <Button label="수정" severity="warning" rounded @click="updateDowntime" />
            </div>
        </div>

        <!-- grid -->
        <div class="border rounded-md overflow-hidden bg-white">
            <div class="grid grid-cols-[10rem_1fr_10rem_1fr]">
                <!-- 설비코드 -->
                <div class="bg-gray-50 border-r border-b px-3 py-6 text-[15px] font-medium flex items-center justify-center"><span class="text-red-500 mr-1">*</span>설비코드</div>
                <div class="border-r border-b px-4 py-6 flex items-center gap-2">
                    <IconField iconPosition="right" class="w-full">
                        <InputText v-model="form.eq_id" class="w-full" readonly />
                        <InputIcon class="pi pi-search cursor-pointer" @click="openEqModal" />
                    </IconField>
                </div>

                <!-- 비가동유형 -->
                <div class="bg-gray-50 border-r border-b px-3 py-6 text-[15px] font-medium flex items-center justify-center"><span class="text-red-500 mr-1">*</span>비가동유형</div>
                <div class="border-b px-4 py-6 flex items-center gap-6">
                    <div v-for="type in ['긴급정지', '수리', '점검']" :key="type" class="flex items-center gap-2">
                        <RadioButton v-model="form.downtime_type" :inputId="`type_${type}`" :value="type" name="downtime_type" />
                        <label :for="`type_${type}`">{{ type }}</label>
                    </div>
                </div>

                <!-- 비가동일시 -->
                <div class="bg-gray-50 border-r border-b px-3 py-6 text-[15px] font-medium flex items-center justify-center"><span class="text-red-500 mr-1">*</span>비가동일시</div>
                <div class="border-r border-b px-4 py-6 flex items-center">
                    <Calendar v-model="form.downtime_date" showIcon dateFormat="yy-mm-dd" class="w-full" />
                </div>

                <!-- 재가동일시 -->
                <div class="bg-gray-50 border-r border-b px-3 py-6 text-[15px] font-medium flex items-center justify-center">재가동일시</div>
                <div class="border-b px-4 py-6 flex items-center">
                    <Calendar v-model="form.recovery_date" showIcon dateFormat="yy-mm-dd" class="w-full" />
                </div>

                <!-- 비고 -->
                <div class="bg-gray-50 border-r border-b px-3 py-6 text-[15px] font-medium flex items-center justify-center">비고</div>
                <div class="border-b px-4 py-6 col-span-3">
                    <Textarea v-model="form.note" class="w-full h-40 resize-none" />
                </div>

                <!-- 처리상태 -->
                <div class="bg-gray-50 border-r px-3 py-6 text-[15px] font-medium flex items-center justify-center"><span class="text-red-500 mr-1">*</span>처리상태</div>
                <div class="px-4 py-6 col-span-3">
                    <div class="flex gap-6 flex-wrap">
                        <div v-for="st in ['수리대기', '수리중', '점검대기', '점검중', '완료']" :key="st" class="flex items-center gap-2">
                            <RadioButton v-model="form.status" :inputId="`status_${st}`" :value="st" name="status" />
                            <label :for="`status_${st}`">{{ st }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ===== 설비코드 모달 ===== -->
    <Dialog v-model:visible="showEqModal" modal header="설비코드 선택" :style="{ width: '400px' }">
        <div v-for="eq in eqList" :key="eq.eq_id" class="flex items-center gap-2 py-2">
            <RadioButton v-model="selectedEq" :inputId="eq.eq_id" :value="eq.eq_id" />
            <label :for="eq.eq_id">{{ eq.eq_id }} - {{ eq.eq_name }}</label>
        </div>

        <template #footer>
            <div class="flex justify-between items-center w-full text-sm">
                <Button label="선택완료" @click="applyEq" />
                <Button label="이전" link :disabled="page <= 1" @click="fetchEquipmentList(page - 1)" />
                <span>{{ page }} / {{ Math.ceil(total / size) }}</span>
                <Button label="다음" link :disabled="page >= Math.ceil(total / size)" @click="fetchEquipmentList(page + 1)" />
            </div>
        </template>
    </Dialog>
</template>
