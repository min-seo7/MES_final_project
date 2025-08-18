<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['lineFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');

// 모달 타입별 선택값 관리
const selectedItems = ref({
    lineName: null,
    processId: null,
    equipmentId: null
});

const search = ref({
    lineId: '',
    lineName: '',
    processId: '',
    equipmentId: '',
    status: ''
});

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;

    let res;
    if (type === 'lineName') {
        res = await axios.get('/api/information/line/getLineName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            lineName: item.line_name
        }));
        columns.value = [{ field: 'lineName', header: '라인명' }];
    } else if (type === 'processId') {
        res = await axios.get('/api/information/line/getProcessId');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            processId: item.process_id,
            processName: item.process_name
        }));
        columns.value = [
            { field: 'processId', header: '공정코드' },
            { field: 'processName', header: '공정명' }
        ];
    } else if (type === 'equipmentId') {
        res = await axios.get('/api/information/line/getEquipmentId');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            equipmentId: item.equipment_id,
            equipmentName: item.equipment_name
        }));
        columns.value = [
            { field: 'equipmentId', header: '설비코드' },
            { field: 'equipmentName', header: '설비명' }
        ];
    }
};

// 모달 선택 완료
const selectModalValue = (item) => {
    if (!item) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    if (modalType.value === 'lineName') {
        search.value.lineName = item.lineName;
        selectedItems.value.lineName = item;
    } else if (modalType.value === 'processId') {
        search.value.processId = item.processId;
        selectedItems.value.processId = item;
    } else if (modalType.value === 'equipmentId') {
        search.value.equipmentId = item.equipmentId;
        selectedItems.value.equipmentId = item;
    }

    showModal.value = false;
};

// 선택필터초기화
const resetSearch = () => {
    search.value.lineId = '';
    search.value.lineName = '';
    search.value.processId = '';
    search.value.equipmentId = '';
    search.value.status = '';

    selectedItems.value.lineName = null;
    selectedItems.value.processId = null;
    selectedItems.value.equipmentId = null;

    selectSearch();
};

// 검색
const selectSearch = async () => {
    try {
        const payload = {
            lineId: search.value.lineId || null,
            lineName: search.value.lineName || null,
            processId: search.value.processId || null,
            equipmentId: search.value.equipmentId || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/line/search', payload);
        console.log(res.data.result);
        emits('lineFilterSearch', res.data.result);
    } catch (err) {
        console.log('line 검색실패', err);
    }
};

onMounted(() => {
    selectSearch();
});
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>검색조건</div>
        <div class="space-x-2">
            <Button label=" 조회 " rounded @click="selectSearch"></Button>
            <Button label=" 초기화 " severity="info" rounded @click="resetSearch"></Button>
        </div>
    </div>

    <Toolbar>
        <template #center>
            <div class="flex items-center gap-6">
                <!-- 라인번호 -->
                <div class="flex items-center gap-2">
                    <label for="lineId" class="whitespace-nowrap">라인번호</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="lineId" type="text" class="w-60" v-model="search.lineId" />
                    </IconField>
                </div>

                <!-- 라인명 -->
                <div class="flex items-center gap-2">
                    <label for="lineName" class="whitespace-nowrap">라인명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="lineName" type="text" class="w-60" v-model="search.lineName" />
                        <InputIcon class="pi pi-search" @click="openModal('lineName')" />
                    </IconField>
                </div>

                <!-- 공정코드 -->
                <div class="flex items-center gap-2">
                    <label for="processId" class="whitespace-nowrap">공정코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="processId" type="text" class="w-60" v-model="search.processId" />
                        <InputIcon class="pi pi-search" @click="openModal('processId')" />
                    </IconField>
                </div>

                <!-- 설비코드 -->
                <div class="flex items-center gap-2">
                    <label for="equipmentId" class="whitespace-nowrap">설비코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="equipmentId" type="text" class="w-60" v-model="search.equipmentId" />
                        <InputIcon class="pi pi-search" @click="openModal('equipmentId')" />
                    </IconField>
                </div>

                <!-- 상태 라디오 그룹 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">상태</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="status1" name="status" value="사용" v-model="search.status" />
                            <label for="status1" class="ml-2 mr-4">사용</label>
                            <RadioButton id="status2" name="status" value="미사용" v-model="search.status" />
                            <label for="status2" class="ml-2">미사용</label>
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </Toolbar>

    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="items" :columns="columns" v-model:selectedItem="selectedItems[modalType]" @confirm="selectModalValue" />
</template>
