<script setup>
import { ref, defineProps, watch } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const props = defineProps({
    detailData: {
        type: Array,
        default: () => []
    },
    items: {
        type: Array,
        default: () => []
    }
});

const item = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const form = ref({
    flowId: '',
    flowName: '',
    productId: '',
    productName: '',
    note: '',
    status: '',
    flowchart: ''
});

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'productId') {
        const res = await axios.get('/api/information//flowchart/getProductId');
        item.value = res.data.map((item, index) => ({
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
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    form.value.productId = selectedItem.value.productId;
    form.value.productName = selectedItem.value.productName;

    showModal.value = false;
};

watch(
    () => props.items,
    (newVal) => {
        if (newVal && newVal.length) {
            form.value = { ...newVal[0], flowId: newVal[0].flowId?.trim() || '' };
        } else {
            form.value = {
                flowId: '',
                flowName: '',
                productId: '',
                productName: '',
                note: '',
                status: '',
                flowchart: ''
            };
        }
    },
    { immediate: true }
);

const registFlowchart = async () => {
    if (!form.value.productId) {
        alert('제품코드를 선택해주세요.');
        return;
    }
    if (!form.value.status) {
        alert('상태를 선택해주세요.');
        return;
    }
    if (props.detailData.length === 0) {
        alert('공정흐름도 상세 항목을 추가해주세요.');
        return;
    }
    try {
        const payload = {
            flowchartInfo: {
                // 서버에서 받을 기본 정보
                flowId: form.value.flowId,
                flowName: form.value.flowName,
                productId: form.value.productId,
                productName: form.value.productName,
                note: form.value.note,
                status: form.value.status,
                flowchart: form.value.flowchart
            },
            flowchartDetails: props.detailData // 서버에서 받을 상세 리스트
        };
        console.log('보내는 데이터:', form.value);
        const res = await axios.post('/api/information/flowchart', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        alert(res.data.message || '등록 성공');
    } catch (err) {
        console.error(err);
        alert('등록 실패');
    }
};

const modifyFlow = async () => {
    try {
        const res = await axios.post('/api/information/flowchart/modify', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('흐름도 수정실패');
    }
};

const resetRegist = async () => {
    if (form.value.flowId?.trim()) {
        // 수정 상태: 현재 선택된 데이터를 다시 form에 반영
        if (props.items && props.items.length) {
            form.value = { ...props.items[0], flowId: props.items[0].flowId?.trim() || '' };
        }
    } else {
        // 등록 상태: 전체 필드 초기화
        form.value = {
            flowId: '',
            flowName: '',
            productId: '',
            productName: '',
            note: '',
            status: '',
            flowchart: ''
        };
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div></div>
        <div class="space-x-2">
            <Button label=" 등록 " size="small" rounded @click="registFlowchart()" :disabled="form.flowId?.trim() !== ''" />
            <Button label=" 수정 " size="small" rounded :disabled="form.flowId?.trim() === ''" @click="modifyFlow()" />
            <Button label=" 초기화 " size="small" severity="info" rounded @click="resetRegist()" />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1 md:w-1/2">흐름도코드</label>
                    <InputText v-model="form.flowId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
                </div>
                <div>
                    <label class="block mb-1">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText v-model="form.productId" class="w-full" />
                        <InputIcon class="pi pi-search" @click="openModal('productId')" />
                    </IconField>
                </div>
                <div>
                    <label class="block mb-1">비고</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.note" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">흐름도</label>
                    <InputText v-model="form.flowchart" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">제품명</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.productName" class="w-full" />
                    </div>
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">상태</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="사용" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">사용</label>
                        <RadioButton id="status2" name="status" value="미사용" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">미사용</label>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="item" :columns="columns" v-model:selectedItem="selectedItem" @confirm="selectModalValue" />
</template>

<style scoped>
.font-semibold.text-xl.mb-4 {
    margin: 0;
}
</style>
