<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['productFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const search = ref({
    productId: '',
    productName: '',
    productType: '',
    productForm: '',
    status: ''
});

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'productName') {
        resetSearch();
        const res = await axios.get('/api/information/product/getProductName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            productName: item.product_name,
            productId: item.product_id
        }));
        columns.value = [
            { field: 'productName', header: '제품명' },
            { field: 'productId', header: '제품코드' }
        ];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    search.value.productId = selectedItem.value.productId;
    search.value.productName = selectedItem.value.productName;
    search.value.productType = selectedItem.value.productType;
    search.value.productForm = selectedItem.value.productForm;
    search.value.status = selectedItem.value.status;

    showModal.value = false;
};

// 선택필터초기화
const resetSearch = () => {
    search.value.productId = '';
    search.value.productName = '';
    search.value.productType = '';
    search.value.productForm = '';
    search.value.status = '';
    selectedItem.value = null;

    selectSearch();
};

// 검색
const selectSearch = async () => {
    try {
        const payload = {
            productId: search.value.productId || null,
            productName: search.value.productName || null,
            productType: search.value.productType || null,
            productForm: search.value.productForm || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/product/search', payload);
        console.log(res.data.result);
        emits('productFilterSearch', res.data.result);
    } catch (err) {
        console.log('product 검색실패');
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
                <!-- 제품코드 -->
                <div class="flex items-center gap-2">
                    <label for="productId" class="whitespace-nowrap">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="productId" type="text" class="w-60" v-model="search.productId" />
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

                <!-- 제품유형 -->
                <div class="flex items-center gap-2">
                    <label for="productType" class="whitespace-nowrap">제품유형</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="productType1" name="auth" value="반제품" v-model="search.productType" />
                            <label for="productType1" class="ml-2 mr-4">반제품</label>
                            <RadioButton id="productType2" name="auth" value="완제품" v-model="search.productType" />
                            <label for="productType2" class="ml-2 mr-4">완제품</label>
                        </label>
                    </div>
                </div>

                <!-- 제품형태 -->
                <div class="flex items-center gap-2">
                    <label for="productForm" class="whitespace-nowrap">제품형태</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="productForm1" name="status" value="분말형" v-model="search.productForm" />
                            <label for="productForm1" class="ml-2 mr-4">분말형</label>
                            <RadioButton id="productForm2" name="status" value="과립형" v-model="search.productForm" />
                            <label for="productForm2" class="ml-2 mr-4">과립형</label>
                            <RadioButton id="productForm3" name="status" value="액상형" v-model="search.productForm" />
                            <label for="productForm3" class="ml-2">액상형</label>
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
