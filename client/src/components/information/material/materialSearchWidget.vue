<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['materialFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const search = ref({
    materialId: '',
    materialName: '',
    status: ''
});

// 선택필터초기화
const resetSearch = () => {
    search.value.materialId = '';
    search.value.materialName = '';
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

    if (type === 'materialName') {
        resetSearch();
        const res = await axios.get('/api/information/material/getMaterialName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            materialName: item.material_name
        }));
        columns.value = [{ field: 'materialName', header: '자재명' }];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    search.value.materialId = selectedItem.value.materialId;
    search.value.materialName = selectedItem.value.materialName;
    search.value.status = selectedItem.value.status;

    showModal.value = false;
};


// 검색
const selectSearch = async () => {
    try {
        const payload = {
            materialId: search.value.materialId || null,
            materialName: search.value.materialName || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/material/search', payload);
        console.log(res.data.result);
        emits('materialFilterSearch', res.data.result);
    } catch (err) {
        console.log('material 검색실패');
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
                <!-- 자재코드 -->
                <div class="flex items-center gap-2">
                    <label for="materialId" class="whitespace-nowrap">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="materialId" type="text" class="w-60" v-model="search.materialId" />
                    </IconField>
                </div>

                <!-- 자재명 -->
                <div class="flex items-center gap-2">
                    <label for="materialName" class="whitespace-nowrap">자재명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="materialName" type="text" class="w-60" v-model="search.materialName" />
                        <InputIcon class="pi pi-search" @click="openModal('materialName')" />
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

    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="items" :columns="columns" v-model:selectedItem="selectedItem" :showFilter="modalType === 'employeeId'" @confirm="selectModalValue" />
</template>
