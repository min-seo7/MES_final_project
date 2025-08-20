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
    processId: '',
    processName: '',
    isInspection: '',
    status: ''
});

const modifyProcess = async () => {
    try {
        const res = await axios.post('/api/information/process/modify', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('공정수정실패');
    }
}

const resetRegist = async () => {
    if (form.value.processId?.trim()) {
        // 수정 상태: 현재 선택된 데이터를 다시 form에 반영
        if (props.items && props.items.length) {
            form.value = { ...props.items[0], processId: props.items[0].processId?.trim() || '' };
        }
    } else {
        // 등록 상태: 전체 필드 초기화
        form.value = {
            processId: '',
    processName: '',
    isInspection: '',
    status: ''
        };
    }
};
watch(
    () => props.items,
    (newVal) => {
        if (newVal && newVal.length) {
            form.value = { ...newVal[0], processId: newVal[0].processId?.trim() || '' };
        } else {
            form.value = {
                processId: '',
                processName: '',
                isInspection: '',
                status: ''
            };
        }
    },
    { immediate: true }
);

const registProcess = async () => {
    try {
        const res = await axios.post('/api/information/process', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('공정등록실패');
    }
};
// const modifyProcess = async () => {
//     try {
//         const res = await axios.post('/api/information/process/modify', form.value);
//         alert(res.data.message);
//     } catch (err) {
//         console.log('공정수정실패');
//     }
// };
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록/수정</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registProcess()" :disabled="form.processId?.trim() !== ''" />
            <Button label=" 수정 " rounded :disabled="form.processId?.trim() === ''" @click="modifyProcess()" />
            <Button label=" 초기화 " severity="info" rounded @click="resetRegist()" />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">공정코드</label>
                    <InputText v-model="form.processId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
                </div>
                <div>
                    <label class="block mb-1">검사유무</label>
                    <label class="flex items-center border rounded cursor-pointer hover:bg-gray-100 px-3 h-[38px]">
                        <RadioButton id="inspection1" name="inspection" value="무검사" v-model="form.isInspection" />
                        <label for="inspection1" class="ml-2 mr-4">무검사</label>

                        <RadioButton id="inspection2" name="inspection" value="유검사" v-model="form.isInspection" />
                        <label for="inspection2" class="ml-2 mr-4">유검사</label>
                    </label>
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">공정명</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.processName" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
                </div>
                <div>
                    <label class="block mb-1">상태</label>
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
