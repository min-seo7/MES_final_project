<script setup>
import { ref } from 'vue';
import axios from 'axios';

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

const registProduct = async () => {
    try {
        const res = await axios.post('/api/information/product', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('제품등록실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록/수정</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registProduct()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">제품유형</label>
                    <InputText v-model="form.productType" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">제품형태</label>
                    <InputText v-model="form.productForm" class="w-full" />
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">규격</label>
                    <InputText v-model="form.specification" class="w-half" />
                    <label class="block mb-1" style="text-align: center">단위</label>
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
                    <label class="block mb-1" style="text-align: center">유통기한단위</label>
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
                        <InputText v-model="form.productId" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
                </div>
                <div>
                    <label class="block mb-1">제품명</label>
                    <InputText v-model="form.productName" class="w-full" />
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">안전재고</label>
                    <InputText v-model="form.safetyStock" class="w-half" />
                    <label class="block mb-1" style="text-align: center">안전재고단위</label>
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
