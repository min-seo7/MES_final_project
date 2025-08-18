<script setup>
import { ref } from 'vue';
import axios from 'axios';
import EquipmentSearchWidget from '@/components/equipment/information/equipmentSearchWidget.vue';
import EquipmentRegistWidget from '@/components/equipment/information/equipmentRegistWidget.vue';

const searchRef = ref();
const registRef = ref();

// 검색 실행 → 서버 요청 → 결과 1건이면 등록/수정폼에 바인딩
async function handleSearch(q) {
    try {
        const { data } = await axios.get('/api/equipment/find-one', { params: { equipment_id: q.equipment_id } });
        if (data) registRef.value?.load(data);
        else alert('검색 결과가 없습니다.');
    } catch (err) {
        console.error(err);
        alert('조회 중 오류가 발생했습니다.');
    }
}

// 등록/수정폼 초기화
function handleReset() {
    registRef.value?.reset();
}

// 설비등록
async function handleSave() {
    await registRef.value?.save();
}

// 수정
async function handleUpdate() {
    await registRef.value?.updateEquipment();
}

// 리스트에서 한 행 클릭했을 때
// function handlePick(item) {
//     registRef.value.load(item); // ← 이게 핵심
// }
</script>

<template>
    <div>
        <!-- 검색 위젯 -->
        <EquipmentSearchWidget ref="searchRef" @submit="handleSearch" />

        <!-- 등록/수정 위젯 -->
        <EquipmentRegistWidget ref="registRef" @save="handleSave" @update="handleUpdate" @reset="handleReset" />
    </div>
</template>
