<script setup>
import { ref, defineEmits } from 'vue';
import CommonModal from '@/components/common/modal.vue';
import axios from 'axios';


const emits = defineEmits(['flowchartDetail']);
const item = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const form = ref({
    processId: '',
    processName: '',
    useOrder: '',
    status: ''
});

const resetRegist = async () => {

// 등록 상태: 전체 필드 초기화
form.value = {
    processId: '',
    processName: '',
    useOrder: '',
    status: ''
};
};

// 모달 열기
const openModal = async (type) => {
    modalType.value = type;
    showModal.value = true;

    let res;
    if (type === 'processId') {
        try {
            res = await axios.get('/api/information/line/getProcessId');
            item.value = res.data.map((item, index) => ({
                num: index + 1,
                processId: item.process_id,
                processName: item.process_name
            }));
            columns.value = [
                { field: 'processId', header: '공정코드' },
                { field: 'processName', header: '공정명' }
            ];
        } catch (error) {
            console.error('공정코드 API 호출 오류:', error);
            alert('공정코드 목록을 불러오는 데 실패했습니다.');
        }
    } 
};

// 모달 선택 완료
const selectModalValue = (item) => {
    if (!item) {
        alert('선택된 항목이 없습니다.');
        return;
    }
    form.value.processId = item.processId;
    form.value.processName = item.processName;


    
    selectedItem.value = item; // 선택된 항목 전체를 저장

    showModal.value = false;
};


const addFlowchartdetail = () => {
    emits('flowchartDetail', form.value);
};
</script>

<template>
    <div class="card p-2 border rounded relative mt-4">
        
        <div class="absolute top-2 right-2 z-10">
            <div class="space-x-2">
                <Button label=" 추가 " size="small" rounded @click="addFlowchartdetail()" />
                <Button label=" 초기화 " size="small" severity="info" rounded @click="resetRegist()"/>
            </div>
        </div>

        <div class="flex flex-row gap-6 items-center pt-4">
            <div class="flex-1">
                <label for="processId" class="block mb-1">공정코드</label>
                <IconField iconPosition="left" class="w-full">
                    <InputText id="processId" type="text" class="w-full" v-model="form.processId" />
                    <InputIcon class="pi pi-search" @click="openModal('processId')" />
                </IconField>
            </div>

            <div class="flex-1">
                <label class="block mb-1">공정명</label>
                <InputText v-model="form.processName" class="w-full" />
            </div>

            <div class="flex-1">
                <label class="block mb-1">순서</label>
                <InputText v-model="form.useOrder" class="w-full" />
            </div>

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
    <CommonModal v-model:visible="showModal" :modalType="modalType" :items="item" :columns="columns" v-model:selectedItem="selectedItem" @confirm="selectModalValue" />

</template>

<style scoped>
/* 기존 스타일은 유지 */
.font-semibold.text-xl.mb-4 {
    margin: 0;
}
</style>