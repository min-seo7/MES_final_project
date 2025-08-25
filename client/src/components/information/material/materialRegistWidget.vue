<script setup>
import { ref, defineProps, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    }
});

const form = ref({
    materialType: '',
    materialId: '',
    materialName: '',
    storageCondition: '',
    specification: '',
    unit: '',
    safetyStock: '',
    safetyStockUnit: '',
    status: ''
});

watch(
    () => props.items,
    (newVal) => {
        if (newVal && newVal.length) {
            form.value = { ...newVal[0], materialId: newVal[0].materialId?.trim() || '' };
        } else {
            form.value = {
                materialType: '',
                materialId: '',
                materialName: '',
                storageCondition: '',
                specification: '',
                unit: '',
                safetyStock: '',
                safetyStockUnit: '',
                status: ''
            };
        }
    },
    { immediate: true }
);

const registMaterial = async () => {
    try {
        const res = await axios.post('/api/information/material', form.value);
        
        form.value = {
            materialType: '',
            materialId: '',
            materialName: '',
            storageCondition: '',
            specification: '',
            unit: '',
            safetyStock: '',
            safetyStockUnit: '',
            status: ''
        };
        alert('등록이 완료되었습니다.');
        return res;
    } catch (err) {
        alert('등록할 수 없습니다.');
    }
};

const modifyMatrerial = async () => {
    try {
        const res = await axios.post('/api/information/material/modify', form.value);
        form.value = {
            materialType: '',
            materialId: '',
            materialName: '',
            storageCondition: '',
            specification: '',
            unit: '',
            safetyStock: '',
            safetyStockUnit: '',
            status: ''
        };
        alert('수정이 완료되었습니다.');
    } catch (err) {
        alert('수정할 수 없습니다.');
    }
};

const resetRegist = async () => {
    if (form.value.materialId?.trim()) {
        // 수정 상태: 현재 선택된 데이터를 다시 form에 반영
        if (props.items && props.items.length) {
            form.value = { ...props.items[0], materialId: props.items[0].materialId?.trim() || '' };
        }
    } else {
        // 등록 상태: 전체 필드 초기화
        form.value = {
            materialType: '',
            materialId: '',
            materialName: '',
            storageCondition: '',
            specification: '',
            unit: '',
            safetyStock: '',
            safetyStockUnit: '',
            status: ''
        };
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div></div>
        <div class="space-x-2">
            <Button label=" 등록 " size="small" rounded @click="registMaterial()" :disabled="form.materialId?.trim() !== ''" />
            <Button label=" 수정 " size="small" rounded :disabled="form.materialId?.trim() === ''" @click="modifyMatrerial()" />
            <Button label=" 초기화 " size="small" severity="info" rounded @click="resetRegist()" />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">자재코드</label>
                    <InputText v-model="form.materialId" class="w-full bg-gray-200" readonly="true" placeholder="자동생성" style="background-color: lightgrey"/>
                </div>
                <div>
                    <label class="block mb-1">자재유형</label>
                    <div class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="materialType1" name="materialType" value="원자재" v-model="form.materialType" />
                        <label for="materialType1" class="ml-2 mr-4">원자재</label>
                        <RadioButton id="materialType2" name="materialType" value="부자재" v-model="form.materialType" />
                        <label for="materialType2" class="ml-2 mr-4">부자재</label>
                    </div>
                </div>
                <div>
                    <label class="block mb-1">규격</label>
                    <div class="flex gap-4 items-center">
                        <InputText v-model="form.specification" class="flex-1" />
                        <div class="flex flex-1 items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="unit1" name="unit" value="kg" v-model="form.unit" />
                            <label for="unit1" class="ml-2 mr-4">kg</label>
                            <RadioButton id="unit2" name="unit" value="L" v-model="form.unit" />
                            <label for="unit2" class="ml-2 mr-4">L</label>
                            <RadioButton id="unit3" name="unit" value="EA" v-model="form.unit" />
                            <label for="unit3" class="ml-2 mr-4">EA</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block mb-1">상태</label>
                    <div class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="사용" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">사용</label>
                        <RadioButton id="status2" name="status" value="미사용" v-model="form.status" />
                        <label for="status2" class="ml-2 mr-4">미사용</label>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">자재명</label>
                    <InputText v-model="form.materialName" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">보관조건</label>
                    <InputText v-model="form.storageCondition" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">안전재고</label>
                    <div class="flex gap-4 items-center">
                        <InputText v-model="form.safetyStock" class="flex-1" />
                        <div class="flex flex-1 items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="safetyStockUnit1" name="safetyStockUnit" value="kg" v-model="form.safetyStockUnit" />
                            <label for="safetyStockUnit1" class="ml-2 mr-4">kg</label>
                            <RadioButton id="safetyStockUnit2" name="safetyStockUnit" value="L" v-model="form.safetyStockUnit" />
                            <label for="safetyStockUnit2" class="ml-2 mr-4">L</label>
                            <RadioButton id="safetyStockUnit3" name="safetyStockUnit" value="EA" v-model="form.safetyStockUnit" />
                            <label for="safetyStockUnit3" class="ml-2 mr-4">EA</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.font-semibold.text-xl.mb-4 {
    margin: 0;
}
</style>
