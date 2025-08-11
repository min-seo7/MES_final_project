<script setup>
import { computed } from 'vue';

const props = defineProps({
    /* v-model 지원 */
    modelValue: {
        type: Object,
        default: () => ({
            equipmentCode: '', // 설비코드 ★
            inspectionCode: '', // 점검코드 ★ (자동생성)
            inspectionType: '정기점검', // ★ 라디오
            inspectionCycle: '', // 점검주기
            inspectionDate: null, // ★ 점검일
            nextDate: null, // 다음예정일
            manager: '', // ★ 점검책임자
            note: '', // 비고
            details: Array.from({ length: 10 }, () => ({
                item: '',
                result: '',
                action: ''
            })) // 점검항목/점검결과/조치사항 행
        })
    }
});
// ...기존 코드 위/아래 유지

const emit = defineEmits([
    'update:modelValue', // v-model
    'save',
    'reset',
    'open:eqPicker'
]);

/* v-model 양방향 */
const form = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
});

/* 필수값 검증 간단 버전 */
function validate() {
    const f = form.value;
    const missing = (!f.equipmentCode && '설비코드') || (!f.inspectionCode && '점검코드') || (!f.inspectionType && '점검유형') || (!f.inspectionDate && '점검일') || (!f.manager && '점검책임자');
    return missing || '';
}

function onSave() {
    const miss = validate();
    if (miss) {
        // eslint-disable-next-line no-alert
        alert(`필수값을 입력하세요: ${miss}`);
        return;
    }
    emit('save', { ...form.value });
}

function onReset() {
    form.value = {
        equipmentCode: '',
        inspectionCode: '',
        inspectionType: '정기점검',
        inspectionCycle: '',
        inspectionDate: null,
        nextDate: null,
        manager: '',
        note: '',
        details: Array.from({ length: 10 }, () => ({ item: '', result: '', action: '' }))
    };
    emit('reset');
}

function genCode() {
    const ymd = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    form.value.inspectionCode = `INSP-${ymd}-${rand}`;
}
</script>

<template>
    <div class="mt-8 space-y-4">
        <!-- 제목 + 버튼 -->
        <div class="flex items-center justify-between">
            <div class="font-bold text-[18.5px]">등록/수정</div>
            <div class="flex items-center gap-2">
                <Button label="저장" rounded @click="onSave" />
                <Button label="초기화" severity="info" rounded @click="onReset" />
            </div>
        </div>

        <!-- 테이블형 폼 -->
        <div class="border rounded-md overflow-hidden bg-white">
            <div class="grid grid-cols-[9rem_1fr_9rem_1fr]">
                <!-- 1행: 설비코드 / 점검코드 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>설비코드</div>
                <div class="border-r border-b px-3 py-4 flex items-center gap-2">
                    <IconField iconPosition="left" class="w-full">
                        <InputText v-model="form.equipmentCode" class="w-full" />
                        <InputIcon class="pi pi-search cursor-pointer" @click="$emit('open:eqPicker')" />
                    </IconField>
                </div>

                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>점검코드</div>
                <div class="border-b px-3 py-4 flex items-center gap-2">
                    <InputText v-model="form.inspectionCode" placeholder="자동생성" class="w-[calc(100%-70px)]" />
                    <Button label="생성" class="shrink-0 text-xs px-3 py-2" @click="genCode" />
                </div>

                <!-- 2행: 점검유형 / 점검주기 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>점검유형</div>
                <div class="border-r border-b px-3 py-4">
                    <div class="flex items-center gap-6 flex-wrap">
                        <div class="flex items-center gap-2">
                            <RadioButton inputId="t1" name="inspType" value="정기점검" v-model="form.inspectionType" />
                            <label for="t1">정기점검</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton inputId="t2" name="inspType" value="상시점검" v-model="form.inspectionType" />
                            <label for="t2">상시점검</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton inputId="t3" name="inspType" value="자체점검" v-model="form.inspectionType" />
                            <label for="t3">자체점검</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <RadioButton inputId="t4" name="inspType" value="요청점검" v-model="form.inspectionType" />
                            <label for="t4">요청점검</label>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">점검주기</div>
                <div class="border-b px-3 py-4 flex items-center">
                    <InputText v-model="form.inspectionCycle" class="w-full" />
                </div>

                <!-- 3행: 점검일 / 다음예정일 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>점검일</div>
                <div class="border-r border-b px-3 py-4 flex items-center">
                    <Calendar v-model="form.inspectionDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-44" />
                </div>

                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">다음예정일</div>
                <div class="border-b px-3 py-4 flex items-center">
                    <Calendar v-model="form.nextDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" class="w-44" />
                </div>

                <!-- 4행: 점검책임자 / 비고 -->
                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap"><span class="text-red-500 mr-1">*</span>점검책임자</div>
                <div class="border-r border-b px-3 py-4 flex items-center">
                    <InputText v-model="form.manager" class="w-full" />
                </div>

                <div class="bg-gray-50 border-r border-b px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">비고</div>
                <div class="border-b px-3 py-4 flex items-center">
                    <InputText v-model="form.note" class="w-full" />
                </div>
                <!-- 점검내용 영역 제목셀 -->
                <div class="bg-gray-50 border-r px-2 py-4 text-[14px] font-medium flex items-center justify-center whitespace-nowrap">점검내용</div>

                <!-- 점검내용 표 영역 -->
                <div class="col-span-3 px-0 py-0">
                    <!-- 바깥 테두리 -->
                    <div class="border border-gray-200 rounded-sm overflow-hidden" style="--action-w: 44%; --row-h: 36px">
                        <!-- 헤더 -->
                        <div class="grid bg-gray-50 text-sm font-medium" style="grid-template-columns: 1fr 1fr minmax(var(--action-w), 2fr)">
                            <div class="border-r border-b px-3 py-2 text-center">점검항목</div>
                            <div class="border-r border-b px-3 py-2 text-center">점검결과</div>
                            <div class="border-b px-3 py-2 text-center">조치사항</div>
                        </div>

                        <!-- 시트지 줄 반복 -->
                        <div v-for="n in 12" :key="n" class="grid" style="grid-template-columns: 1fr 1fr minmax(var(--action-w), 2fr)">
                            <div class="border-t border-r h-[var(--row-h)]"></div>
                            <div class="border-t border-r h-[var(--row-h)]"></div>
                            <div class="border-t h-[var(--row-h)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
