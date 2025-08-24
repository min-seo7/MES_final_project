<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['bomFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const search = ref({
    bomId: '',
    productName: '',
    productType: '',
    status: ''
});

// 선택필터초기화
const resetSearch = () => {
    search.value.bomId = '';
    search.value.productName = '';
    search.value.productType = '';
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

    if (type === 'productName') {
        resetSearch();
        const res = await axios.get('/api/information/bom/getProductName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            productName: item.product_name,
            productId: item.product_id,
            productType: item.product_type,
            productForm: item.product_form
        }));
        columns.value = [
            { field: 'productName', header: '제품명' },
            { field: 'productId', header: '제품코드' },
            { field: 'productType', header: '제품유형' },
            { field: 'productForm', header: '제품형태' }
        ];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    search.value.bomId = selectedItem.value.bomId;
    search.value.productName = selectedItem.value.productName;
    search.value.productType = selectedItem.value.productType;
    search.value.status = selectedItem.value.status;

    showModal.value = false;
};


// 검색
const selectSearch = async () => {
    try {
        const payload = {
            bomId: search.value.bomId || null,
            productName: search.value.productName || null,
            productType: search.value.productType || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/bom/search', payload);
        console.log(res.data.result);
        emits('bomFilterSearch', res.data.result);
    } catch (err) {
        console.log('bom검색실패');
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
                <!-- BOM번호 -->
                <div class="flex items-center gap-2">
                    <label for="bomCode" class="whitespace-nowrap">BOM번호</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="name2" type="text" class="w-60" v-model="search.bomId" />
                    </IconField>
                </div>

                <!-- 제품명 -->
                <div class="flex items-center gap-2">
                    <label for="productName" class="whitespace-nowrap">제품명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="productName" type="text" class="w-60" v-model="search.productName" />
                        <InputIcon class="pi pi-search" @click="openModal('productName')" />
                    </IconField>
                </div>

                <!-- 제품유형 라디오 그룹 -->

                <div class="flex items-center gap-2">
                    <label for="materialCode" class="whitespace-nowrap">제품유형</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="prodType1" name="prodType" value="반제품" v-model="search.productType" />
                            <label for="prodType1" class="ml-2 mr-4">반제품</label>
                            <RadioButton id="prodType2" name="prodType" value="완제품" v-model="search.productType" />
                            <label for="prodType2" class="ml-2">완제품</label>
                        </label>
                    </div>
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
