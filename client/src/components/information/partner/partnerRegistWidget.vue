<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
    partnerType: '',
    partnerId: '',
    partnerName: '',
    businessNo: '',
    manager: '',
    address: '',
    email: '',
    mainTel: '',
    status: ''
});

const registPartner = async () => {
    try {
        const res = await axios.post('/api/information/partner', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('거래처 등록실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록/수정</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registPartner()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">거래처유형</label>
                    <InputText v-model="form.partnerType" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">거래처명</label>
                    <InputText v-model="form.partnerName" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">담당자</label>
                    <InputText v-model="form.manager" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">E-Mail</label>
                    <InputText v-model="form.email" class="w-full" />
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
                    <label class="block mb-1">거래처코드</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.partnerId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
                    </div>
                </div>
                <div>
                    <label class="block mb-1">사업자번호</label>
                    <InputText v-model="form.businessNo" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">거래처주소</label>
                    <InputText v-model="form.address" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">대표번호</label>
                    <InputText v-model="form.mainTel" class="w-full" />
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
