<script setup>
import { ref, defineEmits } from 'vue';

const emits = defineEmits(['flowchartDetail']);

const form = ref({
    processId: '',
    processName: '',
    useOrder: '',
    status: ''
});

const addFlowchartdetail = () => {
    emits('flowchartDetail', form.value);
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록</div>
        <div class="space-x-2"><Button label=" 등록 " rounded @click="addFlowchartdetail()" /> <Button label=" 초기화 " severity="info" rounded /></div>
    </div>
    <div class="card mt-4 p-4 border rounded" style="height: 120px">
        <div class="flex flex-row gap-6 items-center">
            <!-- 공정코드 -->
            <div class="flex-1">
                <label for="processId" class="block mb-1">공정코드</label>
                <IconField iconPosition="left" class="w-full">
                    <InputText id="processId" type="text" class="w-full" v-model="form.processId" />
                    <InputIcon class="pi pi-search" @click="openModal('processId')" />
                </IconField>
            </div>

            <!-- 공정명 -->
            <div class="flex-1">
                <label class="block mb-1">공정명</label>
                <InputText v-model="form.processName" class="w-full" />
            </div>

            <!-- 순서 -->
            <div class="flex-1">
                <label class="block mb-1">순서</label>
                <InputText v-model="form.useOrder" class="w-full" />
            </div>

            <!-- 상태 -->
            <div class="flex-1">
                <label class="block mb-1">상태</label>
                <div class="flex items-center gap-4 border rounded px-3 py-2">
                    <RadioButton id="status1" name="status" value="사용" v-model="form.status" />
                    <label for="status1">사용</label>
                    <RadioButton id="status2" name="status" value="미사용" v-model="form.status" />
                    <label for="status2">미사용</label>
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
