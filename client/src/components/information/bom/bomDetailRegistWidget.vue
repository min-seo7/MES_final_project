<script setup>
import { ref, defineEmits } from 'vue';
import axios from 'axios';
import CommonModal from '@/components/common/modal.vue';

const emits = defineEmits(['bomDetail']);

const item = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const form = ref({
    materialId: '',
    materialName: '',
    materialType: '',
    unit: '',
    mixRatio: '',
    requiredQty: '',
    totalQty: '',
    status: ''
});

const resetRegist = async () => {

// 등록 상태: 전체 필드 초기화
form.value = {
    materialId: '',
    materialName: '',
    materialType: '',
    unit: '',
    mixRatio: '',
    requiredQty: '',
    totalQty: '',
    status: ''
};}

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;
    selectedItem.value = null;

    if (type === 'materialId') {
        const res = await axios.get('/api/information/material/getMaterialName');
        item.value = res.data.map((item, index) => ({
            num: index + 1,
            materialId: item.material_id,
            materialName: item.material_name,
            materialType: item.material_type
        }));
        columns.value = [
            { field: 'materialId', header: '자재코드' },
            { field: 'materialName', header: '자재명' },
            { field: 'materialType', header: '자재유형' }
        ];
    }
};

// 모달 선택 완료
const selectModalValue = () => {
    if (!selectedItem.value) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    form.value.materialId = selectedItem.value.materialId;
    form.value.materialName = selectedItem.value.materialName;

    showModal.value = false;
};

// 숫자 이외에는 입력을 막는 코드
const isComposing = ref(false);

const sanitizeNumber = (event) => {
    if (isComposing.value) return; // 조합 중이면 아직 필터링하지 않음
    filterNumber(event);
};

const onCompositionEnd = (event) => {
    isComposing.value = false;
    filterNumber(event); // 조합 끝나면 필터링
};

const filterNumber = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9.]/g, ''); // 숫자 + 소수점만 남기기
    const parts = value.split('.');
    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
    event.target.value = value;
    form.value.mixRatio = value;
};

const addBOMdetail = () => {
    if (!form.value.materialId) {
        alert('자재코드를 선택해주세요.');
        return;
    } else if (!form.value.requiredQty) {
        alert('소요량을 선택해주세요.');
        return;
    } else if (!form.value.totalQty) {
        alert('총소요량을 선택해주세요.');
        return;
    } else if (!form.value.mixRatio) {
        alert('혼합율를 선택해주세요.');
        return;
    }
    emits('bomDetail', form.value);
    form.value = {
    materialId: '',
    materialName: '',
    materialType: '',
    unit: '',
    mixRatio: '',
    requiredQty: '',
    totalQty: '',
    status: ''}
}
</script>

<template>
    <div class="card p-2 border rounded relative mt-4"> <div class="absolute top-2 right-2 z-10">
            <div class="space-x-2">
                <Button label=" 추가 " size="small" rounded @click="addBOMdetail()" />
                <Button label=" 초기화 " size="small" severity="info" rounded @click="resetRegist()"/>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <div class="flex flex-row gap-6 w-full">
                <div class="flex-1">
                    <label class="block mb-1">자재코드</label>
                    <IconField iconPosition="left" class="w-full">
                        <InputText v-model="form.materialId" class="w-full" />
                        <InputIcon class="pi pi-search" @click="openModal('materialId')" />
                    </IconField>
                </div>
                <div class="flex-1">
                    <label class="block mb-1">자재명</label>
                    <InputText v-model="form.materialName" class="w-full" />
                </div>
            </div>
            
            <div class="flex flex-row gap-6 w-full">
                <div class="flex-1">
                    <label class="block mb-1">단위</label>
                    <div class="flex items-center border rounded h-[38px] px-3">
                        <div class="flex items-center mr-4">
                            <RadioButton id="unit1" name="unit" value="kg" v-model="form.unit" />
                            <label for="unit1" class="ml-2">kg</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="unit2" name="unit" value="L" v-model="form.unit" />
                            <label for="unit2" class="ml-2">L</label>
                        </div>
                    </div>
                </div>
                <div class="flex-1">
                    <label class="block mb-1">소요량</label>
                    <InputText v-model="form.requiredQty" class="w-full" placeholder="숫자 입력 (소수점 가능)"/>
                </div>
                <div class="flex-1">
                    <label class="block mb-1">총소요량</label>
                    <InputText v-model="form.totalQty" class="w-full" placeholder="숫자 입력 (소수점 가능)"/>
                </div>
            </div>
            <div class="flex flex-row gap-6 w-full">
                <div class="flex-1">
                    <label class="block mb-1">혼합율</label>
                    <InputText v-model="form.mixRatio" class="w-full" placeholder="숫자 입력 (소수점 가능)" @input="sanitizeNumber" @compositionstart="isComposing = true" @compositionend="onCompositionEnd" />
                </div>
                <div class="flex-1">
                    <label class="block mb-1">상태</label>
                    <div class="flex items-center border rounded h-[38px] px-3">
                        <div class="flex items-center mr-4">
                            <RadioButton id="status1" name="status" value="사용" v-model="form.status" />
                            <label for="status1" class="ml-2">사용</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton id="status2" name="status" value="미사용" v-model="form.status" />
                            <label for="status2" class="ml-2">미사용</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="item" :columns="columns" v-model:selectedItem="selectedItem" @confirm="selectModalValue" />
</template>

<style scoped>
/* 기존 스타일은 유지 */
.flex-1 {
    flex: 1;
}
</style>
