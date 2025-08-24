<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['processFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const search = ref({
    processId: '',
    processName: '',
    status: ''
});

// 선택필터초기화
const resetSearch = () => {
    search.value.processId = '';
    search.value.processName = '';
    search.value.status = '';
    selectedItem.value = null;

    selectSearch();
    onReset();
};
const onReset = () => {
    emits('resetForm');
};

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'processName') {
        resetSearch();
        const res = await axios.get('/api/information/process/getProcessName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            processName: item.process_name
        }));
        columns.value = [{ field: 'processName', header: '공정명' }];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    search.value.processId = selectedItem.value.processId;
    search.value.processName = selectedItem.value.processName;
    search.value.status = selectedItem.value.status;

    showModal.value = false;
};


// 검색
const selectSearch = async () => {
    try {
        const payload = {
            processId: search.value.processId || null,
            processName: search.value.processName || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/process/search', payload);
        console.log(res.data.result);
        emits('processFilterSearch', res.data.result);
    } catch (err) {
        console.log('process 검색실패');
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
            <Button label=" 조회 " size="small" rounded @click="selectSearch"></Button>
            <Button label=" 초기화 " size="small" severity="info" rounded @click="resetSearch"></Button>
        </div>
    </div>

    <Toolbar>
        <template #center>
            <div class="flex items-center gap-6">
                <!-- 공정코드 -->
                <div class="flex items-center gap-2">
                    <label for="processId" class="whitespace-nowrap">공정코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="processId" type="text" class="w-60" v-model="search.processId" />
                    </IconField>
                </div>

                <!-- 공정명 -->
                <div class="flex items-center gap-2">
                    <label for="processName" class="whitespace-nowrap">공정명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="processName" type="text" class="w-60" v-model="search.processName" />
                        <InputIcon class="pi pi-search" @click="openModal('processName')" />
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
    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="items" :columns="columns" v-model:selectedItem="selectedItem" @confirm="selectModalValue" />
</template>
