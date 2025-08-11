<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
    processId: '',
    processName: '',
    useOrder: '',
    status: ''
});

const registDetailFlowchart = async () => {
    try {
        const res = await axios.post('/api/information/flowchart/detail', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('detail flowchart등록실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registDetailFlowchart()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">공정코드</label>
                    <InputText v-model="form.processId" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">공정명</label>
                    <InputText v-model="form.processName" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">순서</label>
                    <InputText v-model="form.useOrder" class="w-full" />
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">상태</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="활성" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">활성</label>
                        <RadioButton id="status2" name="status" value="비활성" v-model="form.status" />
                        <label for="status2" class="ml-2">비활성</label>
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
