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
    bomId: '',
    prodId: '',
    prodName: '',
    prodForm: '',
    prodType: '',
    status: ''
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
            prodId: item.product_id,
            prodName: item.product_name,
            prodType: item.product_type,
            prodForm: item.product_form
        }));
        columns.value = [
            { field: 'prodId', header: '제품코드' },
            { field: 'prodName', header: '제품명' },
            { field: 'prodType', header: '제품유형' },
            { field: 'prodForm', header: '제품형태' }
        ];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    form.value.prodId = selectedItem.value.prodId;
    form.value.prodName = selectedItem.value.prodName;

    showModal.value = false;
};

watch(
    () => props.items,
    (newVal) => {
        if (newVal && newVal.length) {
            form.value = { ...newVal[0], bomId: newVal[0].bomId?.trim() || '' };
        } else {
            form.value = {
                bomId: '',
                prodId: '',
                prodType: '',
                status: ''
            };
        }
    },
    { immediate: true }
);

const registBom = async () => {
    if (!form.value.prodId) {
        alert('제품코드를 선택해주세요.');
        return;
    }
    if (!form.value.status) {
        alert('상태를 선택해주세요.');
        return;
    }
    if (props.detailData.length === 0) {
        alert('BOM 상세 항목을 추가해주세요.');
        return;
    }

    try {
        const payload = {
            bomInfo: {
                // 서버에서 받을 기본 정보
                bomId: form.value.bomId,
                prodId: form.value.prodId,
                prodName: form.value.prodName,
                prodType: form.value.prodType,
                status: form.value.status
            },
            bomDetails: props.detailData // 서버에서 받을 상세 리스트
        };

        const res = await axios.post('/api/information/bom', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        alert(res.data.message || '등록 성공');
    } catch (err) {
        console.error(err);
        alert('등록 실패');
    }
};

const modifyBom = async () => {
    try {
        const res = await axios.post('/api/information/bom/modify', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('bom 수정실패');
    }
};

const resetRegist = () => {
    if (form.value.bomId?.trim()) {
        // 수정 상태: 현재 선택된 데이터를 다시 form에 반영
        if (props.items && props.items.length) {
            form.value = { ...props.items[0], bomId: props.items[0].bomId?.trim() || '' };
        }
    } else {
        // 등록 상태: 전체 필드 초기화
        form.value = {
            bomId: '',
            prodId: '',
            prodName: '',
            prodForm: '',
            prodType: '',
            status: ''
        };
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록</div>
        <div class="space-x-2">
            <Button label=" 등록 " size="small" rounded @click="registBom()" :disabled="form.bomId?.trim() !== ''" />
            <Button label=" 수정 " size="small" rounded :disabled="form.bomId?.trim() === ''" @click="modifyBom()" />
            <Button label=" 초기화 " size="small" severity="info" rounded @click="resetRegist()" />
        </div>
    </div>
    <div class="card p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="w-1/4">
                <label class="block mb-1">BOM코드</label>
                <InputText v-model="form.bomId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
            </div>
            <div class="w-1/4">
                <label class="block mb-1">제품명</label>
                <InputText v-model="form.prodName" class="w-full" />
            </div>

            <div class="w-1/4">
                <label class="block mb-1">제품코드</label>
                <IconField iconPosition="left" class="w-full">
                    <InputText v-model="form.prodId" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openModal('productId')" />
                </IconField>
            </div>
            <div style="display: flex; gap: 20px" class="w-1/4">
                <label class="block mb-1" style="text-align: center">상태</label>
                <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                    <RadioButton id="status1" name="status" value="활성" v-model="form.status" />
                    <label for="status1" class="ml-2 mr-4">활성</label>
                    <RadioButton id="status2" name="status" value="비활성" v-model="form.status" />
                    <label for="status1" class="ml-2 mr-4">비활성</label>
                </label>
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
