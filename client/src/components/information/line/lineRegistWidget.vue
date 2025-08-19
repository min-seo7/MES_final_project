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

const form = ref({
    lineId: '',
    lineName: '',
    flowId: '',
    productId: '',
    productName: '',
    note: '',
    status: ''
});

const item = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

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
            form.value = { ...newVal[0], lineId: newVal[0].lineId?.trim() || '' };
        } else {
            form.value = {
                lineId: '',
                lineName: '',
                flowId: '',
                productId: '',
                note: '',
                status: ''
            };
        }
    },
    { immediate: true }
);

const registLine = async () => {
    if (!form.value.productId) {
        alert('제품코드를 선택해주세요.');
        return;
    }
    if (!form.value.status) {
        alert('상태를 선택해주세요.');
        return;
    }
    if (props.detailData.length === 0) {
        alert('Line 상세 항목을 추가해주세요.');
        return;
    }

    try {
        const payload = {
            lineInfo: {
                // 서버에서 받을 기본 정보
                lineId: form.value.lineId,
                lineName: form.value.lineName,
                flowId: form.value.flowId,
                productId: form.value.productId,
                note: form.value.note,
                status: form.value.status
            },
            lineDetails: props.detailData // 서버에서 받을 상세 리스트
        };

        const res = await axios.post('/api/information/line', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        alert(res.data.message || '등록 성공');
    } catch (err) {
        console.error(err);
        alert('등록 실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registLine()" :disabled="form.lineId?.trim() !== ''" />
            <Button label=" 수정 " rounded :disabled="form.lineId?.trim() === ''" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">라인코드</label>
                    <InputText v-model="form.lineId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
                </div>
                <div>
                    <label class="block mb-1">제품코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText v-model="form.productId" class="w-full" />
                        <InputIcon class="pi pi-search" @click="openModal('productId')" />
                    </IconField>
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">상태</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="활성" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">활성</label>
                        <RadioButton id="status2" name="status" value="비활성" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">비활성</label>
                    </label>
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">라인명</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.lineName" class="w-full" />
                    </div>
                </div>
                <div>
                    <label class="block mb-1">제품명</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.productName" class="w-full" />
                    </div>
                </div>
                <div>
                    <label class="block mb-1">비고</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.note" class="w-full" />
                    </div>
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
