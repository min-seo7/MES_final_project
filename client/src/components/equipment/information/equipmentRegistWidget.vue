<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 부모(View)로 이벤트 전달
const emit = defineEmits(['reset', 'open:typePicker', 'open:locPicker']);

// 폼 데이터
const form = ref({
    equipmentCode: '',
    equipmentName: '',
    manufacturer: '',
    serialNo: '',
    purchaseDate: '',
    startDate: '',
    equipmentType: '',
    location: '',
    status: '사용',
    note: ''
});

// 파일 관련
const file1Name = ref('');
const file2Name = ref('');
const file1 = ref(null);
const file2 = ref(null);

const pickFile = (id) => document.getElementById(id)?.click();
const onFile1 = (e) => {
    file1.value = e.target.files[0];
    file1Name.value = file1.value?.name || '';
    console.log('[File1 선택됨]', file1Name.value);
};
const onFile2 = (e) => {
    file2.value = e.target.files[0];
    file2Name.value = file2.value?.name || '';
    console.log('[File2 선택됨]', file2Name.value);
};

// 설비코드 자동 생성
const genCode = () => {
    const prefix = form.value.equipmentType || 'EQ';
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    form.value.equipmentCode = `${prefix}-${random}`;
    console.log('[설비코드 생성됨]', form.value.equipmentCode);
};

// 등록 요청
const registequipment = async () => {
    try {
        console.log('[등록 요청 데이터]', form.value);

        const res = await axios.post('/api/equipment', form.value);

        console.log('[서버 응답]', res.data);

        alert(res.data?.message || '등록이 완료되었습니다.');
        emit('reset');
    } catch (err) {
        console.error('[등록 실패]', err);
        alert('등록 실패: ' + (err.response?.data?.message || err.message));
    }
};
</script>

<template>
    <div class="mt-8 space-y-4">
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">등록/수정</div>
            <div class="flex items-center gap-2">
                <Button label="저장" rounded @click="registequipment()" />
                <Button label="초기화" severity="info" rounded @click="emit('reset')" />
            </div>
        </div>

        <div class="border rounded-md overflow-hidden bg-white">
            <div class="grid grid-cols-[9rem_1fr_9rem_1fr]">
                <!-- 설비코드 / 설비명 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>설비코드</div>
                <div class="border-r border-b px-3 py-4 flex items-center gap-2">
                    <InputText v-model="form.equipmentCode" placeholder="설비유형별 자동생성" class="w-[calc(100%-70px)]" />
                    <Button label="생성" class="shrink-0 text-xs px-3 py-2" @click="genCode" />
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
