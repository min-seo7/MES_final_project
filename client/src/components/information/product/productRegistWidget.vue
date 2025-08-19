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
    productType: '',
    productId: '',
    productForm: '',
    productName: '',
    specification: '',
    unit: '',
    safetyStock: '',
    safetyStockUnit: '',
    expiration: '',
    expirationUnit: '',
    status: '',
    manual: '',
    storageCondition: ''
});

watch(
    () => props.items,
    (newVal) => {
        if (newVal && newVal.length) {
            form.value = { ...newVal[0], productId: newVal[0].productId?.trim() || '' };
        } else {
            form.value = {
                productType: '',
                productId: '',
                productForm: '',
                productName: '',
                specification: '',
                unit: '',
                safetyStock: '',
                safetyStockUnit: '',
                expiration: '',
                expirationUnit: '',
                status: '',
                manual: '',
                storageCondition: ''
            };
        }
    },
    { immediate: true }
);

const registProduct = async () => {
    try {
        const res = await axios.post('/api/information/product', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('제품등록실패');
    }
};

const resetRegist = () => {
    if (form.value.productId?.trim()) {
        // 수정 상태: 현재 선택된 데이터를 다시 form에 반영
        if (props.items && props.items.length) {
            form.value = { ...props.items[0], productId: props.items[0].productId?.trim() || '' };
        }
    } else {
        // 등록 상태: 전체 필드 초기화
        form.value = {
            productType: '',
            productId: '',
            productForm: '',
            productName: '',
            specification: '',
            unit: '',
            safetyStock: '',
            safetyStockUnit: '',
            expiration: '',
            expirationUnit: '',
            status: '',
            manual: '',
            storageCondition: ''
        };
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록/수정</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registProduct()" :disabled="form.productId?.trim() !== ''" />
            <Button label=" 수정 " rounded :disabled="form.productId?.trim() === ''" />
            <Button label=" 초기화 " severity="info" rounded @click="resetRegist()" />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <label for="productType" class="whitespace-nowrap">제품유형</label>
                <div class="flex items-center">
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="productType1" name="productType" value="반제품" v-model="form.productType" />
                        <label for="productType1" class="ml-2 mr-4">반제품</label>
                        <RadioButton id="productType2" name="productType" value="완제품" v-model="form.productType" />
                        <label for="productType2" class="ml-2 mr-4">완제품</label>
                    </label>
                </div>
                <div>
                    <label for="productForm" class="whitespace-nowrap">제품형태</label>
                    <div class="flex items-center">
                        <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="productForm1" name="productForm" value="분말형" v-model="form.productForm" />
                            <label for="productForm1" class="ml-2 mr-4">분말형</label>
                            <RadioButton id="productForm2" name="productForm" value="과립형" v-model="form.productForm" />
                            <label for="productForm2" class="ml-2 mr-4">과립형</label>
                            <RadioButton id="productForm3" name="productForm" value="액상형" v-model="form.productForm" />
                            <label for="productForm3" class="ml-2">액상형</label>
                        </label>
                    </div>
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">규격</label>
                    <InputText v-model="form.specification" class="w-half" />
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="unit1" name="unit" value="kg" v-model="form.unit" />
                        <label for="unit1" class="ml-2 mr-4">kg</label>
                        <RadioButton id="unit2" name="unit" value="L" v-model="form.unit" />
                        <label for="unit2" class="ml-2 mr-4">L</label>
                        <RadioButton id="unit3" name="unit" value="EA" v-model="form.unit" />
                        <label for="unit3" class="ml-2">EA</label>
                    </label>
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">유통기한</label>
                    <InputText v-model="form.expiration" class="w-half" />
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="expirationUnit1" name="expirationUnit" value="일" v-model="form.expirationUnit" />
                        <label for="expirationUnit1" class="ml-2 mr-4">일</label>
                        <RadioButton id="expirationUnit2" name="expirationUnit" value="개월" v-model="form.expirationUnit" />
                        <label for="expirationUnit2" class="ml-2 mr-4">개월</label>
                        <RadioButton id="expirationUnit2" name="expirationUnit" value="년" v-model="form.expirationUnit" />
                        <label for="expirationUnit2" class="ml-2">년</label>
                    </label>
                </div>
                <div>
                    <label class="block mb-1">제품매뉴얼</label>
                    <InputText v-model="form.manual" class="w-full" />
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">제품코드</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.productId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
                    </div>
                </div>
                <div>
                    <label class="block mb-1">제품명</label>
                    <InputText v-model="form.productName" class="w-full" />
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">안전재고</label>
                    <InputText v-model="form.safetyStock" class="w-half" />
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="safetyStockUnit1" name="safetyStockUnit" value="kg" v-model="form.safetyStockUnit" />
                        <label for="safetyStockUnit1" class="ml-2 mr-4">kg</label>
                        <RadioButton id="safetyStockUnit2" name="safetyStockUnit" value="L" v-model="form.safetyStockUnit" />
                        <label for="safetyStockUnit2" class="ml-2 mr-4">L</label>
                        <RadioButton id="safetyStockUnit3" name="safetyStockUnit" value="EA" v-model="form.safetyStockUnit" />
                        <label for="safetyStockUnit3" class="ml-2">EA</label>
                    </label>
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">상태</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="활성" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">활성</label>
                        <RadioButton id="status3" name="status" value="비활성" v-model="form.status" />
                        <label for="status3" class="ml-2">비활성</label>
                    </label>
                </div>
                <div>
                    <label class="block mb-1">보관조건</label>
                    <InputText v-model="form.storageCondition" class="w-full" />
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
