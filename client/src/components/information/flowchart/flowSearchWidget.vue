<script setup>import { ref, defineEmits } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['flowchartFilterSearch']);

const items = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const search = ref({
    flowchartId: '',
    flowchartName: '',
    productId: '',
    productName: '',
    status: ''
});

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'flowchartName') {
        resetSearch();
        const res = await axios.get('/api/information/flowchart/getFlowchartName');
        items.value = res.data.map((item, index) => ({
            num: index + 1,
            flowchartName: item.flow_name,
        }));
        columns.value = [
            { field: 'flowchartName', header: '흐름도명' },
        ];
    } 
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    search.value.flowchartId = selectedItem.value.flowchartId;
    search.value.flowchartName = selectedItem.value.flowchartName;
    search.value.productId = selectedItem.value.productId;
    search.value.productName = selectedItem.value.productName;
    search.value.status = selectedItem.value.status;

    showModal.value = false;
};

// 선택필터초기화
const resetSearch = () => {
    search.value.flowchartId = '';
    search.value.flowchartName = '';
    search.value.productId = '';
    search.value.productName = '';
    search.value.status = '';
    selectedItem.value = null;
};

// 검색
const selectSearch = async () => {
    try {
        const payload = {
            flowchartId: search.value.flowchartId || null,
            flowchartName: search.value.flowchartName || null,
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
};</script>

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
                <!-- 흐름도코드 -->
                <div class="flex items-center gap-2">
                    <label for="flowchartId" class="whitespace-nowrap">흐름도코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="flowchartId" type="text" class="w-60" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>

                <!-- 흐름도명 -->
                <div class="flex items-center gap-2">
                    <label for="flowchartName" class="whitespace-nowrap">흐름도명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="flowchartName" type="text" class="w-60" v-model="search.flowchartName"/>
                        <InputIcon class="pi pi-search" @click = "openModal(flowchartName)"/>
                    </IconField>
                </div>

                <!-- 제품코드 -->
                <div class="flex items-center gap-2">
                    <label for="productId" class="whitespace-nowrap">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="productId" type="text" class="w-60" v-model="search.productId"/>
                        <InputIcon class="pi pi-search" @click = "openModal(productName)" />
                    </IconField>
                </div>

                <!-- 제품명 -->
                <div class="flex items-center gap-2">
                    <label for="productName" class="whitespace-nowrap">제품명</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText id="productName" type="text" class="w-60" v-model="search.productName"/>
                        <InputIcon class="pi pi-search" @click = "openModal(productName)"/>
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
