<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
    bomId: '',
    prodId: '',
    prodName: '',
    prodType: '',
    status: ''
});

const registBom = async () => {
    try {
        const res = await axios.post('/api/information/bom', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('BOM등록실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registBom()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">BOM코드</label>
                    <InputText v-model="form.bomId" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">제품명</label>
                    <InputText v-model="form.prodName" class="w-full" />
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
                    <label class="block mb-1">제품코드</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.prodId" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">제품유형</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="prodType1" name="prodType" value="반제품" v-model="form.prodType" />
                        <label for="prodType1" class="ml-2 mr-4">반제품</label>
                        <RadioButton id="prodType2" name="prodType" value="완제품" v-model="form.prodType" />
                        <label for="prodType2" class="ml-2">완제품</label>
                    </label>
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
