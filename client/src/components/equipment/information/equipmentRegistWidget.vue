<script setup>
import { ref, defineExpose } from 'vue';
import axios from 'axios';

/**
 * ✅ 폼 키는 기존 템플릿과 정확히 맞춤
 *  - equipmentCode, equipmentName, manufacturer, serialNo,
 *    purchaseDate, startDate, equipmentType, location, status, note
 *  - 파일첨부(법적/매뉴얼)는 별도 구현으로 두고, 지금은 DB 컬럼만 처리
 */

const form = ref({
    equipmentCode: '', // EQ-코드 (미입력 시 자동생성)
    equipmentName: '',
    manufacturer: '',
    serialNo: '',
    purchaseDate: null, // YYYY-MM-DD 또는 Date
    startDate: null, // YYYY-MM-DD 또는 Date
    equipmentType: '',
    location: '',
    status: '사용',
    note: ''
});

/* ---------- 유틸: 날짜 포맷 ---------- */
function toYMD(v) {
    if (!v) return null;
    if (typeof v === 'string') return v; // 이미 yyyy-mm-dd
    // Date → yyyy-mm-dd
    const d = new Date(v);
    if (isNaN(d.getTime())) return null;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}

/* ---------- 코드 생성: EQ-YYYYMM-#### ---------- */
async function genCode() {
    const { data } = await axios.get('/api/information/equipment/gencode');
    form.value.equipmentCode = data.code;
}

/* ---------- 단건 로드: eq_id로 조회 → 폼 채움 ---------- */
async function load(eq_id) {
    if (!eq_id) {
        reset();
        return;
    }
    const { data } = await axios.get(`/api/information/equipment/${encodeURIComponent(eq_id)}`);
    const it = data?.item;
    if (!it) {
        reset();
        return;
    }

    // 서버 → 폼 매핑 (DB 컬럼명 기준)
    form.value = {
        equipmentCode: it.eq_id || '',
        equipmentName: it.eq_name || '',
        manufacturer: it.manufacturer || '',
        serialNo: it.serial_no || '',
        purchaseDate: it.purchase_date || null,
        startDate: it.start_date || null,
        equipmentType: it.eq_type || '',
        location: it.loc || '',
        status: it.status || '사용',
        note: it.note || ''
    };
}

/* ---------- 저장: 신규(POST) / 수정(PUT) ---------- */
async function save() {
    const payload = {
        eq_id: form.value.equipmentCode || null, // 없으면 서버가 생성
        eq_name: form.value.equipmentName,
        manufacturer: form.value.manufacturer || null,
        serial_no: form.value.serialNo || null,
        purchase_date: toYMD(form.value.purchaseDate),
        start_date: toYMD(form.value.startDate),
        eq_type: form.value.equipmentType || null,
        loc: form.value.location || null,
        status: form.value.status || '사용',
        note: form.value.note || null
    };

    if (!payload.eq_id) {
        // 신규: 코드 미입력 → 서버에서 코드 생성 후 저장
        const { data } = await axios.post('/api/information/equipment', payload);
        await load(data.item.eq_id);
    } else {
        // 수정
        const { data } = await axios.put(`/api/information/equipment/${encodeURIComponent(payload.eq_id)}`, payload);
        await load(data.item.eq_id);
    }
}

/* ---------- 초기화 ---------- */
function reset() {
    form.value = {
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
    };
}

/* ---------- 외부(View/템플릿에서 호출할 메서드 노출) ---------- */
defineExpose({
    form, // v-model 접근 필요 시
    genCode, // "생성" 버튼
    save, // "저장" 버튼
    reset, // "초기화" 버튼
    load // Search 결과로 eq_id 주입 시 사용
});
</script>
<template>
    <div class="mt-8 space-y-4">
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">등록/수정</div>
            <div class="flex items-center gap-2">
                <Button label="저장" rounded @click="emit('save')" />
                <Button label="초기화" severity="info" rounded @click="emit('reset')" />
            </div>
        </div>

        <div class="border rounded-md overflow-hidden bg-white">
            <div class="grid grid-cols-[9rem_1fr_9rem_1fr]">
                <!-- 설비코드 / 설비명 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>설비코드</div>
                <div class="border-r border-b px-3 py-4 flex items-center gap-2">
                    <InputText v-model="form.equipmentCode" placeholder="설비유형별 자동생성" class="w-[calc(100%-70px)]" />
                    <Button label="생성" class="shrink-0 text-xs px-3 py-2" />
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
                            <InputIcon class="pi pi-search cursor-pointer" @click="emit('open:typePicker')" />
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
                        <InputIcon class="pi pi-search cursor-pointer" @click="emit('open:locPicker')" />
                    </IconField>
                </div>

                <!-- 비고 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">비고</div>
                <div class="border-b px-3 py-5 col-span-3">
                    <Textarea v-model="form.note" :maxlength="200" rows="5" class="w-full h-28 resize-none" />
                    <div class="text-right text-xs text-gray-500 mt-1">{{ form.note?.length || 0 }}/200</div>
                </div>

                <!-- 파일첨부 -->
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
</template>
