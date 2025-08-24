<script setup>
import { ref, defineEmits } from 'vue';
import CommonModal from '@/components/common/modal.vue';
import axios from 'axios'; // axios가 import 되어 있는지 확인하세요

const emits = defineEmits(['lineDetail']);
const item = ref([]);
const columns = ref([]);
const showModal = ref(false);
const modalType = ref('');
const selectedItem = ref(null);

const form = ref({
    processId: '',
    processName: '',
    equipmentId: '',
    equipmentName: '',
    useOrder: '',
    status: ''
});

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
            console.log(item.value);
            columns.value = [
                { field: 'processId', header: '공정코드' },
                { field: 'processName', header: '공정명' }
            ];
        } catch (error) {
            console.error('공정코드 API 호출 오류:', error);
            alert('공정코드 목록을 불러오는 데 실패했습니다.');
        }
    } else if (type === 'equipmentId') {
        try {
            res = await axios.get('/api/information/line/getEquipmentId');
            item.value = res.data.map((item, index) => ({
                num: index + 1,
                equipmentId: item.equipment_id,
                equipmentName: item.equipment_name
            }));
            columns.value = [
                { field: 'equipmentId', header: '설비코드' },
                { field: 'equipmentName', header: '설비명' }
            ];
        } catch (error) {
            console.error('설비코드 API 호출 오류:', error);
            alert('설비코드 목록을 불러오는 데 실패했습니다.');
        }
    }
};

// 모달 선택 완료
const selectModalValue = (item) => {
    if (!item) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    if (modalType.value === 'processId') {
        form.value.processId = item.processId;
        form.value.processName = item.processName; 
    } else if (modalType.value === 'equipmentId') {
        form.value.equipmentId = item.equipmentId;
        form.value.equipmentName = item.equipmentName; 
    }
    
    selectedItem.value = item;

    showModal.value = false;
};

const addLinedetail = () => {
    emits('lineDetail', form.value);
    form.value = {
            processId: '',
    processName: '',
    equipmentId: '',
    equipmentName: '',
    useOrder: '',
    status: ''
        };
};

const resetRegist = async () => {

        // 등록 상태: 전체 필드 초기화
        form.value = {
            processId: '',
    processName: '',
    equipmentId: '',
    equipmentName: '',
    useOrder: '',
    status: ''
        };
};
</script>

<template>
    <div class="card mt-4 p-4 border rounded relative">
        <div class="absolute top-2 right-2 z-10">
            <div class="space-x-2">
                <Button label=" 등록 " size="small" rounded @click="addLinedetail()" />
                <Button label=" 초기화 " size="small" severity="info" rounded @click="resetRegist()"/>
            </div>
        </div>

        <div class="flex flex-row gap-4 items-center pt-4">
            <div class="flex-1">
                <label class="block">공정코드</label>
            <IconField iconPosition="left" class="w-full">
                <InputText v-model="form.processId" class="w-full" />
                        <InputIcon class="pi pi-search" @click="openModal('processId')" />
                    </IconField></div>
            <div class="flex-1">
                <label class="block">설비코드</label>
                <IconField iconPosition="left" class="w-full">
                    <InputText v-model="form.equipmentId" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openModal('equipmentId')" />
                    </IconField>
            </div>
            <div class="flex-1">
                <label class="block">사용순서</label>
                <InputText v-model="form.useOrder" class="w-full" />
            </div>
            <div class="flex-1">
                <label class="block">상태</label>
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
.font-semibold.text-xl.mb-4 {
    margin: 0;
}
</style>