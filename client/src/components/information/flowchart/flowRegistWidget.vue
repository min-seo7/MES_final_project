<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    detailData: {
        type: Array,
        default: () => []
    }
});

const form = ref({
    flowId: '',
    flowName: '',
    productId: '',
    productName: '',
    note: '',
    status: '',
    flowchart: ''
});

const registFlowchart = async () => {
    if (!form.value.productId) {
        alert('제품코드를 선택해주세요.');
        return;
    }
    if (!form.value.status) {
        alert('상태를 선택해주세요.');
        return;
    }
    if (props.detailData.length === 0) {
        alert('공정흐름도 상세 항목을 추가해주세요.');
        return;
    }
    try {
        const payload = {
            flowchartInfo: {
                // 서버에서 받을 기본 정보
                flowId: form.value.flowId,
                flowName: form.value.flowName,
                productId: form.value.productId,
                productName: form.value.productName,
                note: form.value.note,
                status: form.value.status,
                flowchart: form.value.flowchart
            },
            flowchartDetails: props.detailData // 서버에서 받을 상세 리스트
        };

        const res = await axios.post('/api/information/flowchart', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        alert(res.data.message || '등록 성공');
    } catch (err) {
        console.error(err);
        alert('등록 실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registFlowchart()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">흐름도코드</label>
                    <InputText v-model="form.flowId" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">제품코드</label>
                    <InputText v-model="form.productId" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">비고</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.note" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
                </div>
                <div>
                    <label class="block mb-1">흐름도</label>
                    <InputText v-model="form.flowchart" class="w-full" />
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">흐름도명</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.flowName" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
                </div>
                <div>
                    <label class="block mb-1">제품명</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.productName" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
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
        </div>
    </div>
</template>

<style scoped>
.font-semibold.text-xl.mb-4 {
    margin: 0;
}
</style>
