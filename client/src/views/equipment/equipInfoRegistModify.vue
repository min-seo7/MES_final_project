<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import EquipmentSearchWidget from '@/components/equipment/information/equipmentSearchWidget.vue';
import EquipmentRegistWidget from '@/components/equipment/information/equipmentRegistWidget.vue';

/** 폼(등록/수정) — 키는 기존 위젯과 동일 */
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

/** 🔎 돋보기용 피커 데이터 (서버에서 실제 값으로 채움; 없으면 빈 배열로 동작) */
const pickerData = ref([]);

/** --- 유틸: 날짜 포맷(yyyy-mm-dd) --- */
function toYMD(v) {
    if (!v) return null;
    if (typeof v === 'string') return v;
    const d = new Date(v);
    if (isNaN(d)) return null;
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
}

/** --- 서버 → 폼 매핑 --- */
function fillFormByItem(it) {
    form.value = {
        equipmentCode: it?.eq_id || '',
        equipmentType: it?.eq_type || '',
        equipmentName: it?.eq_name || '',
        manufacturer: it?.manufacturer || '',
        serialNo: it?.serial_no || '',
        purchaseDate: it?.purchase_date || null,
        startDate: it?.start_date || null,
        location: it?.loc || '',
        status: it?.status || '사용',
        note: it?.note || ''
    };
}

/** --- 초기 피커데이터 로드(선택사항) ---
 * 서버에 /api/information/equipment/search 만들어 두었다면 여기서 최초 100건 정도만 당겨와
 * 돋보기 모달 목록에 사용. 없다면 이 함수는 조용히 통과.
 */
async function loadPickerData() {
    try {
        const { data } = await axios.get('/api/information/equipment/search', {
            params: { page: 1, size: 100 }
        });
        pickerData.value = (data?.items || []).map((r) => ({
            eq_id: r.eq_id,
            eq_type: r.eq_type,
            eq_name: r.eq_name,
            loc: r.loc
        }));
    } catch (_) {
        /* 없어도 화면 동작엔 지장 없음 */
    }
}
onMounted(loadPickerData);

/** --- 조회: Search 위젯에서 emit('submit', q) 받은 조건으로 실DB 조회 --- */
async function handleSearch(q) {
    // 1) eq_id가 있으면 단건 조회 → 폼 채움
    if (q.eq_id) {
        try {
            const { data } = await axios.get(`/api/information/equipment/${encodeURIComponent(q.eq_id)}`);
            if (data?.item) fillFormByItem(data.item);
            else console.warn('일치하는 설비가 없습니다.');
            return;
        } catch (e) {
            console.error('단건 조회 실패:', e);
            return;
        }
    }

    // 2) eq_id가 없으면 검색 API로 1건만 받아 폼 채움(없으면 폼 유지)
    try {
        const { data } = await axios.get('/api/information/equipment/search', {
            params: {
                eq_id: q.eq_id || '',
                eq_type: q.eq_type || '',
                eq_name: q.eq_name || '',
                loc: q.loc || '',
                status: q.status || '',
                page: 1,
                size: 1
            }
        });
        const first = data?.items?.[0];
        if (first) fillFormByItem(first);
        else console.warn('검색 결과가 없습니다.');
    } catch (e) {
        console.error('검색 실패:', e);
    }
}

/** --- 검색 초기화: 등록폼은 유지(네 기존 UX 그대로) --- */
function handleClear() {
    // 필요 시 폼까지 초기화하려면 resetForm() 호출
}

/** --- 저장(신규/수정 모두 처리, 코드 없으면 서버 자동생성) --- */
async function saveForm() {
    const payload = {
        eq_id: form.value.equipmentCode || null,
        eq_type: form.value.equipmentType || null,
        eq_name: form.value.equipmentName,
        manufacturer: form.value.manufacturer || null,
        serial_no: form.value.serialNo || null,
        purchase_date: toYMD(form.value.purchaseDate),
        start_date: toYMD(form.value.startDate),
        loc: form.value.location || null,
        status: form.value.status || '사용',
        note: form.value.note || null
    };

    try {
        if (!payload.eq_id) {
            // 신규: 서버가 코드 생성
            const { data } = await axios.post('/api/information/equipment', payload);
            if (data?.item) fillFormByItem(data.item);
        } else {
            // 수정
            const { data } = await axios.put(`/api/information/equipment/${encodeURIComponent(payload.eq_id)}`, payload);
            if (data?.item) fillFormByItem(data.item);
        }
    } catch (e) {
        console.error('저장 실패:', e);
    }
}

/** --- 폼 초기화 --- */
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
        <!-- 검색 위젯: 화면/배치/템플릿 그대로 -->
        <EquipmentSearchWidget :pickerData="pickerData" @submit="handleSearch" @clear="handleClear" />

        <!-- 등록 위젯: 화면/배치/템플릿 그대로 -->
        <EquipmentRegistWidget v-model="form" @save="saveForm" @reset="resetForm" />
    </div>
</template>
