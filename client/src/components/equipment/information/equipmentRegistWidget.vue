<script setup>
import { ref } from 'vue';
import axios from 'axios';

/* 폼 상태 */
const form = ref({
    equipmentCode: '',
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
/* ✅ 설비코드 자동 발급 (INSP001 → …) */
async function ensureEquipmentCode() {
    // 화면에서 입력받지 않으므로 비어있으면 서버에서 발급
    if (form.value.equipmentCode && form.value.equipmentCode.toString().trim()) return;

    const { data } = await axios.get('/api/equipment/gen-code');
    if (!data?.code) {
        alert('설비코드 자동생성에 실패했습니다.');
        throw new Error('gen-code failed');
    }
    form.value.equipmentCode = data.code; // 내부 세팅 (화면엔 readonly)
}

/* ✅ 필수값 체크 함수 */
function validateForm() {
    if (!form.value.equipmentCode.trim()) {
        alert('설비코드가 없습니다.');
        return false;
    }
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

/* ✅ 추가: 수정모드 플래그 (load로 데이터 바인딩되면 true) */
const isEditing = ref(false);

// /* 코드 생성 */
// function genCode() {
//     const prefix = (form.value.equipmentType?.trim() || 'EQ').toUpperCase().slice(0, 3);
//     const yyyy = new Date().getFullYear();
//     const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
//     form.value.equipmentCode = `${prefix}-${yyyy}-${rand}`;
// }

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

/* 등록 */
const registEquipment = async () => {
    try {
        await ensureEquipmentCode(); // ✅ 먼저 코드 자동생성
        if (!validateForm()) return; // ✅ 필수값 알림 후 중단
        const res = await axios.post('/api/equipment/regist', form.value);
        alert(res.data.message || '등록 완료');
    } catch (err) {
        console.error('[widget] 설비등록 실패:', err);
        alert('저장 중 오류가 발생했습니다.');
    }
};

/* 수정 */
const updateEquipment = async () => {
    if (!validateForm()) return; // ✅ 유효성 검사 추가
    try {
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
    /* ✅ 추가: 단건조회로 데이터가 채워지면 "수정모드" */
    isEditing.value = true;
}

/* 초기화 */
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
    /* ✅ 추가: 초기화하면 신규 등록 모드 */
    isEditing.value = false;
};

const save = () => registEquipment();
const reset = () => resetForm();

defineExpose({
    load, // 폼 바인딩
    save: registEquipment, // 외부에서 save() 호출 가능
    updateEquipment, // 외부에서 updateEquipment() 호출 가능
    reset: resetForm // 외부에서 reset() 호출 가능
});

/* ===========================
   ✅ 추가: 설비유형/설비위치 돋보기 모달
   (검색 위젯 모달과 동일 UX: 라디오 + 모달 내부 페이징 + 중앙 버튼)
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
</script>

<template>
    <div class="mt-8 space-y-4">
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">등록/수정</div>
            <div class="flex items-center gap-2">
                <!-- ✅ 추가: 수정모드일 땐 등록 비활성화 -->
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
                    <InputText v-model="form.equipmentCode" readonly placeholder="자동생성" class="w-full" style="background-color: #d3d3d3" />
                    <!-- <Button label="생성" class="shrink-0 text-xs px-3 py-2" @click="genCode" /> -->
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

                <!-- 설비유형 / 설비위치 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>설비유형</div>
                <div class="border-r border-b px-3 py-4">
                    <div class="flex items-center gap-3 flex-nowrap">
                        <IconField iconPosition="left">
                            <InputText v-model="form.equipmentType" class="w-56 min-w-0" />
                            <!-- ✅ 클릭 시 설비유형 모달 -->
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

                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">설비위치</div>
                <div class="border-b px-3 py-4">
                    <IconField iconPosition="left" class="w-full">
                        <InputText v-model="form.location" class="w-full min-w-0" />
                        <!-- ✅ 클릭 시 설비위치 모달 -->
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
    </div>

    <!-- ✅ 설비유형 모달 -->
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

    <!-- ✅ 설비위치 모달 -->
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
</template>
