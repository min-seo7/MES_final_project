<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
    name: '',
    phone: '',
    email: '',
    hireDate: '',
    leaveDate: '',
    empId: '',
    auth: '',
    dept: ''
});

const registMaterial = async () => {
    try {
        const res = await axios.post('/api/information/material', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('자재등록실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록/수정</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registMaterial()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">자재유형</label>
                    <InputText v-model="form.name" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">자재명</label>
                    <InputText v-model="form.phone" class="w-full" />
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">규격</label>
                    <InputText v-model="form.phone" class="w-half" />
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
                <div>
                    <label class="block mb-1">상태</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="활성" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">활성</label>
                        <RadioButton id="status2" name="status" value="비활성" v-model="form.status" />
                        <label for="status2" class="ml-2 mr-4">비활성</label>
                    </label>
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">자재코드</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.empId" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
                </div>
                <div>
                    <label class="block mb-1">보관조건</label>
                    <InputText v-model="form.email" class="w-full" />
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">안전재고</label>
                    <InputText v-model="form.phone" class="w-half" />
                    <label class="block mb-1" style="text-align: center">안전재고단위</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="safeunit1" name="safeunit" value="kg" v-model="form.safeunit" />
                        <label for="safeunit1" class="ml-2 mr-4">kg</label>
                        <RadioButton id="safeunit2" name="safeunit" value="L" v-model="form.safeunit" />
                        <label for="safeunit2" class="ml-2 mr-4">L</label>
                        <RadioButton id="safeunit3" name="safeunit" value="EA" v-model="form.safeunit" />
                        <label for="safeunit3" class="ml-2">EA</label>
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
