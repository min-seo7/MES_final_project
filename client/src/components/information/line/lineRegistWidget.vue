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
    lineId: '',
    lineName: '',
    flowId: '',
    productId: '',
    note: '',
    status: ''
});

const registLine = async () => {
    if (!form.value.productId) {
        alert('제품코드를 선택해주세요.');
        return;
    }
    if (!form.value.status) {
        alert('상태를 선택해주세요.');
        return;
    }
    if (props.detailData.length === 0) {
        alert('Line 상세 항목을 추가해주세요.');
        return;
    }

    try {
        const payload = {
            bomInfo: {
                // 서버에서 받을 기본 정보
                lineId: form.value.lineId,
                lineName: form.value.lineName,
                flowId: form.value.flowId,
                productId: form.value.productId,
                note: form.value.note,
                status: form.value.status
            },
            bomDetails: props.detailData // 서버에서 받을 상세 리스트
        };

        const res = await axios.post('/api/information/line', payload, {
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
            <Button label=" 등록 " rounded @click="registLine()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">라인코드</label>
                    <InputText v-model="form.lineId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
                </div>
                <div>
                    <label class="block mb-1">제품코드</label>
                    <InputText v-model="form.productId" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">흐름도코드</label>
                    <InputText v-model="form.flowId" class="w-full" />
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
                    <label class="block mb-1">라인명</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.lineName" class="w-full" />
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
                <div>
                    <label class="block mb-1">비고</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.note" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
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
