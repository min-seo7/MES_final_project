<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
    warehouseId: '',
    warehouse: '',
    zone: '',
    subZone: '',
    floor: '',
    location: '',
    warehouseType: '',
    status: ''
});

const registWarehouse = async () => {
    try {
        const res = await axios.post('/api/information/warehouse', form.value);
        alert(res.data.message);
    } catch (err) {
        console.log('창고등록실패');
    }
};
</script>

<template>
    <div class="flex items-center justify-between font-semibold text-xl mb-4">
        <div>등록/수정</div>
        <div class="space-x-2">
            <Button label=" 등록 " rounded @click="registWarehouse()" />
            <Button label=" 초기화 " severity="info" rounded />
        </div>
    </div>
    <div class="card mt-4 p-4 border rounded">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 왼쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">창고코드</label>
                    <InputText v-model="form.warehouseId" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">구역</label>
                    <InputText v-model="form.zone" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">층</label>
                    <InputText v-model="form.floor" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">창고유형</label>
                    <InputText v-model="form.warehouseType" class="w-full" />
                </div>
            </div>

            <!-- 오른쪽 영역 -->
            <div class="flex flex-col gap-4 w-full">
                <div>
                    <label class="block mb-1">창고</label>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="form.warehouse" class="w-full" />
                        <!--<Button label="생성" size="small" />-->
                    </div>
                </div>
                <div>
                    <label class="block mb-1">세부구역</label>
                    <InputText v-model="form.subZone" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1">위치</label>
                    <InputText v-model="form.location" class="w-full" />
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
