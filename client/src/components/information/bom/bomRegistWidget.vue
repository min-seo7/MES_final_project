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
    bomId: '',
    prodId: '',
    prodName: '',
    prodType: '',
    status: ''
});

const registBom = async () => {
    if (!form.value.prodId) {
        alert('제품코드를 선택해주세요.');
        return;
    }
    if (!form.value.status) {
        alert('상태를 선택해주세요.');
        return;
    }
    if (props.detailData.length === 0) {
        alert('BOM 상세 항목을 추가해주세요.');
        return;
    }

    try {
        const payload = {
            bomInfo: {
                // 서버에서 받을 기본 정보
                bomId: form.value.bomId,
                prodId: form.value.prodId,
                prodName: form.value.prodName,
                prodType: form.value.prodType,
                status: form.value.status
            },
            bomDetails: props.detailData // 서버에서 받을 상세 리스트
        };

        const res = await axios.post('/api/information/bom', payload, {
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
            <Button label=" 등록 " rounded @click="registBom()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="w-1/4">
                <label class="block mb-1">BOM코드</label>
                <InputText v-model="form.bomId" class="w-full" readonly="true" placeholder="자동생성" style="background-color: lightgrey" />
            </div>
            <div class="w-1/4">
                <label class="block mb-1">제품명</label>
                <InputText v-model="form.prodName" class="w-full" />
            </div>

            <div class="w-1/4">
                <label class="block mb-1">제품코드</label>
                <IconField iconPosition="left" class="w-full">
                    <InputText v-model="form.prodId" class="w-full" />
                    <InputIcon class="pi pi-search" />
                </IconField>
            </div>
            <div style="display: flex; gap: 20px" class="w-1/4">
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
</template>

<style scoped>
.font-semibold.text-xl.mb-4 {
    margin: 0;
}
</style>
