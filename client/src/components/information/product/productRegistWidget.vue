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
    productCategory: '',
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
                productCategory: '',
                storageCondition: ''
            };
        }
    },
    { immediate: true }
);

const registProduct = async () => {
    try {
        const res = await axios.post('/api/information/product', form.value);
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
            productCategory: '',
            storageCondition: ''
        };
        alert('등록이 완료되었습니다.');
    } catch (err) {
        alert('등록할 수 없습니다.');
    }
};

const modifyProduct = async () => {
    try {
        const res = await axios.post('/api/information/product/modify', form.value);
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
            productCategory: '',
            storageCondition: ''
        };
        alert('수정이 완료되었습니다.');
    } catch (err) {
        alert('수정할 수 없습니다.');
    }
};

const resetRegist = async () => {
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
            productCategory: '',
            storageCondition: ''
        };
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div></div>
        <div class="space-x-2">
            <Button label=" 등록 " size="small" rounded @click="registProduct()" :disabled="form.productId?.trim() !== ''" />
            <Button label=" 수정 " size="small" rounded :disabled="form.productId?.trim() === ''" @click="modifyProduct()" />
            <Button label=" 초기화 " size="small" severity="info" rounded @click="resetRegist()" />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">제품코드</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.productId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="block mb-1">제품유형</label>
                        <div class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="productType1" name="productType" value="반제품" v-model="form.productType" />
                            <label for="productType1" class="ml-2 mr-4">반제품</label>
                            <RadioButton id="productType2" name="productType" value="완제품" v-model="form.productType" />
                            <label for="productType2" class="ml-2 mr-4">완제품</label>
                        </div>
                    </div>
                    <div class="flex-1">
                        <label class="block mb-1">제품형태</label>
                        <div class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="productForm1" name="productForm" value="분말형" v-model="form.productForm" />
                            <label for="productForm1" class="ml-2 mr-4">분말형</label>
                            <RadioButton id="productForm2" name="productForm" value="과립형" v-model="form.productForm" />
                            <label for="productForm2" class="ml-2 mr-4">과립형</label>
                            <RadioButton id="productForm3" name="productForm" value="액상형" v-model="form.productForm" />
                            <label for="productForm3" class="ml-2">액상형</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block mb-1">규격</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.specification" class="flex-1" />
                        <div class="flex flex-1 items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="unit1" name="unit" value="kg" v-model="form.unit" />
                            <label for="unit1" class="ml-2 mr-4">kg</label>
                            <RadioButton id="unit2" name="unit" value="L" v-model="form.unit" />
                            <label for="unit2" class="ml-2 mr-4">L</label>
                            <RadioButton id="unit3" name="unit" value="EA" v-model="form.unit" />
                            <label for="unit3" class="ml-2">EA</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block mb-1">유통기한</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.expiration" class="flex-1" />
                        <div class="flex flex-1 items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="expirationUnit1" name="expirationUnit" value="일" v-model="form.expirationUnit" />
                            <label for="expirationUnit1" class="ml-2 mr-4">일</label>
                            <RadioButton id="expirationUnit2" name="expirationUnit" value="개월" v-model="form.expirationUnit" />
                            <label for="expirationUnit2" class="ml-2 mr-4">개월</label>
                            <RadioButton id="expirationUnit3" name="expirationUnit" value="년" v-model="form.expirationUnit" />
                            <label for="expirationUnit3" class="ml-2">년</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">제품명</label>
                    <InputText v-model="form.productName" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">상태</label>
                    <div class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="사용" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">사용</label>
                        <RadioButton id="status2" name="status" value="미사용" v-model="form.status" />
                        <label for="status2" class="ml-2">미사용</label>
                    </div>
                </div>
                <div>
                    <label class="block mb-1">안전재고</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.safetyStock" class="flex-1" />
                        <div class="flex flex-1 items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                            <RadioButton id="safetyStockUnit1" name="safetyStockUnit" value="kg" v-model="form.safetyStockUnit" />
                            <label for="safetyStockUnit1" class="ml-2 mr-4">kg</label>
                            <RadioButton id="safetyStockUnit2" name="safetyStockUnit" value="L" v-model="form.safetyStockUnit" />
                            <label for="safetyStockUnit2" class="ml-2 mr-4">L</label>
                            <RadioButton id="safetyStockUnit3" name="safetyStockUnit" value="EA" v-model="form.safetyStockUnit" />
                            <label for="safetyStockUnit3" class="ml-2">EA</label>
                        </div>
                    </div>
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
