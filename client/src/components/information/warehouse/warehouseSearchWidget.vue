<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['warehouseFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const search = ref({
    warehouseId: '',
    warehouse: '',
    location: '',
    warehouseType: '',
    status: ''
});

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'warehouse') {
        resetSearch();
        const res = await axios.get('/api/information/warehouse/getWarehouse');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            warehouse: item.warehouse
        }));
        columns.value = [{ field: 'warehouse', header: '창고' }];
    } else if (type === 'location') {
        resetSearch();
        const res = await axios.get('/api/information/warehouse/getLocation');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            location: item.location
        }));
        columns.value = [{ field: 'location', header: '위치' }];
    } else if (type === 'warehouseType') {
        resetSearch();
        const res = await axios.get('/api/information/warehouse/getWarehouseType');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            warehouseType: item.warehouse_type
        }));
        columns.value = [{ field: 'warehouseType', header: '창고유형' }];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    search.value.warehouseId = selectedItem.value.warehouseId;
    search.value.warehouse = selectedItem.value.warehouse;
    search.value.location = selectedItem.value.location;
    search.value.warehouseType = selectedItem.value.warehouseType;
    search.value.status = selectedItem.value.status;

    showModal.value = false;
};

// 선택필터초기화
const resetSearch = () => {
    search.value.warehouseId = '';
    search.value.warehouse = '';
    search.value.location = '';
    search.value.warehouseType = '';
    search.value.status = '';
    selectedItem.value = null;

    selectSearch();
};

// 검색
const selectSearch = async () => {
    try {
        const payload = {
            warehouseId: search.value.warehouseId || null,
            warehouse: search.value.warehouse || null,
            location: search.value.location || null,
            warehouseType: search.value.warehouseType || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/warehouse/search', payload);
        console.log(res.data.result);
        emits('warehouseFilterSearch', res.data.result);
    } catch (err) {
        console.log('warehouse 검색실패');
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
                <!-- 창고번호 -->
                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">창고코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="warehouseId" type="text" class="w-60" v-model="search.warehouseId" />
                    </IconField>
                </div>

                <!-- 창고 -->
                <div class="flex items-center gap-2">
                    <label for="warehouse" class="whitespace-nowrap">창고</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="warehouse" type="text" class="w-60" v-model="search.warehouse" />
                        <InputIcon class="pi pi-search" @click="openModal('warehouse')" />
                    </IconField>
                </div>

                <!-- 위치 -->
                <div class="flex items-center gap-2">
                    <label for="location" class="whitespace-nowrap">위치</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="location" type="text" class="w-60" v-model="search.location" />
                        <InputIcon class="pi pi-search" @click="openModal('location')" />
                    </IconField>
                </div>

                <!-- 창고유형 -->
                <div class="flex items-center gap-2">
                    <label for="warehouseType" class="whitespace-nowrap">창고유형</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="warehouseType" type="text" class="w-60" v-model="search.warehouseType" />
                        <InputIcon class="pi pi-search" @click="openModal('warehouseType')" />
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
