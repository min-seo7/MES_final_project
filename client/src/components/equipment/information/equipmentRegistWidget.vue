<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 이벤트 선언
const emit = defineEmits(['saved']); // saved 이벤트 추가

/* 폼 상태 */
const form = ref({
    equipmentCode: '', // 서버에서 자동 생성, 프론트에서는 사용하지 않음
    equipmentName: '',
    manufacturer: '',
    serialNo: '',
    purchaseDate: null,
    startDate: null,
    equipmentType: '',
    location: '',
    status: '사용',
    note: ''
});

/* 
 필수값 체크(설비코드 제외) */
function validateForm() {
    if (!form.value.equipmentName.trim()) {
        alert('설비명을 입력하세요.');
        return false;
    }
    if (!form.value.manufacturer.trim()) {
        alert('제조사를 입력하세요.');
        return false;
    }
    if (!form.value.purchaseDate) {
        alert('구매일을 선택하세요.');
        return false;
    }
    if (!form.value.equipmentType.trim()) {
        alert('설비유형을 입력하세요.');
        return false;
    }
    if (!form.value.status.trim()) {
        alert('설비상태를 선택하세요.');
        return false;
    }
    return true;
}

/* ✅ 수정 모드 플래그 (단건조회로 바인딩되면 true) */
const isEditing = ref(false);

/* 파일 처리(그대로) */
const file1Name = ref(''),
    file2Name = ref('');
const file1 = ref(null),
    file2 = ref(null);
const pickFile = (id) => document.getElementById(id)?.click();
const onFile1 = (e) => {
    file1.value = e.target.files?.[0] || null;
    file1Name.value = file1.value?.name || '';
};
const onFile2 = (e) => {
    file2.value = e.target.files?.[0] || null;
    file2Name.value = file2.value?.name || '';
};

/* 등록: 설비코드는 서버에서 자동 생성 */
const registEquipment = async () => {
    if (!validateForm()) return;

    // 서버가 생성하는 equipment_id는 빼고 필요한 값만 전송
    const payload = {
        equipmentType: (form.value.equipmentType || '').trim(),
        equipmentName: (form.value.equipmentName || '').trim(),
        manufacturer: (form.value.manufacturer || '').trim(),
        serialNo: (form.value.serialNo || '').trim(),
        purchaseDate: form.value.purchaseDate, // Date → 서버에서 YYYY-MM-DD로 변환
        startDate: form.value.startDate,
        location: (form.value.location || '').trim(),
        status: (form.value.status || '사용').trim()
        // safety_standard, operation_manual 필요시 추가
    };

    try {
        const { data } = await axios.post('/api/equipment/regist', payload);

        console.log('[registEquipment] created eq_id:', data.code);
        alert(data.message || '등록 완료');

        // 성공 후 폼 초기화
        resetForm();

        // 부모 컴포넌트로 emit해서 리스트 새로고침 가능
        emit('saved', data.code);
    } catch (err) {
        console.error('[widget] 설비등록 실패:', err);
        alert('저장 중 오류가 발생했습니다.');
    }
};

/* 수정 */
const updateEquipment = async () => {
    if (!validateForm()) return;
    try {
        // 수정은 서버가 WHERE equipment_id(=equipmentCode)를 사용하므로 그대로 보냄
        const res = await axios.put('/api/equipment/update', form.value);
        alert(res.data.message || '수정 완료');
    } catch (err) {
        console.error('[widget] 설비수정 실패:', err);
        alert('수정 중 오류가 발생했습니다.');
    }
};

/* 외부 바인딩 진입점 */
function toDate(v) {
    return !v ? null : typeof v === 'string' ? new Date(v) : v;
}
function load(data) {
    form.value = {
        ...form.value,
        ...data,
        purchaseDate: toDate(data.purchaseDate),
        startDate: toDate(data.startDate)
    };
    isEditing.value = true; // 수정 모드
}

/* 초기화 → 신규 등록 모드 */
const resetForm = () => {
    form.value = {
        equipmentCode: '',
        equipmentType: '',
        equipmentName: '',
        manufacturer: '',
        serialNo: '',
        purchaseDate: null,
        startDate: null,
        location: '',
        status: '사용',
        note: ''
    };
    isEditing.value = false;
};

const save = () => registEquipment();
const reset = () => resetForm();

defineExpose({
    load, // 폼 바인딩
    save: registEquipment,
    updateEquipment,
    reset: resetForm
});

/* ===========================
   설비유형/설비위치 돋보기 모달
   =========================== */
const showTypePicker = ref(false);
const typePicker = {
    page: ref(1),
    size: 5,
    total: ref(0),
    list: ref([]),
    selected: ref('')
};
async function openTypePicker() {
    typePicker.selected.value = form.value.equipmentType || '';
    await fetchTypePage(1);
    showTypePicker.value = true;
}
async function fetchTypePage(p) {
    typePicker.page.value = p;
    try {
        const { data } = await axios.get('/api/equipment/info2/distinct', {
            params: { field: 'equipment_type', page: p, size: typePicker.size }
        });
        typePicker.list.value = data?.items ?? [];
        typePicker.total.value = data?.total ?? typePicker.list.value.length;
    } catch (e) {
        console.error(e);
        typePicker.list.value = [];
        typePicker.total.value = 0;
    }
}
function selectTypeComplete() {
    if (!typePicker.selected.value) {
        alert('설비유형을 선택하세요.');
        return;
    }
    form.value.equipmentType = typePicker.selected.value;
    showTypePicker.value = false;
}

const showLocPicker = ref(false);
const locPicker = {
    page: ref(1),
    size: 5,
    total: ref(0),
    list: ref([]),
    selected: ref('')
};
async function openLocPicker() {
    locPicker.selected.value = form.value.location || '';
    await fetchLocPage(1);
    showLocPicker.value = true;
}
async function fetchLocPage(p) {
    locPicker.page.value = p;
    try {
        const { data } = await axios.get('/api/equipment/info2/distinct', {
            params: { field: 'location', page: p, size: locPicker.size }
        });
        locPicker.list.value = data?.items ?? [];
        locPicker.total.value = data?.total ?? locPicker.list.value.length;
    } catch (e) {
        console.error(e);
        locPicker.list.value = [];
        locPicker.total.value = 0;
    }
}
function selectLocComplete() {
    if (!locPicker.selected.value) {
        alert('설비위치를 선택하세요.');
        return;
    }
    form.value.location = locPicker.selected.value;
    showLocPicker.value = false;
}

/* 등록 */
</script>

<template>
    <div class="mt-8 space-y-4">
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">등록/수정</div>
            <div class="flex items-center gap-2">
                <!-- 단건 조회로 바인딩되면 등록 비활성화(수정만 가능) -->
                <Button label="등록" rounded @click="save" :disabled="isEditing" />
                <Button label="초기화" severity="info" rounded @click="reset" />
                <Button label="수정" severity="warning" rounded @click="updateEquipment" />
            </div>
        </div>

        <div class="border rounded-md overflow-hidden bg-white">
            <div class="grid grid-cols-[9rem_1fr_9rem_1fr]">
                <!-- 설비코드 / 설비명 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>설비코드</div>
                <div class="border-r border-b px-3 py-4 flex items-center gap-2">
                    <!-- 항상 "자동생성" 고정 표기 (v-model 없음) -->
                    <InputText value="자동생성" readonly class="w-full" style="background-color: #d3d3d3" />
                </div>

                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>설비명</div>
                <div class="border-b px-3 py-4 flex items-center">
                    <InputText v-model="form.equipmentName" class="w-full" />
                </div>

                <!-- 제조사 / 제조번호 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>제조사</div>
                <div class="border-r border-b px-3 py-4 flex items-center">
                    <InputText v-model="form.manufacturer" class="w-full" />
                </div>
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">제조번호</div>
                <div class="border-b px-3 py-4 flex items-center">
                    <InputText v-model="form.serialNo" placeholder="serial No." class="w-full" />
                </div>

                <!-- 구매일 / 사용시작일 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>구매일</div>
                <div class="border-r border-b px-3 py-4 flex items-center">
                    <Calendar v-model="form.purchaseDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-44" />
                </div>
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">사용시작일</div>
                <div class="border-b px-3 py-4 flex items-center">
                    <Calendar v-model="form.startDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-44" />
                </div>

                <!-- 설비유형 / 설비상태 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>설비유형</div>
                <div class="border-r border-b px-3 py-4">
                    <div class="flex items-center gap-3 flex-nowrap">
                        <IconField iconPosition="left">
                            <InputText v-model="form.equipmentType" class="w-56 min-w-0" />
                            <InputIcon class="pi pi-search cursor-pointer" @click="openTypePicker" />
                        </IconField>
                        <div class="h-5 w-px bg-gray-200 mx-2"></div>
                        <span class="text-red-500 text-[16px] mr-1">*</span>
                        <span class="text-[14px] whitespace-nowrap mr-1">설비상태</span>
                        <div class="flex items-center gap-4 flex-shrink-0">
                            <RadioButton inputId="use1" name="use" value="사용" v-model="form.status" />
                            <label for="use1" class="whitespace-nowrap">사용</label>
                            <RadioButton inputId="use2" name="use" value="미사용" v-model="form.status" />
                            <label for="use2" class="whitespace-nowrap">미사용</label>
                        </div>
                    </div>
                </div>

                <!-- 설비위치 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">설비위치</div>
                <div class="border-b px-3 py-4">
                    <IconField iconPosition="left" class="w-full">
                        <InputText v-model="form.location" class="w-full min-w-0" />
                        <InputIcon class="pi pi-search cursor-pointer" @click="openLocPicker" />
                    </IconField>
                </div>

                <!-- 비고 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">비고</div>
                <div class="border-b px-3 py-5 col-span-3">
                    <Textarea v-model="form.note" :maxlength="200" rows="5" class="w-full h-28 resize-none" />
                    <div class="text-right text-xs text-gray-500 mt-1">{{ form.note?.length || 0 }}/200</div>
                </div>

                <!-- 파일첨부 (그대로) -->
                <div class="bg-gray-50 border-r px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">파일첨부</div>
                <div class="px-4 py-6 col-span-3 space-y-6">
                    <div class="flex items-center gap-4">
                        <span class="w-40 whitespace-nowrap">• 법적안전검사기준</span>
                        <button type="button" class="flex-1" @click="pickFile('file1')">
                            <div class="w-full h-12 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center">
                                <span class="truncate px-4 text-base" :class="file1Name ? 'text-gray-700' : 'text-gray-400'">
                                    {{ file1Name || '파일을 선택하세요.' }}
                                </span>
                            </div>
                        </button>
                        <input id="file1" type="file" class="hidden" @change="onFile1" />
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="w-40 whitespace-nowrap">• 작동매뉴얼</span>
                        <button type="button" class="flex-1" @click="pickFile('file2')">
                            <div class="w-full h-12 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center">
                                <span class="truncate px-4 text-base" :class="file2Name ? 'text-gray-700' : 'text-gray-400'">
                                    {{ file2Name || '파일을 선택하세요.' }}
                                </span>
                            </div>
                        </button>
                        <input id="file2" type="file" class="hidden" @change="onFile2" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 설비유형 모달 -->
        <Dialog v-model:visible="showTypePicker" header="설비유형 선택" :modal="true" :style="{ width: '30rem' }">
            <ul class="divide-y">
                <li v-for="(v, idx) in typePicker.list.value" :key="idx" class="p-2 flex items-center gap-3 cursor-pointer" @click="typePicker.selected.value = v">
                    <RadioButton :inputId="`tp_${idx}`" name="tp_pick" :value="v" v-model="typePicker.selected.value" />
                    <label :for="`tp_${idx}`" class="truncate">{{ v }}</label>
                </li>
                <li v-if="typePicker.list.value.length === 0" class="p-4 text-center text-gray-500">항목 없음</li>
            </ul>

            <div class="relative mt-3 min-h-[42px]">
                <div class="absolute left-1/2 -translate-x-1/2">
                    <Button label="선택완료" class="text-[14px]" @click="selectTypeComplete" />
                </div>
                <div class="flex items-center gap-2 justify-end text-[14px]">
                    <Button label="이전" text @click="fetchTypePage(typePicker.page.value - 1)" :disabled="typePicker.page.value <= 1" />
                    <span>{{ typePicker.page.value }} / {{ Math.max(1, Math.ceil(typePicker.total.value / typePicker.size)) }}</span>
                    <Button label="다음" text @click="fetchTypePage(typePicker.page.value + 1)" :disabled="typePicker.page.value * typePicker.size >= typePicker.total.value" />
                </div>
            </div>
        </Dialog>

        <!-- 설비위치 모달 -->
        <Dialog v-model:visible="showLocPicker" header="설비위치 선택" :modal="true" :style="{ width: '30rem' }">
            <ul class="divide-y">
                <li v-for="(v, idx) in locPicker.list.value" :key="idx" class="p-2 flex items-center gap-3 cursor-pointer" @click="locPicker.selected.value = v">
                    <RadioButton :inputId="`lc_${idx}`" name="lc_pick" :value="v" v-model="locPicker.selected.value" />
                    <label :for="`lc_${idx}`" class="truncate">{{ v }}</label>
                </li>
                <li v-if="locPicker.list.value.length === 0" class="p-4 text-center text-gray-500">항목 없음</li>
            </ul>

            <div class="relative mt-3 min-h-[42px]">
                <div class="absolute left-1/2 -translate-x-1/2">
                    <Button label="선택완료" class="text-[14px]" @click="selectLocComplete" />
                </div>
                <div class="flex items-center gap-2 justify-end text-[14px]">
                    <Button label="이전" text @click="fetchLocPage(locPicker.page.value - 1)" :disabled="locPicker.page.value <= 1" />
                    <span>{{ locPicker.page.value }} / {{ Math.max(1, Math.ceil(locPicker.total.value / locPicker.size)) }}</span>
                    <Button label="다음" text @click="fetchLocPage(locPicker.page.value + 1)" :disabled="locPicker.page.value * locPicker.size >= locPicker.total.value" />
                </div>
            </div>
        </Dialog>
    </div>
</template>
