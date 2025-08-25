<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['flowchartFilterSearch']);

// 모달 관련
const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItems = ref({
    flowName: null,
    productId: null,
    productName: null
});

// 검색 조건
const search = ref({
    flowId: '',
    flowName: '',
    productId: '',
    productName: '',
    status: ''
});

// 선택필터초기화
const resetSearch = () => {
    search.value.flowId = '';
    search.value.flowName = '';
    search.value.productId = '';
    search.value.productName = '';
    search.value.status = '';

    // 모달 선택값 초기화
    Object.keys(selectedItems.value).forEach((key) => {
        selectedItems.value[key] = null;
    });

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

    if (type === 'flowName') {
        const res = await axios.get('/api/information/flowchart/getFlowName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            flowName: item.flow_name
        }));
        columns.value = [{ field: 'flowName', header: '흐름도명' }];
    }    else if (type === 'productId') {
        const res = await axios.get('/api/information//flowchart/getProductId');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            productId: item.product_id,
            productName: item.product_name,
            productType: item.product_type,
            productForm: item.product_form
        }));
        columns.value = [
            { field: 'productId', header: '제품코드' },
            { field: 'productName', header: '제품명' },
            { field: 'productType', header: '제품유형' },
            { field: 'productForm', header: '제품형태' }
        ];
    } else if (type === 'productName') {
        const res = await axios.get('/api/information/flowchart/getProductName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            productName: item.product_name
        }));
        columns.value = [{ field: 'productName', header: '제품명' }];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    const selectedItem = selectedItems.value[modalType.value];
    if (!selectedItem) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    if (modalType.value === 'flowName') {
        search.value.flowName = selectedItem.flowName;
    } else if (modalType.value === 'productId') {
        search.value.productId = selectedItem.productId;
    } else if (modalType.value === 'productName') {
        search.value.productName = selectedItem.productName;
    }

    showModal.value = false;
};



// 검색
const selectSearch = async () => {
    try {
        const payload = {
            flowId: search.value.flowId || null,
            flowName: search.value.flowName || null,
            productId: search.value.productId || null,
            productName: search.value.productName || null,
            status: search.value.status || null
        };

        const res = await axios.post('/api/information/flowchart/search', payload);
        console.log(res.data.result);
        emits('flowchartFilterSearch', res.data.result);
    } catch (err) {
        console.log('flowchart 검색실패');
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
                <!-- 흐름도코드 -->
                <div class="flex items-center gap-2">
                    <label for="flowId" class="whitespace-nowrap">흐름도코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="flowId" type="text" class="w-60" v-model="search.flowId" />
                    </IconField>
                </div>

                <!-- 흐름도명 -->
                <div class="flex items-center gap-2">
                    <label for="flowName" class="whitespace-nowrap">흐름도명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="flowName" type="text" class="w-60" v-model="search.flowName" />
                        <InputIcon class="pi pi-search" @click="openModal('flowName')" />
                    </IconField>
                </div>

                <!-- 제품코드 -->
                <div class="flex items-center gap-2">
                    <label for="productId" class="whitespace-nowrap">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="productId" type="text" class="w-60" v-model="search.productId" />
                        <InputIcon class="pi pi-search" @click="openModal('productId')" />
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

                <!-- 상태 라디오 그룹 -->
                <div class="flex items-center gap-2">
                    <label for="status" class="whitespace-nowrap">상태</label>
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
