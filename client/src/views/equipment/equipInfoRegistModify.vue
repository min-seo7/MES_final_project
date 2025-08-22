<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import EquipmentSearchWidget from '@/components/equipment/information/equipmentSearchWidget.vue';
import EquipmentRegistWidget from '@/components/equipment/information/equipmentRegistWidget.vue';

const searchRef = ref();
const registRef = ref();
const list = ref([]); // 리스트 상태

/* ===================== 조회/검색 ===================== */
// 검색 실행 → 서버 요청 → 결과 1건이면 등록/수정폼에 바인딩
async function handleSearch(q) {
    try {
        const { data } = await axios.get('/api/equipment/find-one', {
            params: { equipment_id: q.equipment_id }
        });
        if (data) registRef.value?.load(data);
        else alert('검색 결과가 없습니다.');
    } catch (err) {
        console.error(err);
        alert('조회 중 오류가 발생했습니다.');
    }
}

/* ===================== 등록/수정폼 제어 ===================== */
// 등록/수정폼 초기화
function handleReset() {
    registRef.value?.reset();
}

// 설비등록 (위젯 메서드 호출)
async function handleSave() {
    await registRef.value?.save();
}

// 수정
async function handleUpdate() {
    await registRef.value?.updateEquipment();
}

/* ===================== 리스트 제어 ===================== */
// 리스트 조회
async function fetchList() {
    try {
        const { data } = await axios.get('/api/equipment/search', {
            params: { page: 1, size: 50 } // 필요에 맞게 수정
        });
        list.value = data.items ?? [];
    } catch (err) {
        console.error('[View] fetchList 실패:', err);
    }
}

// 등록 성공 후 호출되는 이벤트 핸들러
function handleReloadList(newCode) {
    console.log('새로 등록된 설비코드:', newCode);
    fetchList(); // 등록 후 목록 다시 불러오기
}

// 초기 로딩
onMounted(() => {
    fetchList();
});

// 리스트에서 한 행 클릭했을 때 (선택하면 폼에 로드)
// function handlePick(item) {
//     registRef.value?.load(item);
// }
</script>

<template>
    <div>
        <!-- 검색 위젯 -->
        <EquipmentSearchWidget ref="searchRef" @submit="handleSearch" />

        <!-- 등록/수정 위젯 -->
        <EquipmentRegistWidget ref="registRef" @save="handleSave" @update="handleUpdate" @reset="handleReset" @saved="handleReloadList" />
    </div>
</template>
