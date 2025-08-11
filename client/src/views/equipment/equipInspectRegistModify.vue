<script setup>
import { ref } from 'vue';
import inspectionSearchWidget from '@/components/equipment/inspection/inspectionSearchWidget.vue';

const form = ref({
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
});

// 🔹 세트 데이터 (검색/조회 공용 원천)
const pickerData = [
    { eq_id: 'EQ-001', eq_type: '혼합기', eq_name: '리본 블렌더', loc: 'A동-1라인' },
    { eq_id: 'EQ-002', eq_type: '분쇄기', eq_name: '해머 밀', loc: 'A동-2라인' },
    { eq_id: 'EQ-003', eq_type: '포장기', eq_name: '자동 포장기', loc: 'B동-1라인' },
    { eq_id: 'EQ-004', eq_type: '컨베이어', eq_name: '체인 컨베이어', loc: 'B동-2라인' },
    { eq_id: 'EQ-005', eq_type: '건조기', eq_name: '로터리 건조기', loc: 'C동-1라인' }
];

// 🔹 조회 버튼 눌렀을 때만 등록폼 세트 채우기
function handleSearch(q) {
    // q: { eq_id, eq_type, eq_name, loc, status }
    const match = pickerData.find((s) => (!q.eq_id || s.eq_id === q.eq_id) && (!q.eq_type || s.eq_type === q.eq_type) && (!q.eq_name || s.eq_name === q.eq_name) && (!q.loc || s.loc === q.loc));

    if (match) {
        form.value.equipmentCode = match.eq_id;
        form.value.equipmentType = match.eq_type;
        form.value.equipmentName = match.eq_name;
        form.value.location = match.loc;
    } else {
        // 필요하면 토스트/알럿
        console.warn('일치하는 설비 세트가 없습니다.');
    }
}

function handleClear() {
    // 검색 폼 초기화일 뿐, 등록폼은 그대로 두거나 필요시 초기화
    // form.value.equipmentCode = '';
    // ...
}

// 저장/초기화 (등록 위젯용)
function saveForm() {
    console.log('저장 데이터:', form.value);
}
function resetForm() {
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
}
</script>

<template>
    <div class="p-4 space-y-6">
        <inspectionSearchWidget :pickerData="pickerData" @submit="handleSearch" @clear="handleClear" />
        <InspectionRegistWidget v-model="form" @save="saveForm" @reset="resetForm" @open:eqPicker="openEqPicker" />
    </div>
</template>
