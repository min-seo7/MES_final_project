<script setup>
import { ref, defineEmits } from 'vue';

const emits = defineEmits(['lineDetail']);

const form = ref({
    processId: '',
    processName: '',
    equipmentId: '',
    equipmentName: '',
    useOrder: '',
    status: ''
});

const addLinedetail = () => {
    emits('lineDetail', form.value);
};

</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="addLinedetail()" />
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
                    <label class="block mb-1">설비코드</label>
                    <InputText v-model="form.equipmentId" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">설비명</label>
                    <InputText v-model="form.equipmentName" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">사용순서</label>
                    <InputText v-model="form.useOrder" class="w-full" />
                </div>
                <div style="display: flex; gap: 20px">
                    <label class="block mb-1" style="text-align: center">상태</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="status1" name="status" value="사용" v-model="form.status" />
                        <label for="status1" class="ml-2 mr-4">사용</label>
                        <RadioButton id="status2" name="status" value="미사용" v-model="form.status" />
                        <label for="status2" class="ml-2">미사용</label>
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
